import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Calendar, 
  Filter, 
  Download,
  TrendingUp,
  Users,
  DollarSign,
  PieChart
} from "lucide-react";

interface DashboardStats {
  totalEmployees: number;
  activeRecruitments: number;
  pendingReviews: number;
  pendingLeaves: number;
  costSavings: number;
}

// Mock data for charts - in real app this would come from API
const employeeGrowthData = [
  { month: "Jan", count: 720 },
  { month: "Feb", count: 890 },
  { month: "Mar", count: 520 },
  { month: "Apr", count: 780 },
  { month: "May", count: 550 },
  { month: "Jun", count: 820 },
  { month: "Jul", count: 720 },
  { month: "Aug", count: 760 },
  { month: "Sep", count: 720 },
  { month: "Oct", count: 850 },
  { month: "Nov", count: 890 },
  { month: "Dec", count: 670 },
];

const departmentData = [
  { name: "Administration", count: 1 },
  { name: "Management", count: 2 },
  { name: "Software Engineer", count: 3 },
];

const designationData = [
  { name: "Administration", count: 1 },
  { name: "Management", count: 2 },
  { name: "Software Engineer", count: 3 },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hideActiveUsers, setHideActiveUsers] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Latest Statistics & Summary</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="leave" className="data-[state=active]:bg-white">
            Leave
          </TabsTrigger>
          <TabsTrigger value="ticket" className="data-[state=active]:bg-white">
            Ticket
          </TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-white">
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="department">Filter by Department(s)</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department(s)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Filter by Title(s)</Label>
                  <Select value={selectedTitle} onValueChange={setSelectedTitle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Title(s)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-active"
                        checked={hideActiveUsers}
                        onCheckedChange={setHideActiveUsers}
                      />
                      <Label htmlFor="hide-active">Hide Active User</Label>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Growth Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Growth</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-active-growth"
                        checked={hideActiveUsers}
                        onCheckedChange={setHideActiveUsers}
                      />
                      <Label htmlFor="hide-active-growth">Hide Active User</Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Filter by Date</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        type="date"
                        placeholder="From"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="date"
                        placeholder="To"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-32"
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Employees:</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalEmployees || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Off-boarded:</p>
                  <p className="text-2xl font-bold text-red-600">6</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">On-boarded:</p>
                  <p className="text-2xl font-bold text-green-600">65</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Chart Placeholder */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Employee Growth Chart</p>
                  <p className="text-sm text-gray-400">
                    Monthly employee growth trends would be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department and Designation Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Count */}
            <Card>
              <CardHeader>
                <CardTitle>Department Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${index * 120}, 60%, 50%)` }}
                        ></div>
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-gray-500">{dept.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Department Distribution Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Designation Count */}
            <Card>
              <CardHeader>
                <CardTitle>Designation Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {designationData.map((designation, index) => (
                    <div key={designation.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${(index + 1) * 120}, 60%, 50%)` }}
                        ></div>
                        <span className="text-sm font-medium">{designation.name}</span>
                        <span className="text-sm text-gray-500">{designation.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Designation Distribution Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Reports</h3>
            <p className="text-gray-500">
              Leave analytics and reports coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ticket" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket Reports</h3>
            <p className="text-gray-500">
              Ticket analytics and reports coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Reports</h3>
            <p className="text-gray-500">
              Feedback analytics and reports coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
