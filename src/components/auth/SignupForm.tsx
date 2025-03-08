
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupFormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleAuth: (type: "signup") => void;
  useTestCredentials: () => void;
};

const SignupForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleAuth,
  useTestCredentials
}: SignupFormProps) => {
  return (
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
  );
};

export default SignupForm;
