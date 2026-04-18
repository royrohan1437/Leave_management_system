import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/leave/StatusBadge";
import { formatDateRange } from "@/utils/formatters";

/**
 * Expandable admin card for reviewing a pending leave adjustment request.
 */
export const AdjustmentRequestCard = ({ adjustment, onApprove, onReject, actionId }) => {
  const [expanded, setExpanded] = useState(false);

  /**
   * Collects an optional rejection note before sending the admin action.
   * @returns {void}
   */
  const handleReject = () => {
    const reason = window.prompt("Optional rejection note") ?? null;

    if (reason === null) return;
    onReject(adjustment._id, reason);
  };

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base">{adjustment.employeeSnapshot?.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{adjustment.employeeSnapshot?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={adjustment.status} />
          <Button variant="ghost" size="icon" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-muted-foreground">Request Type</p>
          <p className="font-medium">{adjustment.adjustmentType}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Leave Type</p>
          <p className="font-medium">{adjustment.originalLeaveSnapshot?.leaveType}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Original Dates</p>
          <p className="font-medium">
            {formatDateRange(
              adjustment.originalLeaveSnapshot?.startDate,
              adjustment.originalLeaveSnapshot?.endDate
            )}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Requested Dates</p>
          <p className="font-medium">
            {formatDateRange(adjustment.requestedStartDate, adjustment.requestedEndDate)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Days</p>
          <p className="font-medium">
            {adjustment.originalLeaveSnapshot?.numberOfDays} -&gt; {adjustment.requestedNumberOfDays}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Paid / Unpaid</p>
          <p className="font-medium">{adjustment.requestedPaidDays} / {adjustment.requestedUnpaidDays}</p>
        </div>
        {expanded ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-muted-foreground">Reason</p>
            <p className="mt-1 rounded-md bg-muted p-3">{adjustment.reason || "No note added."}</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="success" loading={actionId === adjustment._id} onClick={() => onApprove(adjustment._id)}>
          Approve
        </Button>
        <Button variant="destructive" loading={actionId === adjustment._id} onClick={handleReject}>
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
};
