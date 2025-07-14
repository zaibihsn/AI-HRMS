import { useQuery, useMutation } from "@tanstack/react-query";
import { TicketWithEmployee, InsertTicket } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TicketsResponse {
  tickets: TicketWithEmployee[];
  stats: {
    open: number;
    inProgress: number;
    resolved: number;
    overdue: number;
  };
}

interface UseTicketsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  priority?: string;
}

export function useTickets(options: UseTicketsOptions = {}) {
  const { limit = 50, offset = 0, status, priority } = options;
  
  return useQuery<TicketsResponse>({
    queryKey: ["/api/tickets", { limit, offset, status, priority }],
  });
}

export function useTicket(id: number) {
  return useQuery<TicketWithEmployee>({
    queryKey: ["/api/tickets", id],
    enabled: !!id,
  });
}

export function useCreateTicket() {
  return useMutation({
    mutationFn: async (ticket: InsertTicket) => {
      const response = await apiRequest("POST", "/api/tickets", ticket);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });
}

export function useUpdateTicket() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertTicket> }) => {
      const response = await apiRequest("PATCH", `/api/tickets/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });
}

export function useAssignTicket() {
  return useMutation({
    mutationFn: async ({ id, assignedTo }: { id: number; assignedTo: string }) => {
      const response = await apiRequest("PATCH", `/api/tickets/${id}`, {
        assignedTo,
        status: "in_progress",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });
}

export function useResolveTicket() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/tickets/${id}`, {
        status: "resolved",
        resolvedAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });
}
