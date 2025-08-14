import { Badge } from "@/components/ui/badge";
import { TicketStatus, TicketPriority } from "@/contexts/TicketContext";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return {
          text: 'Open',
          className: 'bg-status-open text-status-open-foreground hover:bg-status-open/80',
        };
      case 'in-progress':
        return {
          text: 'In Progress',
          className: 'bg-status-progress text-status-progress-foreground hover:bg-status-progress/80',
        };
      case 'resolved':
        return {
          text: 'Resolved',
          className: 'bg-status-resolved text-status-resolved-foreground hover:bg-status-resolved/80',
        };
      case 'closed':
        return {
          text: 'Closed',
          className: 'bg-status-closed text-status-closed-foreground hover:bg-status-closed/80',
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-muted text-muted-foreground',
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.text}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityConfig = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return {
          text: 'Low',
          className: 'bg-priority-low text-priority-low-foreground hover:bg-priority-low/80',
        };
      case 'medium':
        return {
          text: 'Medium',
          className: 'bg-priority-medium text-priority-medium-foreground hover:bg-priority-medium/80',
        };
      case 'high':
        return {
          text: 'High',
          className: 'bg-priority-high text-priority-high-foreground hover:bg-priority-high/80',
        };
      case 'urgent':
        return {
          text: 'Urgent',
          className: 'bg-priority-urgent text-priority-urgent-foreground hover:bg-priority-urgent/80 animate-pulse',
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-muted text-muted-foreground',
        };
    }
  };

  const config = getPriorityConfig(priority);
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.text}
    </Badge>
  );
}