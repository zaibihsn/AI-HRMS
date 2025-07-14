import { useQuery, useMutation } from "@tanstack/react-query";
import { EmployeeWithUser, InsertEmployee } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EmployeesResponse {
  employees: EmployeeWithUser[];
  total: number;
}

interface UseEmployeesOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

export function useEmployees(options: UseEmployeesOptions = {}) {
  const { limit = 50, offset = 0, search } = options;
  
  return useQuery<EmployeesResponse>({
    queryKey: ["/api/employees", { limit, offset, search }],
    enabled: true,
  });
}

export function useEmployee(id: number) {
  return useQuery<EmployeeWithUser>({
    queryKey: [`/api/employees/${id}`],
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateEmployee() {
  return useMutation({
    mutationFn: async (employee: InsertEmployee) => {
      const response = await apiRequest("POST", "/api/employees", employee);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
    },
  });
}

export function useUpdateEmployee() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertEmployee> }) => {
      const response = await apiRequest("PATCH", `/api/employees/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
    },
  });
}

export function useSearchEmployees(query: string) {
  return useQuery<EmployeesResponse>({
    queryKey: ["/api/employees", { search: query }],
    enabled: !!query && query.length > 0,
  });
}
