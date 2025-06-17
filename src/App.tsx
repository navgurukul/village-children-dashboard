
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
            <div className="min-h-screen w-full bg-white">
              {/* Full Width Top Header */}
              <div className="w-full bg-gradient-to-r from-[#488b8f] to-[#5ea3a3] shadow-lg border-b border-[#add2c9] px-6 py-4 z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">Student Data Management System</h1>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white hover:text-[#add2c9] transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Sidebar and Content */}
              <SidebarProvider>
                <div className="flex w-full">
                  <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
                  <div className="flex-1 flex flex-col">
                    {/* Content with Sidebar Toggle */}
                    <div className="bg-[#faf9f9] border-b border-[#add2c9] px-6 py-3">
                      <SidebarTrigger className="text-[#488b8f] hover:bg-[#add2c9]/20 p-2 rounded-lg" />
                    </div>

                    {/* Page Content */}
                    <div className="flex-1">
                      {currentPage === 'dashboard' ? <Dashboard /> : <Students />}
                    </div>
                  </div>
                </div>
              </SidebarProvider>
            </div>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
