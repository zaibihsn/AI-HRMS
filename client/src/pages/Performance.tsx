import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  Plus,
  Filter,
  Star
} from "lucide-react";

export default function Performance() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading } = useEmployees({ limit: 100 });

  const employees = data?.employees || [];

  // Mock performance data
  const performanceData = employees.map(emp => ({
    ...emp,
    overallScore: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0 range
    goals: Math.floor(Math.random() * 3) + 3, // 3-5 goals
    completedGoals: Math.floor(Math.random() * 3) + 2, // 2-4 completed
    reviewStatus: ["Pending", "Completed", "Scheduled"][Math.floor(Math.random() * 3)],
    lastReview: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
  }));

  const avgPerformance = performanceData.reduce((sum, emp) => sum + parseFloat(emp.overallScore), 0) / performanceData.length;
  const topPerformers = performanceData
    .sort((a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore))
    .slice(0, 3);

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
          <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-sm text-gray-500">Track goals, reviews, and employee development</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="hrms-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-cyan-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">{avgPerformance.toFixed(1)}/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Goals Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(performanceData.reduce((sum, emp) => sum + emp.completedGoals, 0) / performanceData.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Due Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.filter(emp => emp.reviewStatus === "Pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Top Performers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.filter(emp => parseFloat(emp.overallScore) >= 4.5).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => {
                    const initials = `${performer.user.firstName?.[0] || ''}${performer.user.lastName?.[0] || ''}`;
                    return (
                      <div key={performer.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={performer.user.profileImageUrl || ""} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {performer.user.firstName} {performer.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{performer.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold">{performer.overallScore}</span>
                          </div>
                          <p className="text-xs text-gray-500">{performer.position}</p>
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
                  <Calendar className="w-5 h-5" />
                  Upcoming Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData
                    .filter(emp => emp.reviewStatus === "Scheduled")
                    .slice(0, 4)
                    .map((employee) => {
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
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(employee.nextReview).toLocaleDateString()}
                            </p>
                            <Badge variant="outline" className="text-blue-700 border-blue-200">
                              Scheduled
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((employee) => {
                  const initials = `${employee.user.firstName?.[0] || ''}${employee.user.lastName?.[0] || ''}`;
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
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold">{employee.overallScore}</span>
                          </div>
                          <p className="text-xs text-gray-500">Overall Score</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{employee.completedGoals}/{employee.goals}</p>
                          <p className="text-xs text-gray-500">Goals</p>
                        </div>
                        <div className="text-center">
                          <Badge 
                            variant="outline"
                            className={
                              employee.reviewStatus === "Completed" ? "text-green-700 border-green-200" :
                              employee.reviewStatus === "Scheduled" ? "text-blue-700 border-blue-200" :
                              "text-orange-700 border-orange-200"
                            }
                          >
                            {employee.reviewStatus}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(employee.lastReview).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Q1 2024 Objectives", "Professional Development", "Team Collaboration", "Innovation Projects"].map((goalType, index) => (
                    <div key={goalType}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{goalType}</span>
                        <span className="text-sm text-gray-500">{75 + index * 5}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" 
                          style={{ width: `${75 + index * 5}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    performanceData.reduce((acc, emp) => {
                      if (!acc[emp.department]) {
                        acc[emp.department] = [];
                      }
                      acc[emp.department].push(parseFloat(emp.overallScore));
                      return acc;
                    }, {} as Record<string, number[]>)
                  ).map(([dept, scores]) => {
                    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" 
                              style={{ width: `${(avgScore / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">{avgScore.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Performance Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Excellent (4.5-5.0)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Good (3.5-4.4)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                          </div>
                          <span className="text-sm font-medium">50%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Satisfactory (2.5-3.4)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Needs Improvement (1.0-2.4)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                          </div>
                          <span className="text-sm font-medium">5%</span>
                        </div>
                      </div>
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
                    <span className="text-sm text-gray-500">Review Completion Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Goal Achievement Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Employee Satisfaction</span>
                    <span className="font-medium">4.3/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Manager Effectiveness</span>
                    <span className="font-medium">4.1/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Development Participation</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Promotion Rate</span>
                    <span className="font-medium">12%</span>
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