
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import StatusMessage from "@/components/auth/StatusMessage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const validateInputs = () => {
    setErrorMessage("");
    
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    
    if (!password.trim()) {
      setErrorMessage("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleAuth = async (type: "login" | "signup") => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    setSuccessMessage("");
    
    try {
      console.log(`Attempting to ${type === "login" ? "login" : "sign up"} with email: ${email}`);
      
      if (type === "signup") {
        setInfoMessage("Creating your account...");
        
        const { error, success } = await signUp(email, password);
        
        if (error) {
          console.error(`Signup error:`, error);
          
          if (error.message.includes("already registered")) {
            setErrorMessage("This email is already registered. Please log in instead.");
            setActiveTab("login");
          } else {
            setErrorMessage(error.message);
          }
        } else if (success) {
          if (email === 'test@example.com') {
            setSuccessMessage("Test account is ready. You can now log in.");
            setActiveTab("login");
          } else {
            setSuccessMessage("Account created successfully! You can now log in.");
            setActiveTab("login");
          }
        }
      } else {
        // Login
        setInfoMessage("Logging in...");
        
        try {
          const { error, success } = await signIn(email, password);
          
          if (error) {
            console.error(`Login error:`, error);
            
            if (error.message.includes("Invalid login credentials")) {
              setErrorMessage("Invalid email or password. Please try again or create an account.");
            } else if (error.message.toLowerCase().includes("network") || 
                      error.message.toLowerCase().includes("failed") ||
                      error.message.toLowerCase().includes("connection")) {
              setErrorMessage("Network error. Please check your connection and try again.");
            } else if (error.message.includes("Email not confirmed")) {
              setErrorMessage("Please confirm your email before logging in. Check your inbox for a confirmation link.");
            } else {
              setErrorMessage(error.message);
            }
          }
          
          // If success, the navigation happens in the auth context
          if (!success) {
            setInfoMessage("");
          }
        } catch (e) {
          console.error("Unexpected error during login:", e);
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useTestCredentials = () => {
    setEmail("test@example.com");
    setPassword("password123");
    setInfoMessage("Using test credentials. Click the login button to continue.");
    setErrorMessage("");
  };

  return (
    <AuthLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <StatusMessage 
          errorMessage={errorMessage}
          infoMessage={infoMessage}
          successMessage={successMessage}
        />
        
        <TabsContent value="login">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleAuth={handleAuth}
            useTestCredentials={useTestCredentials}
          />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleAuth={handleAuth}
            useTestCredentials={useTestCredentials}
          />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Login;
