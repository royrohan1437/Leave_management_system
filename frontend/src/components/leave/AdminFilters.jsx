import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LEAVE_STATUS } from "@/utils/constants";

/**
 * Admin filters for leave tables.
 */
export const AdminFilters = ({ filters, employees = [], onChange, onApply, onReset, loading }) => (
  <Card>
    <CardContent className="grid gap-4 p-4 md:grid-cols-5">
      <div className="grid gap-2">
        <Label>Status</Label>
        <Select value={filters.status || ""} onChange={(event) => onChange("status", event.target.value)}>
          <option value="">All processed</option>
          <option value={LEAVE_STATUS.PENDING}>Pending</option>
          <option value={LEAVE_STATUS.APPROVED}>Approved</option>
          <option value={LEAVE_STATUS.REJECTED}>Rejected</option>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Employee</Label>
        <Select value={filters.employee || ""} onChange={(event) => onChange("employee", event.target.value)}>
          <option value="">All employees</option>
          {employees.map((row) => (
            <option key={row.employee.id} value={row.employee.id}>
              {row.employee.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Start Date</Label>
        <Input
          type="date"
          value={filters.startDate || ""}
          onChange={(event) => onChange("startDate", event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>End Date</Label>
        <Input
          type="date"
          value={filters.endDate || ""}
          onChange={(event) => onChange("endDate", event.target.value)}
        />
      </div>
      <div className="flex items-end gap-2">
        <Button className="flex-1" loading={loading} onClick={onApply}>
          Apply
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </CardContent>
  </Card>
);
