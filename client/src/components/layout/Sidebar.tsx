import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Rocket, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Receipt, 
  Ticket, 
  BarChart3, 
  Shield, 
  Settings,
  Brain,
  Building2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/organization-chart", label: "Organization Chart", icon: Building2 },
  { href: "/recruitment", label: "Recruitment", icon: UserPlus },
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/attendance", label: "Attendance", icon: Clock },
  { href: "/payroll", label: "Payroll", icon: DollarSign },
  { href: "/claims", label: "Claims & Expenses", icon: Receipt },
  { href: "/tickets", label: "Support Tickets", icon: Ticket },
  { href: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg flex-shrink-0 transition-colors">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">AI HRMS</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Autonomous HR Management</p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "sidebar-active dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
