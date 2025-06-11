import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react'; // Using CheckCircle2 for better visibility

interface OrderStatus {
  id: string;
  label: string;
  timestamp?: string; // Optional: e.g., "10:35 AM" or full date
}

interface OrderStatusBarProps {
  statuses: OrderStatus[]; // All possible statuses in order
  currentStatusId: string; // The ID of the current status
  className?: string;
}

const OrderStatusBar: React.FC<OrderStatusBarProps> = ({
  statuses,
  currentStatusId,
  className,
}) => {
  console.log("Rendering OrderStatusBar, current status:", currentStatusId);
  const currentStatusIndex = statuses.findIndex(s => s.id === currentStatusId);

  if (currentStatusIndex === -1) {
    console.warn("OrderStatusBar: currentStatusId not found in statuses array.");
    return <div className="text-destructive">Error: Invalid order status.</div>;
  }

  return (
    <div className={cn("w-full p-4", className)}>
      <div className="flex items-start justify-between">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isActive = index === currentStatusIndex;

          return (
            <React.Fragment key={status.id}>
              <div className="flex flex-col items-center text-center w-1/4 max-w-[100px]">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground text-muted-foreground",
                    isActive && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : <span className="text-xs">{index + 1}</span>}
                </div>
                <p className={cn("text-xs font-medium", isCompleted ? "text-primary" : "text-muted-foreground")}>
                  {status.label}
                </p>
                {isCompleted && status.timestamp && (
                  <p className="text-xs text-muted-foreground">{status.timestamp}</p>
                )}
              </div>
              {index < statuses.length - 1 && (
                <div className={cn(
                    "flex-1 h-0.5 mt-4",
                    index < currentStatusIndex ? "bg-primary" : "bg-muted-foreground/50"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusBar;