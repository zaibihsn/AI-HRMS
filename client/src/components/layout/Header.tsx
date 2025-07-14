import { useState, useEffect } from "react";
import { Bell, Search, Settings, Moon, Sun } from "lucide-react";
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
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const pageInfo = pageTitles[location] || {
    title: "AI HRMS",
    subtitle: "Autonomous HR management system"
  };

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // On mount, set theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageInfo.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">{pageInfo.subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark/Light Mode Toggle */}
          <button
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={handleToggleTheme}
            className={`transition-colors rounded-full p-2 border ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300"} flex items-center justify-center shadow hover:scale-105 duration-150`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
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
          <Button variant="ghost" size="icon" onClick={() => setLocation('/settings')}>
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
              <DropdownMenuItem onClick={() => setLocation('/settings')}>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/preferences')}>Preferences</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/help')}>Help & Support</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => setLocation('/signout')}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
