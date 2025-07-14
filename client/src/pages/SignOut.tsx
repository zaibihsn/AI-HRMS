import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SignOut() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-md w-full mx-auto mt-24 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Sign Out</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center mb-6">You have been signed out.</p>
          <p className="text-gray-500 text-center">
            Please close the browser or{" "}
            <a href="/" className="text-primary underline">
              log in again
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
