
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from './pages/Login';
import AppShell from './components/AppShell';
import { apiClient } from './lib/api';
import mixpanel from './lib/mixpanel';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const response = await apiClient.login(credentials.username, credentials.password);
      
      if (response.success) {
        apiClient.setToken(response.data.token);
        setIsAuthenticated(true);

        // Store user info for Mixpanel tracking
        const { id, email, role, name } = response.data.user;
        localStorage.setItem('user_id', id);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_name', name); 

        // Identify the user in Mixpanel for user profile tracking
        mixpanel.identify(id);
        
        // Set user properties in Mixpanel
        mixpanel.people.set({
          $name: name,
          $email: email,
          role: role,
          $created: new Date().toISOString(),
          user_id: id
        });

        // Track successful login
        mixpanel.track('User Login', {
          user_id: id,
          user_name: name, 
          email: email,
          role: role,
          login_time: new Date().toISOString(),
          status: 'Success'
        });
      } else {
        setLoginError(response.message || 'Login failed');
        
        // Track failed login
        mixpanel.track('User Login', {
          user_id: credentials.username,
          email: '',
          role: '',
          login_time: new Date().toISOString(),
          status: 'Failure'
        });
      }
    } catch (error) {
      setLoginError('Invalid username or password');

      // Track failed login
      mixpanel.track('User Login', {
        user_id: credentials.username,
        email: '',
        role: '',
        login_time: new Date().toISOString(),
        status: 'Failure'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.clearToken();
    setIsAuthenticated(false);
    setLoginError('');

    // Track logout event before clearing user identity
    const userId = localStorage.getItem('user_id');
    if (userId) {
      mixpanel.track('User Logout', {
        user_id: userId,
        user_name: localStorage.getItem('user_name') || 'unknown',
        user_role: localStorage.getItem('user_role') || 'unknown',
        logout_time: new Date().toISOString()
      });
    }

    // Reset Mixpanel identity
    mixpanel.reset();

    // Optionally clear stored user info
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-poppins">
          <Toaster />
          <Sonner />
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} error={loginError} isLoading={isLoading} />
          ) : (
            <AppShell onLogout={handleLogout} />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
