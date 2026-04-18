import { Button } from "@/components/ui/button";
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
import { LEAVE_STATUS } from "@/utils/constants";
import { formatDateRange } from "@/utils/formatters";

/**
 * Displays leave history in a responsive table.
 */
export const LeaveHistoryTable = ({
  leaves = [],
  showEmployee = false,
  onCancel,
  onAdjust,
  actionId,
  emptyMessage = "No leave records found."
}) => {
  /**
   * Determines whether the leave can be sent for extension/shortening.
   * @param {object} leave Leave row.
   * @returns {boolean} Whether the leave is current/future and pending/approved.
   */
  const canAdjustLeave = (leave) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(leave.endDate);
    endDate.setHours(0, 0, 0, 0);

    return [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED].includes(leave.status) && endDate >= today;
  };

  if (!leaves.length) {
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
              <TableHead>Dates</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              {onCancel || onAdjust ? <TableHead className="text-right">Action</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave._id}>
                {showEmployee ? (
                  <TableCell>
                    <p className="font-medium">{leave.employeeSnapshot?.name || leave.employee?.name}</p>
                    <p className="text-xs text-muted-foreground">{leave.employeeSnapshot?.email || leave.employee?.email}</p>
                  </TableCell>
                ) : null}
                <TableCell className="font-medium">{leave.leaveType}</TableCell>
                <TableCell>{formatDateRange(leave.startDate, leave.endDate)}</TableCell>
                <TableCell>
                  <div>{leave.numberOfDays}</div>
                  {leave.unpaidDays > 0 ? (
                    <p className="text-xs text-muted-foreground">{leave.unpaidDays} unpaid</p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <StatusBadge status={leave.status} />
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm">{leave.reason || "-"}</p>
                  {leave.rejectionReason ? (
                    <p className="mt-1 truncate text-xs text-destructive">{leave.rejectionReason}</p>
                  ) : null}
                </TableCell>
                {onCancel || onAdjust ? (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onAdjust && canAdjustLeave(leave) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAdjust(leave)}
                        >
                          Adjust
                        </Button>
                      ) : null}
                      {onCancel && leave.status === LEAVE_STATUS.PENDING ? (
                        <Button
                          variant="outline"
                          size="sm"
                          loading={actionId === leave._id}
                          onClick={() => onCancel(leave._id)}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
