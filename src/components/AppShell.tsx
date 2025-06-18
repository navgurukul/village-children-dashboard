
import React, { useState } from 'react';
import { Home, Users, FileText, LogOut } from 'lucide-react';
import Dashboard from '../pages/Dashboard';
import ChildrenRecords from '../pages/ChildrenRecords';
import UserManagement from '../pages/UserManagement';
import AddNewUser from '../pages/AddNewUser';
import BulkUploadUsers from '../pages/BulkUploadUsers';
import ChildDetails from '../pages/ChildDetails';
import EditChildDetails from '../pages/EditChildDetails';
import BalMitraDetails from '../pages/BalMitraDetails';
import EditUser from '../pages/EditUser';

interface AppShellProps {
  onLogout: () => void;
}

type Page = 'dashboard' | 'children' | 'users' | 'add-user' | 'bulk-upload' | 'child-details' | 'edit-child-details' | 'bal-mitra-details' | 'edit-user';

const AppShell = ({ onLogout }: AppShellProps) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedBalMitraId, setSelectedBalMitraId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
      id: 'users' as const,
      label: 'Users',
      icon: Users,
    },
  ];

  const handleNavigation = (page: Page, data?: any) => {
    setCurrentPage(page);
    if (page === 'child-details' && data?.childId) {
      setSelectedChildId(data.childId);
    }
    if (page === 'edit-child-details' && data?.childId) {
      setSelectedChildId(data.childId);
    }
    if (page === 'bal-mitra-details' && data?.balMitraId) {
      setSelectedBalMitraId(data.balMitraId);
    }
    if (page === 'edit-user' && data?.userId) {
      setSelectedUserId(data.userId);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'children':
        return <ChildrenRecords onChildClick={(childId) => handleNavigation('child-details', { childId })} />;
      case 'users':
        return <UserManagement 
          onAddUser={() => handleNavigation('add-user')}
          onBulkUpload={() => handleNavigation('bulk-upload')}
          onBalMitraClick={(balMitraId) => handleNavigation('bal-mitra-details', { balMitraId })}
        />;
      case 'add-user':
        return <AddNewUser onCancel={() => handleNavigation('users')} onSuccess={() => handleNavigation('users')} />;
      case 'bulk-upload':
        return <BulkUploadUsers onComplete={() => handleNavigation('users')} />;
      case 'child-details':
        return <ChildDetails childId={selectedChildId} onBack={() => handleNavigation('children')} />;
      case 'edit-child-details':
        return <EditChildDetails 
          childId={selectedChildId} 
          onBack={() => handleNavigation('child-details', { childId: selectedChildId })} 
          onSuccess={() => handleNavigation('child-details', { childId: selectedChildId })} 
        />;
      case 'bal-mitra-details':
        return <BalMitraDetails balMitraId={selectedBalMitraId} onBack={() => handleNavigation('users')} />;
      case 'edit-user':
        return <EditUser 
          userId={selectedUserId} 
          onCancel={() => handleNavigation('users')} 
          onSuccess={() => handleNavigation('users')} 
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header with Glassmorphism */}
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

            {/* Right side - Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default AppShell;
