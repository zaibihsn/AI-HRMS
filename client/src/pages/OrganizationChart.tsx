import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/hooks/useEmployees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Download,
  Search,
  Filter
} from "lucide-react";

export default function OrganizationChart() {
  const [viewType, setViewType] = useState("tree");
  const { data, isLoading } = useEmployees({ limit: 100 });

  const employees = data?.employees || [];

  // Group employees by department
  const departments = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = [];
    }
    acc[emp.department].push(emp);
    return acc;
  }, {} as Record<string, typeof employees>);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
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
          <h1 className="text-2xl font-bold text-gray-900">Organization Chart</h1>
          <p className="text-sm text-gray-500">Visualize your company structure and hierarchy</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="hrms-gradient">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-cyan-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(departments).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Team Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(employees.length / Object.keys(departments).length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          <TabsTrigger value="matrix">Matrix View</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(departments).map(([dept, deptEmployees]) => (
              <Card key={dept}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dept}</span>
                    <Badge variant="outline">{deptEmployees.length} people</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deptEmployees.map((employee) => {
                      const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                      return (
                        <div key={employee.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={employee.user.profileImageUrl || ""} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {employee.user.firstName} {employee.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{employee.position}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={employee.status === 'active' ? 'text-green-700 border-green-200' : ''}
                          >
                            {employee.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hierarchy">
          <Card>
            <CardHeader>
              <CardTitle>Company Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(departments).map(([dept, deptEmployees]) => (
                  <div key={dept} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-cyan-500" />
                      {dept}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {deptEmployees.map((employee) => {
                        const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                        return (
                          <div key={employee.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={employee.user.profileImageUrl || ""} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {employee.user.firstName} {employee.user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{employee.position}</p>
                              <p className="text-xs text-gray-400">{employee.employeeId}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Employee Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Position</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => {
                      const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                      return (
                        <tr key={employee.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={employee.user.profileImageUrl || ""} />
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {employee.user.firstName} {employee.user.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="p-2">{employee.department}</td>
                          <td className="p-2">{employee.position}</td>
                          <td className="p-2">
                            <Badge 
                              variant="outline"
                              className={employee.status === 'active' ? 'text-green-700 border-green-200' : ''}
                            >
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="p-2">{new Date(employee.joinDate).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}