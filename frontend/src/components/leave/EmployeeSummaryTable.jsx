import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDateRange } from "@/utils/formatters";

/**
 * Admin table of employee leave balances and current attendance status.
 */
export const EmployeeSummaryTable = ({ rows = [], onSelect }) => {
  if (!rows.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No employees found.
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
              <TableHead>Employee</TableHead>
              <TableHead>Leaves Left / Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Leave</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.employee.id}
                className="cursor-pointer"
                onClick={() => onSelect(row.employee.id)}
              >
                <TableCell>
                  <p className="font-medium">{row.employee.name}</p>
                  <p className="text-xs text-muted-foreground">{row.employee.email}</p>
                </TableCell>
                <TableCell>{row.leaveSummary.paidLeft} / {row.leaveSummary.totalPaid}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "On Leave" ? "pending" : "approved"}>{row.status}</Badge>
                </TableCell>
                <TableCell>
                  {row.activeLeave
                    ? formatDateRange(row.activeLeave.startDate, row.activeLeave.endDate)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
