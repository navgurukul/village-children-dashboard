
import React from 'react';
import { BarChart3, Users, Home, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentPage: 'dashboard' | 'students';
  onPageChange: (page: 'dashboard' | 'students') => void;
}

const AppSidebar = ({ currentPage, onPageChange }: AppSidebarProps) => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      key: "dashboard" as const,
    },
    {
      title: "Student Records",
      icon: Users,
      key: "students" as const,
    },
  ];

  return (
    <Sidebar className="bg-[#488b8f] border-r border-[#5ea3a3]">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-white" />
          <h2 className="text-lg font-semibold text-white">Student Portal</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#add2c9] font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.key)}
                    className={`w-full justify-start text-left ${
                      currentPage === item.key
                        ? 'bg-[#add2c9] text-[#488b8f] font-medium'
                        : 'text-gray-300 hover:text-white hover:bg-[#5ea3a3]'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
