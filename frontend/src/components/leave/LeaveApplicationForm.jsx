import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useLeaveStore } from "@/store/leaveStore";
import { FEMALE_ONLY_LEAVE_TYPES, LEAVE_TYPES, NORMAL_LEAVE_TYPES } from "@/utils/constants";
import { calculateInclusiveDays, getTodayInputValue } from "@/utils/formatters";

const initialForm = {
  leaveType: "",
  startDate: "",
  endDate: "",
  deliveryDate: "",
  reason: ""
};

/**
 * Employee leave application form with policy-aware UI validation.
 */
export const LeaveApplicationForm = () => {
  const { user } = useAuthStore();
  const { applyLeave, submitting, fetchSummary, fetchMyLeaves } = useLeaveStore();
  const [form, setForm] = useState(initialForm);
  const [documentAcknowledged, setDocumentAcknowledged] = useState(false);
  const minDate = getTodayInputValue();
  const numberOfDays = calculateInclusiveDays(form.startDate, form.endDate);
  const isFemale = user?.gender === "female";
  const isMaternity = form.leaveType === LEAVE_TYPES.MATERNITY;
  const isMenstrual = form.leaveType === LEAVE_TYPES.MENSTRUAL;

  const leaveOptions = useMemo(() => {
    return isFemale ? [...NORMAL_LEAVE_TYPES, ...FEMALE_ONLY_LEAVE_TYPES] : NORMAL_LEAVE_TYPES;
  }, [isFemale]);

  useEffect(() => {
    setDocumentAcknowledged(false);
  }, [form.leaveType]);

  /**
   * Updates one leave application field in local form state.
   * @param {string} field Form field name.
   * @param {string} value Form field value.
   */
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  /**
   * Shows the UI-only upload placeholder toast.
   * @returns {void}
   */
  const handleUploadClick = () => {
    setDocumentAcknowledged(true);
    toast.info("This feature is under development");
  };

  /**
   * Validates client-side leave form rules before submission.
   * @returns {string|null} Validation error message or null when valid.
   */
  const validateForm = () => {
    if (!form.leaveType) return "Please select a leave type.";
    if (!form.startDate || !form.endDate) return "Please choose start and end dates.";
    if (numberOfDays < 1) return "End date must be on or after start date.";
    if (isMenstrual && numberOfDays > 3) return "Menstrual leave can be between 1 and 3 days per month.";
    if (isMaternity && !form.deliveryDate) return "Expected delivery date is required for maternity leave.";
    if (isMaternity && !documentAcknowledged) return "Maternity document upload must be acknowledged.";
    return null;
  };

  /**
   * Submits the leave form data to the server.
   * @param {SubmitEvent} event Form submit event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validateForm();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      const data = await applyLeave({
        leaveType: form.leaveType,
        numberOfDays,
        startDate: form.startDate,
        endDate: form.endDate,
        deliveryDate: isMaternity ? form.deliveryDate : undefined,
        reason: form.reason
      });

      toast.success(data.message || "Leave request submitted.");
      setForm(initialForm);
      setDocumentAcknowledged(false);
      fetchSummary();
      fetchMyLeaves();
    } catch (submitError) {
      toast.error(submitError.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Leave Request</CardTitle>
        <CardDescription>
          Requests start from today or a future date. Any excess paid leave is moved to unpaid leave within policy limits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              id="leaveType"
              value={form.leaveType}
              onChange={(event) => updateField("leaveType", event.target.value)}
              required
            >
              <option value="">Choose leave type</option>
              {leaveOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                min={minDate}
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                min={form.startDate || minDate}
                value={form.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfDays">Number of Days</Label>
              <Input id="numberOfDays" value={numberOfDays || ""} readOnly required />
            </div>
          </div>

          {isMaternity ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={form.deliveryDate}
                  onChange={(event) => updateField("deliveryDate", event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Maternity Document</Label>
                <Button type="button" variant="outline" onClick={handleUploadClick}>
                  <Upload className="h-4 w-4" />
                  {documentAcknowledged ? "Document Noted" : "Upload Required"}
                </Button>
                <p className="text-xs text-muted-foreground">The upload action is UI-only right now.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>File Upload</Label>
              <Button type="button" variant="outline" className="w-fit" onClick={handleUploadClick}>
                <Upload className="h-4 w-4" />
                Upload file
              </Button>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason / Note</Label>
            <Textarea
              id="reason"
              placeholder="Add a note for the admin"
              value={form.reason}
              onChange={(event) => updateField("reason", event.target.value)}
            />
          </div>

          <Button type="submit" className="w-full sm:w-fit" loading={submitting}>
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
