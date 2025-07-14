// Common types used across the application

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchOptions {
  query?: string;
  filters?: Record<string, any>;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

// Status types
export type EmployeeStatus = "active" | "on_leave" | "terminated";
export type ClaimStatus = "pending" | "approved" | "rejected" | "paid";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type Priority = "low" | "medium" | "high" | "urgent";

// Form data types
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  manager?: string;
  salary?: number;
  joinDate: string;
  phoneNumber?: string;
  address?: string;
}

export interface ClaimFormData {
  category: string;
  description: string;
  amount: number;
  claimDate: string;
  receiptUrl?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  dueDate?: string;
}

export interface LeaveRequestFormData {
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

// Dashboard stats
export interface DashboardMetrics {
  totalEmployees: number;
  activeRecruitments: number;
  pendingReviews: number;
  pendingLeaves: number;
  costSavings: number;
  systemUptime: number;
  autoProcessedToday: number;
  predictionAccuracy: number;
  avgResponseTime: string;
  manualInterventions: number;
}

// Filter options
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  name: string;
  options: FilterOption[];
  type: "single" | "multiple" | "range" | "date";
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T | "actions";
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Chat types
export interface ChatMessage {
  id: number;
  message: string;
  isFromUser: boolean;
  timestamp: string;
  context?: Record<string, any>;
}

export interface ChatContext {
  employeeId?: number;
  department?: string;
  currentPage?: string;
  recentActions?: string[];
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, any>;
}

// File upload types
export interface FileUpload {
  file: File;
  preview?: string;
  uploadProgress?: number;
  error?: string;
}

// Theme types
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

// User preferences
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  dashboard: {
    defaultView: string;
    refreshInterval: number;
  };
}
