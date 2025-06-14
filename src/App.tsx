
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
            <div className="min-h-screen bg-white">
              {/* Navigation Header */}
              <div className="bg-[#488b8f] shadow-sm border-b border-[#5ea3a3] px-6 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <h1 className="text-lg font-semibold text-white">Student Data Dashboard</h1>
                    <nav className="flex gap-4">
                      <button
                        onClick={() => setCurrentPage('dashboard')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          currentPage === 'dashboard' 
                            ? 'bg-[#add2c9] text-[#488b8f]' 
                            : 'text-gray-300 hover:text-white hover:bg-[#5ea3a3]'
                        }`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => setCurrentPage('students')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          currentPage === 'students' 
                            ? 'bg-[#add2c9] text-[#488b8f]' 
                            : 'text-gray-300 hover:text-white hover:bg-[#5ea3a3]'
                        }`}
                      >
                        Student Records
                      </button>
                    </nav>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Page Content */}
              {currentPage === 'dashboard' ? <Dashboard /> : <Students />}
            </div>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
