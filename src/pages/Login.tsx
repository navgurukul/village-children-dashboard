
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  error: string;
}

const Login = ({ onLogin, error }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#488b8f] border-[#5ea3a3]">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">
            Student Data Dashboard
          </CardTitle>
          <p className="text-center text-gray-300 text-sm">
            Please sign in to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-[#5ea3a3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#add2c9] bg-white text-[#488b8f]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#5ea3a3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#add2c9] bg-white text-[#488b8f]"
                required
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#add2c9] hover:bg-[#5ea3a3] text-[#488b8f] hover:text-white"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-300">
            Demo credentials: admin / password
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
