
import React from 'react';
import { BarChart3, Users, Home, GraduationCap } from 'lucide-react';
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
    <Sidebar className="bg-gradient-to-b from-[#488b8f] to-[#5ea3a3] border-r border-[#add2c9] shadow-lg">
      <SidebarHeader className="p-6 border-b border-[#add2c9]/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Student Portal</h2>
            <p className="text-xs text-[#add2c9]">Education Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#add2c9] font-semibold text-sm mb-3 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.key)}
                    className={`w-full justify-start text-left rounded-xl py-3 px-4 transition-all duration-200 ${
                      currentPage === item.key
                        ? 'bg-white text-[#488b8f] font-semibold shadow-md transform scale-105'
                        : 'text-white hover:text-white hover:bg-white/10 hover:shadow-md hover:transform hover:scale-102'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      currentPage === item.key ? 'text-[#488b8f]' : 'text-white'
                    }`} />
                    <span className="text-sm font-medium">{item.title}</span>
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
