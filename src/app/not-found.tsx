import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-brand">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-brand/85 hover:bg-brand">
            <Link href="/" className="flex items-center gap-2 ">
              <HomeIcon />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="javascript:history.back()"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
