import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Calendar, Filter, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimWithEmployee } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClaimsResponse {
  claims: ClaimWithEmployee[];
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export default function Claims() {
  const [activeTab, setActiveTab] = useState("approvals");
  const { toast } = useToast();

  const { data, isLoading } = useQuery<ClaimsResponse>({
    queryKey: ["/api/claims"],
  });

  const updateClaimMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/claims/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Success",
        description: "Claim updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update claim",
        variant: "destructive",
      });
    },
  });

  const claims = data?.claims || [];
  const stats = data?.stats || { pending: 0, approved: 0, rejected: 0, total: 0 };

  const handleApprove = (claimId: number) => {
    updateClaimMutation.mutate({
      id: claimId,
      updates: { 
        status: "approved", 
        approvedBy: "AI System",
        approvedAt: new Date().toISOString(),
      },
    });
  };

  const handleReject = (claimId: number) => {
    updateClaimMutation.mutate({
      id: claimId,
      updates: { 
        status: "rejected", 
        approvedBy: "AI System",
        approvedAt: new Date().toISOString(),
      },
    });
  };

  const claimsColumns = [
    {
      key: "id" as const,
      header: "ID",
      render: (claim: ClaimWithEmployee) => (
        <span className="font-mono text-sm">{claim.id}</span>
      ),
    },
    {
      key: "category" as const,
      header: "Category",
      render: (claim: ClaimWithEmployee) => (
        <div>
          <div className="font-medium">{claim.category}</div>
          <div className="text-sm text-gray-500">{claim.description}</div>
        </div>
      ),
    },
    {
      key: "amount" as const,
      header: "Amount",
      render: (claim: ClaimWithEmployee) => (
        <div className="font-medium">
          ${parseFloat(claim.amount).toFixed(2)}
        </div>
      ),
    },
    {
      key: "employee" as const,
      header: "Employee",
      render: (claim: ClaimWithEmployee) => (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={`https://i.pravatar.cc/40?img=${claim.employee.id}`}
              className="object-cover"
            />
            <AvatarFallback>
              {claim.employee.user.firstName?.[0]}{claim.employee.user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">
              {claim.employee.user.firstName} {claim.employee.user.lastName}
            </div>
            <div className="text-xs text-gray-500">{claim.employee.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      key: "claimDate" as const,
      header: "Claim Date",
      render: (claim: ClaimWithEmployee) => (
        <div className="text-sm">
          {new Date(claim.claimDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (claim: ClaimWithEmployee) => (
        <StatusBadge status={claim.status} />
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (claim: ClaimWithEmployee) => (
        <div className="flex items-center space-x-2">
          {claim.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => handleApprove(claim.id)}
                disabled={updateClaimMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleReject(claim.id)}
                disabled={updateClaimMutation.isPending}
              >
                Reject
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost">
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-6 mb-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Claims Summary</h1>
          <p className="text-sm text-gray-500">AI-powered expense management and approvals</p>
        </div>
        <Button className="maple-gradient">
          <Plus className="w-4 h-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <div className="w-3 h-12 bg-blue-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Claims</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-3 h-12 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Claims</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-3 h-12 bg-red-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-3 h-12 bg-gray-400 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="approvals" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              Claims Approvals
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-white">
              Claim Management
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="approvals" className="space-y-6">
          <DataTable
            data={claims}
            columns={claimsColumns}
            searchPlaceholder="Search by Employee, Category, or Amount"
            loading={isLoading}
          />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Claim Management</h3>
            <p className="text-gray-500">
              Advanced claim management features coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
