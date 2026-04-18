import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { StatusBadge } from "@/components/leave/StatusBadge";
import { formatDateRange } from "@/utils/formatters";

/**
 * Displays employee/admin leave adjustment request history.
 */
export const AdjustmentHistoryTable = ({
  adjustments = [],
  showEmployee = false,
  emptyMessage = "No adjustment requests found."
}) => {
  if (!adjustments.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {showEmployee ? <TableHead>Employee</TableHead> : null}
              <TableHead>Leave Type</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Requested Dates</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((adjustment) => (
              <TableRow key={adjustment._id}>
                {showEmployee ? (
                  <TableCell>
                    <p className="font-medium">{adjustment.employeeSnapshot?.name || adjustment.employee?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {adjustment.employeeSnapshot?.email || adjustment.employee?.email}
                    </p>
                  </TableCell>
                ) : null}
                <TableCell className="font-medium">
                  {adjustment.originalLeaveSnapshot?.leaveType || adjustment.leave?.leaveType}
                </TableCell>
                <TableCell>{adjustment.adjustmentType}</TableCell>
                <TableCell>
                  {formatDateRange(adjustment.requestedStartDate, adjustment.requestedEndDate)}
                </TableCell>
                <TableCell>
                  <div>{adjustment.requestedNumberOfDays}</div>
                  {adjustment.requestedUnpaidDays > 0 ? (
                    <p className="text-xs text-muted-foreground">{adjustment.requestedUnpaidDays} unpaid</p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <StatusBadge status={adjustment.status} />
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm">{adjustment.reason || "-"}</p>
                  {adjustment.rejectionReason ? (
                    <p className="mt-1 truncate text-xs text-destructive">{adjustment.rejectionReason}</p>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
