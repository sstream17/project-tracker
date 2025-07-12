import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardMetricsProps = {
  projectCount: number;
  technologiesInUseCount: number;
};

export function DashboardMetrics({ projectCount, technologiesInUseCount }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectCount}</div>
          <p className="text-xs text-muted-foreground">
            Total number of projects
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Technologies Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{technologiesInUseCount}</div>
          <p className="text-xs text-muted-foreground">
            Unique technologies across all projects
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
