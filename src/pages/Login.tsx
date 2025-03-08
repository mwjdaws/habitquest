
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Flame, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

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
    
    try {
      console.log(`Attempting to ${type === "login" ? "login" : "sign up"} with email: ${email}`);
      
      if (type === "signup") {
        setInfoMessage("Creating your account...");
        
        const { error, success } = await signUp(email, password);
        
        if (error) {
          console.error(`Signup error:`, error);
          
          // Handle already registered users
          if (error.message.includes("already registered")) {
            setErrorMessage("This email is already registered. Please log in instead.");
            setActiveTab("login");
          } else {
            setErrorMessage(error.message);
          }
        } else if (success) {
          toast({
            title: "Account Created",
            description: "Please check your email for a confirmation link before logging in.",
          });
          
          // Switch to login tab after successful signup
          setActiveTab("login");
          setInfoMessage("Account created successfully. Please check your email for confirmation, then you can log in.");
        }
      } else {
        // Login
        setInfoMessage("Logging in...");
        
        const { error, success } = await signIn(email, password);
        
        if (error) {
          console.error(`Login error:`, error);
          
          if (error.message.includes("Invalid login credentials")) {
            setErrorMessage("Invalid email or password. Please try again or create an account.");
          } else if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Please confirm your email before logging in. Check your inbox for a confirmation link.");
          } else {
            setErrorMessage(error.message);
          }
        } else if (success && !window.location.pathname.includes('/dashboard')) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
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
    setInfoMessage("Using test credentials. Sign up first if this is your first time using the test account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-habit-soft-purple to-habit-soft-blue">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Flame className="h-12 w-12 text-habit-purple" />
          </div>
          <h1 className="text-3xl font-bold">HabitQuest</h1>
          <p className="text-muted-foreground">Track habits, achieve goals</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          {infoMessage && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2 text-blue-800">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={useTestCredentials}
                >
                  Use Test Credentials
                </Button>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAuth("login")}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ characters"
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={useTestCredentials}
                >
                  Use Test Credentials
                </Button>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAuth("signup")}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>For testing, use these credentials:</p>
          <p className="mt-1"><strong>Email:</strong> test@example.com</p>
          <p><strong>Password:</strong> password123</p>
          <p className="mt-2 text-xs">If using test account for the first time, click "Sign Up" first</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
