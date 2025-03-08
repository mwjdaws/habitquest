
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleAuth: (type: "login") => void;
  useTestCredentials: () => void;
};

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleAuth,
  useTestCredentials
}: LoginFormProps) => {
  return (
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
  );
};

export default LoginForm;
