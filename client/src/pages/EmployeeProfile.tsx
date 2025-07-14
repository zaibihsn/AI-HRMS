import { useParams } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployee } from "@/hooks/useEmployees";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Building, 
  Edit,
  FileText,
  TrendingUp,
  Clock
} from "lucide-react";

export default function EmployeeProfile() {
  const { id } = useParams();
  const employeeId = parseInt(id || "0");
  
  const { data: employee, isLoading } = useEmployee(employeeId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h2>
          <p className="text-gray-500">The requested employee profile could not be found.</p>
        </div>
      </div>
    );
  }

  const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
          <p className="text-sm text-gray-500">View and manage employee information</p>
        </div>
        <Button className="hrms-gradient">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={employee.user.profileImageUrl || ""} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-900">
                  {employee.user.firstName} {employee.user.lastName}
                </h2>
                <p className="text-gray-500">{employee.position}</p>
                <Badge variant="outline" className="mt-2">
                  {employee.status}
                </Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{employee.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{employee.user.email}</span>
                </div>
                {employee.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{employee.phoneNumber}</span>
                  </div>
                )}
                {employee.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{employee.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    Joined {new Date(employee.joinDate).toLocaleDateString()}
                  </span>
                </div>
                {employee.salary && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">${employee.salary}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Employee Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Work Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span>{employee.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Position:</span>
                          <span>{employee.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <Badge variant="outline">{employee.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Employee ID:</span>
                          <span>{employee.employeeId}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Activity Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Claims Submitted:</span>
                          <span>5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tickets Created:</span>
                          <span>3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Leave Days Used:</span>
                          <span>8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Performance Score:</span>
                          <span>4.5/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Recent Claims
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Business Travel</h4>
                        <p className="text-sm text-gray-500">Conference attendance</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$450.00</p>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Office Supplies</h4>
                        <p className="text-sm text-gray-500">Ergonomic equipment</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$89.99</p>
                        <Badge variant="outline">Approved</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Support Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Laptop Issues</h4>
                        <p className="text-sm text-gray-500">Battery draining quickly</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">2 days ago</p>
                        <Badge variant="outline">Open</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">VPN Access</h4>
                        <p className="text-sm text-gray-500">Connection problems</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">1 week ago</p>
                        <Badge variant="outline">Resolved</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Overall Performance</span>
                        <span className="text-sm text-gray-500">4.5/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Project Completion</span>
                        <span className="text-sm text-gray-500">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Team Collaboration</span>
                        <span className="text-sm text-gray-500">4.8/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}