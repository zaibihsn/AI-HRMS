import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "priority";
  className?: string;
}

const statusStyles = {
  // General status styles
  active: "status-active",
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
  overdue: "status-overdue",
  open: "status-open",
  in_progress: "status-in-progress",
  resolved: "status-resolved",
  closed: "status-resolved",
  on_leave: "status-pending",
  terminated: "status-rejected",
  paid: "status-approved",
  
  // Priority styles
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  urgent: "priority-urgent",
};

const statusLabels = {
  active: "Active",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  overdue: "Overdue",
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  on_leave: "On Leave",
  terminated: "Terminated",
  paid: "Paid",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(" ", "_");
  const styleClass = statusStyles[normalizedStatus as keyof typeof statusStyles] || "status-pending";
  const label = statusLabels[normalizedStatus as keyof typeof statusLabels] || status;

  return (
    <span
      className={cn(
        "status-badge",
        styleClass,
        className
      )}
    >
      {label}
    </span>
  );
}
