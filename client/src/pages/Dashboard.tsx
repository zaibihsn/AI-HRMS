import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useState, useEffect } from "react";
import moment from "moment-timezone";

interface DashboardStats {
  totalEmployees: number;
  activeRecruitments: number;
  pendingReviews: number;
  pendingLeaves: number;
  costSavings: number;
}

const recentDecisions = [
  {
    id: 1,
    type: "approval",
    title: "Leave Request Approved",
    description: "Auto-approved John Doe's vacation request based on policy compliance",
    time: "2 minutes ago",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: 2,
    type: "recruitment",
    title: "Candidate Shortlisted",
    description: "AI scored Sarah Wilson 94% match for Senior Developer role",
    time: "15 minutes ago",
    icon: UserPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    type: "alert",
    title: "Performance Alert",
    description: "Detected potential burnout risk for 3 employees in Engineering",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    id: 4,
    type: "payroll",
    title: "Payroll Processed",
    description: "Monthly payroll completed for 247 employees with 0 errors",
    time: "2 hours ago",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Get selected timezone from localStorage (set by manager/ceo/cto in Settings)
  const [timezone, setTimezone] = useState<string>("UTC");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const tz = localStorage.getItem("companyTimezone") || "UTC";
    setTimezone(tz);
    const updateTime = () => {
      setCurrentTime(moment().tz(tz).format("dddd, MMMM D, YYYY h:mm:ss A"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get company name from localStorage
  const [companyName, setCompanyName] = useState<string>("");
  useEffect(() => {
    const name = localStorage.getItem("companyName") || "AI HRMS Corp";
    setCompanyName(name);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Company Name Banner */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-2 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{companyName}</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome to your HRMS dashboard</p>
          </div>
        </CardContent>
      </Card>

      {/* Company Timezone Banner */}
      <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 transition-colors">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">Company Timezone</h2>
            <p className="text-blue-700 dark:text-blue-200">{timezone} &mdash; {currentTime}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-200" />
          </div>
        </CardContent>
      </Card>

      {/* AI System Status Banner */}
      <Card className="maple-gradient text-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">AI System Status</h2>
              <p className="text-green-100">All systems operational - 99.9% uptime</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats?.totalEmployees || 0}</div>
              <div className="text-sm text-green-100">Active Employees</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
              <div className="text-xs text-green-100">Auto-Processed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
              <div className="text-xs text-green-100">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">5.2s</div>
              <div className="text-xs text-green-100">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              <div className="text-xs text-green-100">Manual Interventions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Recruitments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activeRecruitments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-300 mr-1" />
              <span className="text-green-600 dark:text-green-300 text-sm font-medium">↑ 12%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.pendingReviews || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-600 dark:text-yellow-200 text-sm font-medium">Due this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Leave Requests</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.pendingLeaves || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-primary dark:text-purple-200 text-sm font-medium">Auto-approved: 19</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cost Savings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${((stats?.costSavings || 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 dark:text-green-200 text-sm font-medium">This quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Decisions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Decisions</CardTitle>
            <p className="text-sm text-gray-500">Automated actions taken by the system</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDecisions.map((decision) => {
              const Icon = decision.icon;
              return (
                <div key={decision.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${decision.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${decision.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{decision.title}</p>
                    <p className="text-xs text-gray-500">{decision.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{decision.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Predictive Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Insights</CardTitle>
            <p className="text-sm text-gray-500">AI-powered workforce predictions</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 maple-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Attrition Risk: Low</h4>
              <p className="text-sm text-gray-500">3% predicted turnover next quarter</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hiring Needs (Q1)</span>
                <span className="text-sm font-medium text-gray-900">12 positions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Optimization</span>
                <span className="text-sm font-medium text-green-600">+$23K saved</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Training Recommendations</span>
                <span className="text-sm font-medium text-blue-600">5 programs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workforce Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workforce Analytics</CardTitle>
              <p className="text-sm text-gray-500">Employee growth and distribution trends</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-md">6M</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">1Y</button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Workforce Analytics Chart</p>
              <p className="text-sm text-gray-400">
                Chart visualization showing employee growth, department distribution, and hiring trends
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
