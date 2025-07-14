import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Filter
} from "lucide-react";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("today");
  const { data, isLoading } = useEmployees({ limit: 100 });

  const employees = data?.employees || [];

  // Mock attendance data
  const attendanceData = employees.map(emp => ({
    ...emp,
    status: ["Present", "Late", "Absent", "Remote"][Math.floor(Math.random() * 4)],
    clockIn: "09:15 AM",
    clockOut: "05:30 PM",
    hoursWorked: (7 + Math.random() * 2).toFixed(1),
    lateMinutes: Math.floor(Math.random() * 30),
    overtimeHours: Math.random() > 0.7 ? (Math.random() * 2).toFixed(1) : "0",
    monthlyHours: (160 + Math.random() * 20).toFixed(1),
    absenceDays: Math.floor(Math.random() * 3),
    leaveBalance: Math.floor(Math.random() * 15) + 10
  }));

  const todayStats = {
    present: attendanceData.filter(emp => emp.status === "Present").length,
    late: attendanceData.filter(emp => emp.status === "Late").length,
    absent: attendanceData.filter(emp => emp.status === "Absent").length,
    remote: attendanceData.filter(emp => emp.status === "Remote").length,
    total: attendanceData.length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-sm text-gray-500">Track employee attendance and working hours</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="hrms-gradient">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.present}</p>
                <p className="text-xs text-gray-400">{Math.round((todayStats.present / todayStats.total) * 100)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Late Arrivals</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.late}</p>
                <p className="text-xs text-gray-400">{Math.round((todayStats.late / todayStats.total) * 100)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Absent</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.absent}</p>
                <p className="text-xs text-gray-400">{Math.round((todayStats.absent / todayStats.total) * 100)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-cyan-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Remote Work</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.remote}</p>
                <p className="text-xs text-gray-400">{Math.round((todayStats.remote / todayStats.total) * 100)}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Today's Attendance - {new Date().toLocaleDateString()}</span>
                <div className="text-sm text-gray-500">
                  {todayStats.present + todayStats.late + todayStats.remote} / {todayStats.total} present
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceData.map((employee) => {
                  const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                  const statusColor = {
                    Present: "text-green-700 border-green-200 bg-green-50",
                    Late: "text-orange-700 border-orange-200 bg-orange-50",
                    Absent: "text-red-700 border-red-200 bg-red-50",
                    Remote: "text-blue-700 border-blue-200 bg-blue-50"
                  };

                  return (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={employee.user.profileImageUrl || ""} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {employee.user.firstName} {employee.user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{employee.position} • {employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">{employee.clockIn}</p>
                          <p className="text-xs text-gray-500">Clock In</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{employee.clockOut}</p>
                          <p className="text-xs text-gray-500">Clock Out</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{employee.hoursWorked}h</p>
                          <p className="text-xs text-gray-500">Hours</p>
                        </div>
                        <Badge variant="outline" className={statusColor[employee.status as keyof typeof statusColor]}>
                          {employee.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => {
                    const presentCount = Math.floor(Math.random() * 5) + (todayStats.total - 8);
                    const percentage = (presentCount / todayStats.total) * 100;
                    
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{presentCount}/{todayStats.total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Attendance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceData
                    .filter(emp => emp.status === "Absent" || emp.status === "Late")
                    .slice(0, 5)
                    .map((employee) => {
                      const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                      return (
                        <div key={employee.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={employee.user.profileImageUrl || ""} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {employee.user.firstName} {employee.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {employee.status === "Late" 
                                ? `${employee.lateMinutes} minutes late` 
                                : "Absent today"
                              }
                            </p>
                          </div>
                          <Badge 
                            variant="outline"
                            className={employee.status === "Late" ? "text-orange-700 border-orange-200" : "text-red-700 border-red-200"}
                          >
                            {employee.status}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-right p-2">Hours Worked</th>
                      <th className="text-right p-2">Overtime</th>
                      <th className="text-right p-2">Absent Days</th>
                      <th className="text-right p-2">Leave Balance</th>
                      <th className="text-center p-2">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((employee) => {
                      const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                      const attendanceRate = ((22 - employee.absenceDays) / 22 * 100).toFixed(1);
                      
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
                          <td className="p-2 text-right font-medium">{employee.monthlyHours}h</td>
                          <td className="p-2 text-right text-blue-600">{employee.overtimeHours}h</td>
                          <td className="p-2 text-right text-red-600">{employee.absenceDays}</td>
                          <td className="p-2 text-right text-green-600">{employee.leaveBalance}</td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    parseFloat(attendanceRate) >= 95 ? 'bg-green-500' :
                                    parseFloat(attendanceRate) >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${attendanceRate}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{attendanceRate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Department Attendance Rates</h4>
                    <div className="space-y-3">
                      {Object.entries(
                        attendanceData.reduce((acc, emp) => {
                          if (!acc[emp.department]) {
                            acc[emp.department] = [];
                          }
                          acc[emp.department].push(emp.absenceDays);
                          return acc;
                        }, {} as Record<string, number[]>)
                      ).map(([dept, absences]) => {
                        const avgAttendance = ((22 - absences.reduce((sum, abs) => sum + abs, 0) / absences.length) / 22 * 100);
                        return (
                          <div key={dept} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{dept}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" 
                                  style={{ width: `${avgAttendance}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{avgAttendance.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Daily Attendance</span>
                    <span className="font-medium">
                      {Math.round((todayStats.present + todayStats.late + todayStats.remote) / todayStats.total * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Hours per Employee</span>
                    <span className="font-medium">
                      {(attendanceData.reduce((sum, emp) => sum + parseFloat(emp.monthlyHours), 0) / attendanceData.length).toFixed(1)}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Overtime Hours</span>
                    <span className="font-medium">
                      {attendanceData.reduce((sum, emp) => sum + parseFloat(emp.overtimeHours), 0).toFixed(1)}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Punctuality Rate</span>
                    <span className="font-medium">
                      {Math.round((todayStats.present + todayStats.remote) / todayStats.total * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Remote Work Adoption</span>
                    <span className="font-medium">
                      {Math.round(todayStats.remote / todayStats.total * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}