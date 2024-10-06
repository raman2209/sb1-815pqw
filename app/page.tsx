import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to Clinic Management System</h1>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}