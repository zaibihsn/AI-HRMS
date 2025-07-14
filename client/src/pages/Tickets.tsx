import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Settings, Filter, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketWithEmployee } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TicketsResponse {
  tickets: TicketWithEmployee[];
  stats: {
    open: number;
    inProgress: number;
    resolved: number;
    overdue: number;
  };
}

export default function Tickets() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  const { data, isLoading } = useQuery<TicketsResponse>({
    queryKey: ["/api/tickets"],
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/tickets/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
    },
  });

  const tickets = data?.tickets || [];
  const stats = data?.stats || { open: 0, inProgress: 0, resolved: 0, overdue: 0 };

  const handleStatusUpdate = (ticketId: number, status: string) => {
    const updates: any = { status };
    if (status === "resolved") {
      updates.resolvedAt = new Date().toISOString();
    }
    updateTicketMutation.mutate({ id: ticketId, updates });
  };

  const ticketsColumns = [
    {
      key: "id" as const,
      header: "ID",
      render: (ticket: TicketWithEmployee) => (
        <span className="font-mono text-sm">#{ticket.id}</span>
      ),
    },
    {
      key: "title" as const,
      header: "Title",
      render: (ticket: TicketWithEmployee) => (
        <div>
          <div className="font-medium">{ticket.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {ticket.description}
          </div>
        </div>
      ),
    },
    {
      key: "employee" as const,
      header: "Assigned To",
      render: (ticket: TicketWithEmployee) => (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={`https://i.pravatar.cc/40?img=${ticket.employee.id}`}
              className="object-cover"
            />
            <AvatarFallback>
              {ticket.employee.user.firstName?.[0]}{ticket.employee.user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">
              {ticket.employee.user.firstName} {ticket.employee.user.lastName}
            </div>
            <div className="text-xs text-gray-500">{ticket.employee.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      key: "dueDate" as const,
      header: "Due Date",
      render: (ticket: TicketWithEmployee) => (
        <div className="text-sm">
          {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : "No due date"}
        </div>
      ),
    },
    {
      key: "category" as const,
      header: "Category",
      render: (ticket: TicketWithEmployee) => (
        <StatusBadge status={ticket.category} />
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (ticket: TicketWithEmployee) => (
        <StatusBadge status={ticket.status} />
      ),
    },
    {
      key: "priority" as const,
      header: "Priority",
      render: (ticket: TicketWithEmployee) => (
        <StatusBadge status={ticket.priority} variant="priority" />
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (ticket: TicketWithEmployee) => (
        <div className="flex items-center space-x-2">
          {ticket.status === "open" && (
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => handleStatusUpdate(ticket.id, "in_progress")}
              disabled={updateTicketMutation.isPending}
            >
              Start
            </Button>
          )}
          {ticket.status === "in_progress" && (
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => handleStatusUpdate(ticket.id, "resolved")}
              disabled={updateTicketMutation.isPending}
            >
              Resolve
            </Button>
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
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500">Intelligent ticket routing and resolution</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="maple-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="inbox" className="data-[state=active]:bg-white">
              Inbox
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-white">
              Sent
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              Dashboard
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advance Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unassigned Tickets</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.open}</p>
                  </div>
                  <div className="w-3 h-12 bg-orange-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Tickets</p>
                    <p className="text-3xl font-bold text-green-600">{stats.inProgress}</p>
                  </div>
                  <div className="w-3 h-12 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.resolved}</p>
                  </div>
                  <div className="w-3 h-12 bg-blue-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Tickets</p>
                    <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                  <div className="w-3 h-12 bg-red-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets Table */}
          <DataTable
            data={tickets}
            columns={ticketsColumns}
            searchPlaceholder="Search by Title, Category, or Employee"
            loading={isLoading}
          />
        </TabsContent>

        <TabsContent value="inbox" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Inbox</h3>
            <p className="text-gray-500">
              Incoming ticket management features coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sent" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sent Tickets</h3>
            <p className="text-gray-500">
              Sent ticket history coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
