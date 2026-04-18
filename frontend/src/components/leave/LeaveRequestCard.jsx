import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/leave/StatusBadge";
import { formatDateRange } from "@/utils/formatters";

/**
 * Expandable admin card for reviewing a pending leave request.
 */
export const LeaveRequestCard = ({ leave, onApprove, onReject, actionId }) => {
  const [expanded, setExpanded] = useState(false);

  const handleReject = () => {
    const reason = window.prompt("Optional rejection note") ?? null;

    if (reason === null) return;
    onReject(leave._id, reason);
  };

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base">{leave.employeeSnapshot?.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{leave.employeeSnapshot?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={leave.status} />
          <Button variant="ghost" size="icon" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-muted-foreground">Leave Type</p>
          <p className="font-medium">{leave.leaveType}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Dates</p>
          <p className="font-medium">{formatDateRange(leave.startDate, leave.endDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Days</p>
          <p className="font-medium">{leave.numberOfDays}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Paid / Unpaid</p>
          <p className="font-medium">{leave.paidDays} / {leave.unpaidDays}</p>
        </div>
        {expanded ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-muted-foreground">Reason</p>
            <p className="mt-1 rounded-md bg-muted p-3">{leave.reason || "No note added."}</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="success" loading={actionId === leave._id} onClick={() => onApprove(leave._id)}>
          Approve
        </Button>
        <Button variant="destructive" loading={actionId === leave._id} onClick={handleReject}>
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
};
