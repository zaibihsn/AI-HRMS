import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Claims from "@/pages/Claims";
import Tickets from "@/pages/Tickets";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import EmployeeProfile from "@/pages/EmployeeProfile";
import OrganizationChart from "@/pages/OrganizationChart";
import Recruitment from "@/pages/Recruitment";
import Payroll from "@/pages/Payroll";
import Performance from "@/pages/Performance";
import Attendance from "@/pages/Attendance";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ChatWidget from "@/components/chat/ChatWidget";
import Preferences from "@/pages/Preferences";
import HelpSupport from "@/pages/HelpSupport";
import SignOut from "@/pages/SignOut";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 transition-colors">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/employees" component={Employees} />
            <Route path="/employee/:id" component={EmployeeProfile} />
            <Route path="/organization-chart" component={OrganizationChart} />
            <Route path="/recruitment" component={Recruitment} />
            <Route path="/claims" component={Claims} />
            <Route path="/tickets" component={Tickets} />
            <Route path="/payroll" component={Payroll} />
            <Route path="/performance" component={Performance} />
            <Route path="/attendance" component={Attendance} />
            <Route path="/reports" component={Reports} />
            <Route path="/settings" component={Settings} />
            <Route path="/preferences" component={Preferences} />
            <Route path="/help" component={HelpSupport} />
            <Route path="/signout" component={SignOut} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
