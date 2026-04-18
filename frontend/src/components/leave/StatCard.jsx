import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Compact metric card used by dashboards.
 */
export const StatCard = ({ title, value, helper }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-semibold tracking-normal">{value}</p>
      {helper ? <p className="mt-1 text-sm text-muted-foreground">{helper}</p> : null}
    </CardContent>
  </Card>
);
