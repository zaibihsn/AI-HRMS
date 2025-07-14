import { useState } from "react";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "AI Dashboard",
    subtitle: "Autonomous HR management and insights"
  },
  "/employees": {
    title: "Employees",
    subtitle: "Manage your workforce with AI-powered insights"
  },
  "/organization-chart": {
    title: "Organization Chart",
    subtitle: "Visualize company structure and hierarchy"
  },
  "/recruitment": {
    title: "Recruitment",
    subtitle: "AI-powered talent acquisition and hiring"
  },
  "/performance": {
    title: "Performance Management",
    subtitle: "Track goals, reviews, and employee development"
  },
  "/attendance": {
    title: "Attendance Management",
    subtitle: "Track employee attendance and working hours"
  },
  "/payroll": {
    title: "Payroll Management",
    subtitle: "Automated payroll processing and tax calculations"
  },
  "/claims": {
    title: "Claims & Expenses",
    subtitle: "AI-powered expense management and approvals"
  },
  "/tickets": {
    title: "Support Tickets",
    subtitle: "Intelligent ticket routing and resolution"
  },
  "/reports": {
    title: "Reports & Analytics",
    subtitle: "Advanced workforce analytics and predictions"
  },
  "/settings": {
    title: "Settings",
    subtitle: "Configure your AI HRMS system"
  },
};

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const pageInfo = pageTitles[location] || {
    title: "AI HRMS",
    subtitle: "Autonomous HR management system"
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageInfo.title}</h1>
          <p className="text-sm text-gray-500">{pageInfo.subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h4 className="font-semibold mb-2">Notifications</h4>
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm font-medium">New leave request submitted</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm font-medium">Expense claim approved</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm font-medium">Performance review due</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://i.pravatar.cc/40?img=1" alt="Profile" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                  <p className="text-xs text-gray-500">AI Admin</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
