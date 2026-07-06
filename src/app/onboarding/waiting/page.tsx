import { Car } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WaitingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Car className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Waiting for Assignment</CardTitle>
          <CardDescription>
            Your account has been created. Please contact your manager to assign
            you to a company before you can start inspections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Once assigned, refresh this page or sign in again to access the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
