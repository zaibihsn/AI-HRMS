import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Download,
  Calculator,
  CreditCard,
  FileText,
  AlertCircle
} from "lucide-react";

export default function Payroll() {
  const [currentPeriod, setCurrentPeriod] = useState("2024-01");
  const { data, isLoading } = useEmployees({ limit: 100 });

  const employees = data?.employees || [];

  // Mock payroll data
  const payrollSummary = {
    totalGross: 485000,
    totalNet: 368200,
    totalTaxes: 89500,
    totalDeductions: 27300,
    employeeCount: employees.length
  };

  const payrollItems = employees.map(emp => ({
    ...emp,
    grossPay: emp.salary ? Math.round(Number(emp.salary) / 12) : 0,
    netPay: emp.salary ? Math.round((Number(emp.salary) / 12) * 0.76) : 0,
    taxes: emp.salary ? Math.round((Number(emp.salary) / 12) * 0.18) : 0,
    deductions: emp.salary ? Math.round((Number(emp.salary) / 12) * 0.06) : 0,
    status: "Pending"
  }));

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
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-sm text-gray-500">Automated payroll processing and tax calculations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="hrms-gradient">
            <Calculator className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Gross Pay</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${payrollSummary.totalGross.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-cyan-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Net Pay</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${payrollSummary.totalNet.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Taxes</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${payrollSummary.totalTaxes.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Employees</p>
                <p className="text-2xl font-bold text-gray-900">{payrollSummary.employeeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="taxes">Tax Reports</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>January 2024 Payroll</span>
                <Badge variant="outline" className="text-orange-700 border-orange-200">
                  Processing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-right p-2">Gross Pay</th>
                      <th className="text-right p-2">Taxes</th>
                      <th className="text-right p-2">Deductions</th>
                      <th className="text-right p-2">Net Pay</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollItems.map((item) => {
                      const initials = `${item.user.firstName?.[0] || ''}${item.user.lastName?.[0] || ''}`;
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={item.user.profileImageUrl || ""} />
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {item.user.firstName} {item.user.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="p-2">{item.department}</td>
                          <td className="p-2 text-right font-medium">${item.grossPay.toLocaleString()}</td>
                          <td className="p-2 text-right text-red-600">${item.taxes.toLocaleString()}</td>
                          <td className="p-2 text-right text-blue-600">${item.deductions.toLocaleString()}</td>
                          <td className="p-2 text-right font-bold text-green-600">${item.netPay.toLocaleString()}</td>
                          <td className="p-2 text-center">
                            <Badge variant="outline" className="text-orange-700 border-orange-200">
                              {item.status}
                            </Badge>
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

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["2023-12", "2023-11", "2023-10", "2023-09"].map((period) => (
                  <div key={period} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {new Date(period + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payrollSummary.employeeCount} employees processed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${payrollSummary.totalNet.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Total net pay</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        Completed
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Federal Income Tax</span>
                    <span className="font-medium">$45,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">State Income Tax</span>
                    <span className="font-medium">$18,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Social Security</span>
                    <span className="font-medium">$15,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Medicare</span>
                    <span className="font-medium">$7,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Unemployment Tax</span>
                    <span className="font-medium">$3,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Tax Liability</span>
                    <span>${payrollSummary.totalTaxes.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">941 Quarterly Filing</h4>
                      <p className="text-sm text-gray-500">Due January 31, 2024</p>
                      <p className="text-xs text-orange-600">5 days remaining</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">W-2 Distribution</h4>
                      <p className="text-sm text-gray-500">Due January 31, 2024</p>
                      <p className="text-xs text-blue-600">5 days remaining</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <FileText className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">State Tax Filing</h4>
                      <p className="text-sm text-gray-500">Due February 15, 2024</p>
                      <p className="text-xs text-green-600">20 days remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Employee Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Health Insurance</h4>
                    <p className="text-2xl font-bold text-cyan-600">$12,400</p>
                    <p className="text-sm text-gray-500">Monthly premium</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">401(k) Contributions</h4>
                    <p className="text-2xl font-bold text-blue-600">$28,600</p>
                    <p className="text-sm text-gray-500">Monthly total</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Other Benefits</h4>
                    <p className="text-2xl font-bold text-green-600">$5,200</p>
                    <p className="text-sm text-gray-500">Monthly total</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Benefit Enrollment</h4>
                  <div className="space-y-3">
                    {employees.slice(0, 5).map((employee) => {
                      const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
                      return (
                        <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={employee.user.profileImageUrl || ""} />
                              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {employee.user.firstName} {employee.user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{employee.department}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-green-700 border-green-200">
                              Health
                            </Badge>
                            <Badge variant="outline" className="text-blue-700 border-blue-200">
                              401(k)
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}