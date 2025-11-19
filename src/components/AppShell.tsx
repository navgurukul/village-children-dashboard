import React, { useState, useEffect, useRef } from 'react';
import { Home, Users, FileText, LogOut, MapPin, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHeader from './MobileHeader';
import NotificationCenter, { ExportJob } from './NotificationCenter';
import { apiClient } from '../lib/api';
import Dashboard from '../pages/Dashboard';
import ChildrenRecords from '../pages/ChildrenRecords';
import UserManagement from '../pages/UserManagement';
import AddNewUser from '../pages/AddNewUser';
import BulkUploadUsers from '../pages/BulkUploadUsers';
import ChildDetails from '../pages/ChildDetails';
import BalMitraDetails from '../pages/BalMitraDetails';
import EditUser from '../pages/EditUser';
import GramPanchayats from '../pages/GramPanchayats';
import AddNewGramPanchayat from '../pages/AddNewGramPanchayat';
import GramPanchayatProfile from '../pages/GramPanchayatProfile';
import BulkUploadVillages from '../pages/BulkUploadGramPanchayat';
import EditGramPanchayat from '../pages/EditGramPanchayat';
import Profile from '../pages/Profile';

interface AppShellProps {
  onLogout: () => void;
}

const AppShell = ({ onLogout }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const isMobile = useIsMobile();

  // Polling intervals for each job
  const pollingIntervals = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize jobs from localStorage on component mount
  useEffect(() => {
    const storedJobs = localStorage.getItem('export_jobs');
    if (storedJobs) {
      try {
        const jobs = JSON.parse(storedJobs).map((job: any) => ({
          ...job,
          createdAt: new Date(job.createdAt),
        }));
        
        // Filter out expired jobs (older than 7 days)
        const now = new Date();
        const filteredJobs = jobs.filter((job: ExportJob) => {
          const jobDate = new Date(job.createdAt);
          const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
          return (now.getTime() - jobDate.getTime()) < sevenDaysInMs;
        });
        
        // Update localStorage with filtered jobs
        if (filteredJobs.length !== jobs.length) {
          localStorage.setItem('export_jobs', JSON.stringify(filteredJobs));
        }
        
        setExportJobs(filteredJobs);
        
        // Start polling for incomplete jobs
        filteredJobs.forEach((job: ExportJob) => {
          if (job.status === 'processing' || job.status === 'pending') {
            startPolling(job.id);
          }
        });
      } catch (error) {
        console.error('Error loading jobs from localStorage:', error);
      }
    }
  }, []);

  // Poll job progress
  const pollJobProgress = async (jobId: string) => {
    try {
      const response = await apiClient.get(`/export/jobs/${jobId}`);
      if (response.success && response.data) {
        const jobData = response.data as any;
        const newProgress = jobData.progress?.percentage || 0;
        
        // Map backend status to frontend status
        const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
          'PENDING': 'pending',
          'IN_PROGRESS': 'processing',
          'COMPLETED': 'completed',
          'FAILED': 'failed'
        };
        
        updateExportJob(jobId, {
          status: statusMap[jobData.status] || 'failed',
          progress: newProgress,
          downloadUrl: jobData.downloadUrl,
          createdAt: new Date(jobData.createdAt),
        });

        // Stop polling if job is completed or failed
        if (jobData.status === 'COMPLETED' || jobData.status === 'FAILED') {
          if (pollingIntervals.current[jobId]) {
            clearInterval(pollingIntervals.current[jobId]);
            delete pollingIntervals.current[jobId];
          }
        }
      }
    } catch (error) {
      console.error('Error polling job progress:', error);
    }
  };

  // Start polling for a job
  const startPolling = (jobId: string) => {
    // Poll every 5 seconds
    const interval = setInterval(() => {
      pollJobProgress(jobId);
    }, 5000);
    pollingIntervals.current[jobId] = interval;
  };

  // Stop polling for a job
  const stopPolling = (jobId: string) => {
    if (pollingIntervals.current[jobId]) {
      clearInterval(pollingIntervals.current[jobId]);
      delete pollingIntervals.current[jobId];
    }
  };

  // Export job management functions
  const addExportJob = (job: ExportJob) => {
    setExportJobs(prev => {
      const updated = [job, ...prev];
      // Persist to localStorage
      localStorage.setItem('export_jobs', JSON.stringify(updated));
      return updated;
    });
    // Start polling for this job
    startPolling(job.id);
  };

  const updateExportJob = (jobId: string, updates: Partial<ExportJob>) => {
    setExportJobs(prev => {
      const updated = prev.map(job => job.id === jobId ? { ...job, ...updates } : job);
      // Persist to localStorage
      localStorage.setItem('export_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  const clearExportJob = async (jobId: string) => {
    try {
      // Find the job to check its status
      const job = exportJobs.find(j => j.id === jobId);
      
      // Only call DELETE API if job is NOT completed (pending, processing, or failed)
      if (job && job.status !== 'completed') {
        await apiClient.delete(`/export/jobs/${jobId}`);
      }
      
      // Stop polling
      stopPolling(jobId);
      // Remove from state and localStorage
      setExportJobs(prev => {
        const updated = prev.filter(job => job.id !== jobId);
        localStorage.setItem('export_jobs', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all intervals on component unmount
      Object.values(pollingIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, []);

  const navigationItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      id: 'children' as const,
      label: 'Children Records',
      icon: FileText,
      path: '/children-records'
    },
    {
      id: 'villages' as const,
      label: 'Gram Panchayats',
      icon: MapPin,
      path: '/gram-panchayats'
    },
    {
      id: 'users' as const,
      label: 'Users',
      icon: Users,
      path: '/users'
    },
  ];

  const renderRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children-records" element={
          <ChildrenRecords 
            key="children-records"
            onChildClick={(childId, childData) => {
              navigate(`/children-records/${childId}`, { state: { childData } });
            }}
            onAddExportJob={addExportJob}
          />
        } />
        <Route path="/children-records/:id" element={<ChildDetails />} />
        <Route path="/gram-panchayats" element={
          <GramPanchayats 
            key="villages"
            onAddGramPanchayat={() => navigate('/gram-panchayats/add')}
            onBulkUpload={() => navigate('/gram-panchayats/bulk-upload')}
            onGramPanchayatClick={(gramPanchayatData) => {
              navigate(`/gram-panchayats/${gramPanchayatData.id}`, { state: { gramPanchayatData } });
            }}
            onEditGramPanchayat={(gramPanchayat) => {
              navigate(`/gram-panchayats/${gramPanchayat.id}/edit`, { state: { gramPanchayat } });
            }}
            onDeleteGramPanchayat={(gramPanchayatId) => console.log('Delete gram panchayat:', gramPanchayatId)}
            onAddExportJob={addExportJob}
          />
        } />
        <Route path="/gram-panchayats/:id" element={<GramPanchayatProfile />} />
        <Route path="/gram-panchayats/:id/edit" element={<EditGramPanchayat />} />
        <Route path="/gram-panchayats/add" element={<AddNewGramPanchayat />} />
        <Route path="/gram-panchayats/bulk-upload" element={<BulkUploadVillages />} />
        <Route path="/users" element={
          <UserManagement 
            onAddUser={() => navigate('/users/add')}
            onBalMitraClick={(balMitraData) => {
              navigate(`/users/${balMitraData.id}`, { state: { balMitraData } });
            }}
            onEditUser={(user) => {
              navigate(`/users/${user.id}/edit`, { state: { user } });
            }}
          />
        } />
        <Route path="/users/:id" element={<BalMitraDetails />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
        <Route path="/users/add" element={<AddNewUser />} />
        <Route path="/users/bulk-upload" element={
          <BulkUploadUsers onComplete={() => navigate('/users')} />
        } />
        <Route path="/profile" element={
          <Profile 
            onBack={() => navigate('/dashboard')}
            onLogout={onLogout}
          />
        } />
      </Routes>
    );
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader 
          currentPage={location.pathname}
          onNavigate={(path: string) => navigate(path)}
          onProfileClick={() => navigate('/profile')}
          exportJobs={exportJobs}
          onClearJob={clearExportJob}
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Logo and Navigation */}
              <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">V</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">VCR Portal</h1>
                    <p className="text-xs text-muted-foreground">Village Children Register</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Right side - Profile Avatar */}
              <div className="flex items-center gap-4">
                <NotificationCenter 
                  exportJobs={exportJobs}
                  onClearJob={clearExportJob}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={isMobile ? "pt-14" : "pt-20"}>
        {renderRoutes()}
      </main>
    </div>
  );
};

export default AppShell;
