import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, BarChart3 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmployeeWithUser } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmployeesResponse {
  employees: EmployeeWithUser[];
  total: number;
}

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const pageSize = 8;

  const { data, isLoading } = useQuery<EmployeesResponse>({
    queryKey: ["/api/employees", { 
      limit: pageSize, 
      offset: (currentPage - 1) * pageSize,
      search: searchQuery 
    }],
  });

  const employees = data?.employees || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">People ({total})</h1>
          <p className="text-sm text-gray-500">Manage your workforce with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Organization Chart
          </Button>
          <Button className="hrms-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            All Users
          </TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-white">
            Team Management
          </TabsTrigger>
          <TabsTrigger value="offboarding" className="data-[state=active]:bg-white">
            Employee Offboarding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by Name, ID, Email"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage 
                        src={`https://i.pravatar.cc/80?img=${employee.id}`} 
                        alt={`${employee.user.firstName} ${employee.user.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {employee.user.firstName?.[0]}{employee.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {employee.user.firstName} {employee.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {employee.employeeId}</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{employee.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={employee.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Join Date:</span>
                      <span className="text-gray-500">
                        {new Date(employee.joinDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    {employee.user.email && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-500 text-xs truncate">
                          {employee.user.email}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {employees.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? `No employees match "${searchQuery}". Try adjusting your search.`
                  : "No employees have been added yet."
                }
              </p>
              {!searchQuery && (
                <Button className="hrms-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Employee
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-3">
              <div className="flex items-center text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900 mx-1">
                  {Math.min(pageSize, employees.length)}
                </span>
                of{" "}
                <span className="font-medium text-gray-900 mx-1">{total}</span>
                employees
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Management</h3>
            <p className="text-gray-500">
              Advanced team management features coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="offboarding" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Offboarding</h3>
            <p className="text-gray-500">
              Offboarding workflow management coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
