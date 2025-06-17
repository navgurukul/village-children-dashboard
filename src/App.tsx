
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'students'>('dashboard');

  const handleLogin = (credentials: { username: string; password: string }) => {
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
    setCurrentPage('dashboard');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-poppins">
          <Toaster />
          <Sonner />
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} error={loginError} />
          ) : (
            <div className="min-h-screen w-full bg-[#faf9f9]">
              {/* Full Width Top Header */}
              <div className="w-full bg-gradient-to-r from-[#488b8f] to-[#5ea3a3] shadow-lg border-b border-[#add2c9] px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">Student Data Management System</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage('dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === 'dashboard'
                            ? 'bg-white text-[#488b8f] shadow-md'
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => setCurrentPage('students')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === 'students'
                            ? 'bg-white text-[#488b8f] shadow-md'
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        Student Records
                      </button>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-white hover:text-[#add2c9] transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Page Content */}
              <div className="w-full">
                {currentPage === 'dashboard' ? <Dashboard /> : <Students />}
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
