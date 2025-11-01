import React, { useState, useEffect, useRef } from 'react';
import { Home, Users, FileText, LogOut, MapPin, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import EditChildDetails from '../pages/EditChildDetails';
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

type Page = 'dashboard' | 'children' | 'villages' | 'users' | 'add-user' | 'bulk-upload' | 'bulk-upload-villages' | 'child-details' | 'edit-child-details' | 'bal-mitra-details' | 'edit-user' | 'add-gram-panchayat' | 'gram-panchayat-profile' | 'edit-gram-panchayat' | 'profile';

const AppShell = ({ onLogout }: AppShellProps) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedChildData, setSelectedChildData] = useState<any | null>(null);
  const [selectedBalMitraId, setSelectedBalMitraId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedBalMitra, setSelectedBalMitra] = useState<any | null>(null);
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState<any | null>(null);
  const [editChildFromDetails, setEditChildFromDetails] = useState<boolean>(false);
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
    },
    {
      id: 'children' as const,
      label: 'Children Records',
      icon: FileText,
    },
    {
      id: 'villages' as const,
      label: 'Gram Panchayats',
      icon: MapPin,
    },
    {
      id: 'users' as const,
      label: 'Users',
      icon: Users,
    },
  ];

  const handleNavigation = (page: Page, data?: any) => {
    setCurrentPage(page);
    if (page === 'child-details' && data?.childId) {
      setSelectedChildId(data.childId);
      setSelectedChildData(data?.childData || null);
    }
    if (page === 'edit-child-details' && data?.childId) {
      setSelectedChildId(data.childId);
      setSelectedChildData(data?.childData || null);
      setEditChildFromDetails(data?.fromDetails || false);
    }
    if (page === 'bal-mitra-details' && data?.balMitraData) {
      setSelectedBalMitra(data.balMitraData);
      setSelectedBalMitraId(data.balMitraData?.id || null);
    }
    if (page === 'edit-user' && data?.user) {
      setSelectedUser(data.user);
    }
    if (page === 'gram-panchayat-profile' && data?.gramPanchayatData) {
      setSelectedGramPanchayat(data.gramPanchayatData);
    }
    if (page === 'edit-gram-panchayat' && data?.gramPanchayat) {
      setSelectedGramPanchayat(data.gramPanchayat);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'children':
        return <ChildrenRecords 
          key="children-records"
          onChildClick={(childId, childData) => handleNavigation('child-details', { childId, childData })}
          onEditChild={(childId, childData) => handleNavigation('edit-child-details', { childId, childData, fromDetails: false })}
          onAddExportJob={addExportJob}
        />;
      case 'villages':
        return <GramPanchayats 
          key={`villages-${Date.now()}`}
          onAddGramPanchayat={() => handleNavigation('add-gram-panchayat')}
          onBulkUpload={() => handleNavigation('bulk-upload-villages')}
          onGramPanchayatClick={(gramPanchayatData) => handleNavigation('gram-panchayat-profile', { gramPanchayatData })}
          onEditGramPanchayat={(gramPanchayat) => handleNavigation('edit-gram-panchayat', { gramPanchayat })}
          onDeleteGramPanchayat={(gramPanchayatId) => console.log('Delete gram panchayat:', gramPanchayatId)}
        />;
      case 'users':
        return <UserManagement 
          onAddUser={() => handleNavigation('add-user')}
          onBalMitraClick={(balMitraData) => handleNavigation('bal-mitra-details', { balMitraData })}
          onEditUser={(user) => handleNavigation('edit-user', { user })}
        />;
      case 'add-user':
        return <AddNewUser onCancel={() => handleNavigation('users')} onSuccess={() => handleNavigation('users')} />;
      case 'add-gram-panchayat':
        return <AddNewGramPanchayat onCancel={() => handleNavigation('villages')} onSuccess={() => handleNavigation('villages')} />;
      case 'bulk-upload':
        return <BulkUploadUsers onComplete={() => handleNavigation('users')} />;
      case 'bulk-upload-villages':
        return <BulkUploadVillages onComplete={() => handleNavigation('villages')} />;
      case 'child-details':
        return <ChildDetails 
          childId={selectedChildId} 
          childData={selectedChildData}
          onBack={() => handleNavigation('children')} 
          onEdit={(childId) => handleNavigation('edit-child-details', { childId, childData: selectedChildData, fromDetails: true })}
        />;
      case 'edit-child-details':
        return <EditChildDetails 
          childId={selectedChildId} 
          childData={selectedChildData}
          fromChildDetails={editChildFromDetails}
          onBack={() => editChildFromDetails ? handleNavigation('child-details', { childId: selectedChildId }) : handleNavigation('children')} 
          onSuccess={() => editChildFromDetails ? handleNavigation('child-details', { childId: selectedChildId }) : handleNavigation('children')} 
        />;
      case 'gram-panchayat-profile':
        return <GramPanchayatProfile 
          gramPanchayatId={selectedGramPanchayat?.id} 
          gramPanchayatData={selectedGramPanchayat}
          onBack={() => handleNavigation('villages')} 
        />;
      case 'edit-gram-panchayat':
        return <EditGramPanchayat gramPanchayat={selectedGramPanchayat} onCancel={() => handleNavigation('villages')} onSuccess={() => handleNavigation('villages')} />;
      case 'bal-mitra-details':
        return <BalMitraDetails balMitraId={selectedBalMitraId} balMitraData={selectedBalMitra} onBack={() => handleNavigation('users')} />;
      case 'edit-user':
        return <EditUser 
          userData={selectedUser} 
          onCancel={() => handleNavigation('users')} 
          onSuccess={() => handleNavigation('users')} 
        />;
      case 'profile':
        return <Profile onBack={() => handleNavigation('dashboard')} onLogout={onLogout} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader 
          currentPage={currentPage}
          onNavigate={handleNavigation}
          onProfileClick={() => handleNavigation('profile')}
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
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
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
                  <DropdownMenuItem onClick={() => handleNavigation('profile')}>
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
        {renderContent()}
      </main>
    </div>
  );
};

export default AppShell;
