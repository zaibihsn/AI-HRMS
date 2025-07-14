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
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users, badge: "247" },
  { href: "/recruitment", label: "AI Recruitment", icon: UserPlus },
  { href: "/onboarding", label: "Smart Onboarding", icon: Rocket },
  { href: "/performance", label: "Performance AI", icon: TrendingUp },
  { href: "/leave", label: "Leave Management", icon: Calendar },
  { href: "/payroll", label: "Smart Payroll", icon: DollarSign },
  { href: "/claims", label: "Claims & Expenses", icon: Receipt },
  { href: "/tickets", label: "Support Tickets", icon: Ticket },
  { href: "/reports", label: "AI Analytics", icon: BarChart3 },
  { href: "/compliance", label: "Compliance Hub", icon: Shield },
  { href: "/settings", label: "AI Settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">MapleHR</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">AI-Powered HR System</p>
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
                      ? "sidebar-active"
                      : "text-gray-600 hover:bg-gray-100"
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
