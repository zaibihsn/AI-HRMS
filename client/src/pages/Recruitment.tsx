import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  UserPlus, 
  Calendar,
  Clock,
  Star,
  Briefcase,
  Users,
  TrendingUp
} from "lucide-react";

export default function Recruitment() {
  const [activeTab, setActiveTab] = useState("pipeline");

  // Mock data for recruitment
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      status: "Active",
      applicants: 23,
      posted: "2024-01-10"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      status: "Active",
      applicants: 15,
      posted: "2024-01-08"
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      status: "Draft",
      applicants: 0,
      posted: "2024-01-12"
    }
  ];

  const candidates = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      position: "Senior Software Engineer",
      stage: "Interview",
      rating: 4.5,
      experience: "5 years",
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      position: "Product Manager",
      stage: "Review",
      rating: 4.2,
      experience: "7 years",
      location: "Remote"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      position: "Senior Software Engineer",
      stage: "Offer",
      rating: 4.8,
      experience: "6 years",
      location: "San Francisco, CA"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
          <p className="text-sm text-gray-500">AI-powered talent acquisition and hiring management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="hrms-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Job Posting
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-cyan-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobOpenings.filter(job => job.status === 'Active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Time to Hire</p>
                <p className="text-2xl font-bold text-gray-900">18 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {["Applied", "Screening", "Interview", "Offer"].map((stage) => (
              <Card key={stage}>
                <CardHeader>
                  <CardTitle className="text-lg">{stage}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {candidates.filter(c => c.stage === stage || (stage === "Applied" && c.stage === "Review")).length} candidates
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidates
                      .filter(c => c.stage === stage || (stage === "Applied" && c.stage === "Review"))
                      .map((candidate) => (
                        <div key={candidate.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{candidate.name}</p>
                                <p className="text-xs text-gray-500">{candidate.position}</p>
                                <p className="text-xs text-gray-400">{candidate.experience}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">{candidate.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobOpenings.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <Badge variant="outline" className={job.status === 'Active' ? 'text-green-700 border-green-200' : ''}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {job.department} • {job.location} • {job.type}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        Posted {new Date(job.posted).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{job.applicants}</p>
                      <p className="text-xs text-gray-500">applicants</p>
                    </div>
                    <div className="ml-4">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>All Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                        <p className="text-sm text-gray-500">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline">{candidate.stage}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{candidate.experience}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{candidate.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{candidate.location}</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Applications</span>
                      <span className="text-sm text-gray-500">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Phone Screen</span>
                      <span className="text-sm text-gray-500">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Interview</span>
                      <span className="text-sm text-gray-500">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Offer</span>
                      <span className="text-sm text-gray-500">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruitment Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Time to Hire</span>
                    <span className="font-medium">18 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Cost per Hire</span>
                    <span className="font-medium">$3,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Offer Acceptance Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Quality of Hire</span>
                    <span className="font-medium">4.2/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Source Effectiveness</span>
                    <span className="font-medium">LinkedIn (42%)</span>
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