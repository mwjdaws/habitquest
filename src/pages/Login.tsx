
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import StatusMessage from "@/components/auth/StatusMessage";
import { formatErrorMessage } from "@/lib/error-utils";

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

  // Clear messages when tab changes
  useEffect(() => {
    setErrorMessage("");
    setInfoMessage("");
    setSuccessMessage("");
  }, [activeTab]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // If already authenticated, don't render the login page
  if (user) return null;

  const validateInputs = () => {
    // Clear previous messages
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
            setErrorMessage(formatErrorMessage(error));
          }
        } else if (success) {
          setSuccessMessage("Account created successfully! You can now log in.");
          setActiveTab("login");
        }
      } else {
        // Login
        setInfoMessage("Logging in...");
        
        const { error, success } = await signIn(email, password);
        
        if (error) {
          console.error(`Login error:`, error);
          setErrorMessage(formatErrorMessage(error));
        }
        
        // If success, the navigation happens in the auth context
        if (!success) {
          setInfoMessage("");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage(formatErrorMessage(error));
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
          className="mb-4"
        />
        
        <TabsContent value="login">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleAuth={() => handleAuth("login")}
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
            handleAuth={() => handleAuth("signup")}
            useTestCredentials={useTestCredentials}
          />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Login;
