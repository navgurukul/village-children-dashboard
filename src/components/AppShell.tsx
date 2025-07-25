import React, { useState } from 'react';
import { Home, Users, FileText, LogOut, MapPin, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHeader from './MobileHeader';
import Dashboard from '../pages/Dashboard';
import ChildrenRecords from '../pages/ChildrenRecords';
import UserManagement from '../pages/UserManagement';
import AddNewUser from '../pages/AddNewUser';
import BulkUploadUsers from '../pages/BulkUploadUsers';
import ChildDetails from '../pages/ChildDetails';
import EditChildDetails from '../pages/EditChildDetails';
import BalMitraDetails from '../pages/BalMitraDetails';
import EditUser from '../pages/EditUser';
import Villages from '../pages/Villages';
import AddNewVillage from '../pages/AddNewVillage';
import VillageProfile from '../pages/VillageProfile';
import BulkUploadVillages from '../pages/BulkUploadVillages';
import EditVillage from '../pages/EditVillage';
import Profile from '../pages/Profile';

interface AppShellProps {
  onLogout: () => void;
}

type Page = 'dashboard' | 'children' | 'villages' | 'users' | 'add-user' | 'bulk-upload' | 'bulk-upload-villages' | 'child-details' | 'edit-child-details' | 'bal-mitra-details' | 'edit-user' | 'add-village' | 'village-profile' | 'edit-village' | 'profile';

const AppShell = ({ onLogout }: AppShellProps) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedChildData, setSelectedChildData] = useState<any | null>(null);
  const [selectedBalMitraId, setSelectedBalMitraId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedBalMitra, setSelectedBalMitra] = useState<any | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<any | null>(null);
  const [editChildFromDetails, setEditChildFromDetails] = useState<boolean>(false);
  const isMobile = useIsMobile();

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
      label: 'Villages',
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
    if (page === 'village-profile' && data?.villageData) {
      setSelectedVillage(data.villageData);
    }
    if (page === 'edit-village' && data?.village) {
      setSelectedVillage(data.village);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'children':
        return <ChildrenRecords 
          key={`children-${Date.now()}`}
          onChildClick={(childId, childData) => handleNavigation('child-details', { childId, childData })}
          onEditChild={(childId, childData) => handleNavigation('edit-child-details', { childId, childData, fromDetails: false })}
        />;
      case 'villages':
        return <Villages 
          key={`villages-${Date.now()}`}
          onAddVillage={() => handleNavigation('add-village')}
          onBulkUpload={() => handleNavigation('bulk-upload-villages')}
          onVillageClick={(villageData) => handleNavigation('village-profile', { villageData })}
          onEditVillage={(village) => handleNavigation('edit-village', { village })}
          onDeleteVillage={(villageId) => console.log('Delete village:', villageId)}
        />;
      case 'users':
        return <UserManagement 
          onAddUser={() => handleNavigation('add-user')}
          onBulkUpload={() => handleNavigation('bulk-upload')}
          onBalMitraClick={(balMitraData) => handleNavigation('bal-mitra-details', { balMitraData })}
          onEditUser={(user) => handleNavigation('edit-user', { user })}
        />;
      case 'add-user':
        return <AddNewUser onCancel={() => handleNavigation('users')} onSuccess={() => handleNavigation('users')} />;
      case 'add-village':
        return <AddNewVillage onCancel={() => handleNavigation('villages')} onSuccess={() => handleNavigation('villages')} />;
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
      case 'village-profile':
        return <VillageProfile 
          villageId={selectedVillage?.id} 
          villageData={selectedVillage}
          onBack={() => handleNavigation('villages')} 
        />;
      case 'edit-village':
        return <EditVillage 
          village={selectedVillage} 
          onCancel={() => handleNavigation('villages')} 
          onSuccess={() => handleNavigation('villages')} 
        />;
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
