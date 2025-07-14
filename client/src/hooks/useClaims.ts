import { useQuery, useMutation } from "@tanstack/react-query";
import { ClaimWithEmployee, InsertClaim } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ClaimsResponse {
  claims: ClaimWithEmployee[];
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

interface UseClaimsOptions {
  limit?: number;
  offset?: number;
  status?: string;
}

export function useClaims(options: UseClaimsOptions = {}) {
  const { limit = 50, offset = 0, status } = options;
  
  return useQuery<ClaimsResponse>({
    queryKey: ["/api/claims", { limit, offset, status }],
  });
}

export function useClaim(id: number) {
  return useQuery<ClaimWithEmployee>({
    queryKey: ["/api/claims", id],
    enabled: !!id,
  });
}

export function useCreateClaim() {
  return useMutation({
    mutationFn: async (claim: InsertClaim) => {
      const response = await apiRequest("POST", "/api/claims", claim);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
    },
  });
}

export function useUpdateClaim() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertClaim> }) => {
      const response = await apiRequest("PATCH", `/api/claims/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
    },
  });
}

export function useApproveClaim() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/claims/${id}`, {
        status: "approved",
        approvedBy: "AI System",
        approvedAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
    },
  });
}

export function useRejectClaim() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/claims/${id}`, {
        status: "rejected",
        approvedBy: "AI System",
        approvedAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
    },
  });
}
