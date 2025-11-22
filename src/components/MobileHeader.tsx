
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Home, FileText, MapPin, Users, User } from 'lucide-react';
import NotificationCenter, { ExportJob } from './NotificationCenter';

interface MobileHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onProfileClick: () => void;
  exportJobs?: ExportJob[];
  onClearJob?: (jobId: string) => void;
}

const MobileHeader = ({ currentPage, onNavigate, onProfileClick, exportJobs = [], onClearJob }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/children-records': return 'Children Records';
      case '/gram-panchayats': return 'Gram Panchayats';
      case '/users': return 'Users';
      case '/profile': return 'Profile';
      default:
        // Handle sub-pages
        if (path.startsWith('/children-records/')) return 'Children Records';
        if (path.startsWith('/gram-panchayats/')) return 'Gram Panchayats';
        if (path.startsWith('/users/')) return 'Users';
        return 'Dashboard';
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'children', label: 'Children Records', icon: FileText, path: '/children-records' },
    { id: 'villages', label: 'Gram Panchayats', icon: MapPin, path: '/gram-panchayats' },
    { id: 'users', label: 'Users', icon: Users, path: '/users' },
  ];

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border h-14">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left side - Logo and Page Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">V</span>
            </div>
            <span className="text-sm font-bold text-foreground">VCR Portal</span>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm">
                {getPageTitle(currentPage)}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.path || currentPage.startsWith(item.path + '/') ? "default" : "ghost"}
                      className="justify-start gap-2 h-12"
                      onClick={() => handleNavigate(item.path)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right side - Notifications and Avatar */}
        <div className="flex items-center gap-2">
          {exportJobs && exportJobs.length > 0 && (
            <NotificationCenter 
              exportJobs={exportJobs}
              onClearJob={onClearJob || (() => {})}
            />
          )}
          <Avatar className="h-8 w-8 cursor-pointer" onClick={onProfileClick}>
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
