import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            SimuHub AI
          </Link>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
