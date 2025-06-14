
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simple authentication - in production, this should be handled by a proper auth system
    if (credentials.username === 'admin' && credentials.password === 'password') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} error={loginError} />
        ) : (
          <div>
            <div className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
              <h1 className="text-lg font-semibold">Student Data Dashboard</h1>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
            <Dashboard />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
