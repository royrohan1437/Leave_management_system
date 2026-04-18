import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLeaveStore } from "@/store/leaveStore";
import {
  calculateInclusiveDays,
  formatDateRange,
  getTodayInputValue,
  toDateInputValue
} from "@/utils/formatters";

/**
 * Form for requesting an extension or shortening of an existing leave.
 */
export const LeaveAdjustmentForm = ({ leave, onClose, onSubmitted }) => {
  const { requestLeaveAdjustment, actionId } = useLeaveStore();
  const [form, setForm] = useState({
    requestedStartDate: toDateInputValue(leave.startDate),
    requestedEndDate: toDateInputValue(leave.endDate),
    reason: ""
  });

  const todayValue = getTodayInputValue();
  const originalDays = leave.numberOfDays;
  const requestedDays = calculateInclusiveDays(form.requestedStartDate, form.requestedEndDate);

  const isCurrentLeave = useMemo(() => {
    const today = new Date(`${todayValue}T00:00:00`);
    const start = new Date(`${toDateInputValue(leave.startDate)}T00:00:00`);
    const end = new Date(`${toDateInputValue(leave.endDate)}T00:00:00`);

    return start <= today && end >= today;
  }, [leave.endDate, leave.startDate, todayValue]);

  const adjustmentLabel = requestedDays > originalDays
    ? "Extension"
    : requestedDays > 0 && requestedDays < originalDays
      ? "Shortening"
      : "No change";

  /**
   * Updates a single adjustment form field.
   * @param {string} field Form field name.
   * @param {string} value New field value.
   */
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  /**
   * Submits the adjustment request to the server for admin review.
   * @param {SubmitEvent} event Form submit event.
   * @returns {Promise<void>}
   */
  const submitAdjustmentForm = async (event) => {
    event.preventDefault();

    if (!form.requestedStartDate || !form.requestedEndDate) {
      toast.error("Please choose the adjusted start and end dates.");
      return;
    }

    if (requestedDays <= 0) {
      toast.error("Adjusted end date must be on or after the adjusted start date.");
      return;
    }

    if (requestedDays === originalDays) {
      toast.error("Adjusted dates must extend or shorten the leave.");
      return;
    }

    try {
      const data = await requestLeaveAdjustment(leave._id, form);
      toast.success(data.message || "Leave adjustment request submitted.");
      onSubmitted?.();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="mt-4 border-primary/30">
      <CardHeader>
        <CardTitle className="text-base">Adjust {leave.leaveType}</CardTitle>
        <CardDescription>
          Current range: {formatDateRange(leave.startDate, leave.endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submitAdjustmentForm}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor={`adjust-start-${leave._id}`}>Adjusted Start Date</Label>
              <Input
                id={`adjust-start-${leave._id}`}
                type="date"
                min={isCurrentLeave ? toDateInputValue(leave.startDate) : todayValue}
                value={form.requestedStartDate}
                disabled={isCurrentLeave}
                onChange={(event) => updateField("requestedStartDate", event.target.value)}
                required
              />
              {isCurrentLeave ? (
                <p className="text-xs text-muted-foreground">Current leave start date is locked.</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`adjust-end-${leave._id}`}>Adjusted End Date</Label>
              <Input
                id={`adjust-end-${leave._id}`}
                type="date"
                min={isCurrentLeave ? todayValue : form.requestedStartDate || todayValue}
                value={form.requestedEndDate}
                onChange={(event) => updateField("requestedEndDate", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Impact</Label>
              <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm">
                {adjustmentLabel} · {requestedDays || 0} day(s)
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`adjust-reason-${leave._id}`}>Reason / Note</Label>
            <Textarea
              id={`adjust-reason-${leave._id}`}
              value={form.reason}
              onChange={(event) => updateField("reason", event.target.value)}
              placeholder="Explain why this leave needs to change"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={actionId === leave._id}>
              Send Adjustment Request
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
