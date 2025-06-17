
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AppSidebar from './components/AppSidebar';

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
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-white">
                <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
                <div className="flex-1 flex flex-col">
                  {/* Top Header */}
                  <div className="bg-[#488b8f] shadow-sm border-b border-[#5ea3a3] px-6 py-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-white hover:bg-[#5ea3a3]" />
                        <h1 className="text-lg font-semibold text-white">Student Data Dashboard</h1>
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
                  <div className="flex-1">
                    {currentPage === 'dashboard' ? <Dashboard /> : <Students />}
                  </div>
                </div>
              </div>
            </SidebarProvider>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
