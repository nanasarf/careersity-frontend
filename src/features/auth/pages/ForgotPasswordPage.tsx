import { Link } from "react-router-dom";

// Password reset flow is not implemented in the current backend version.
export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="text-gray-600">
        Password reset is not yet available. Please contact support for help
        accessing your account.
      </p>
      <Link to="/login" className="text-blue-600 hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
