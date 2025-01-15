import Link from "next/link";

export default function FailedOnboardingPage() {
  return (
    <div>
      <h1 className="text-6xl font-bold">Failed onboarding</h1>
      <p className="mt-4">
        It looks like you failed onboarding.{" "}
        <Link href="/users">👉 Try again?</Link>
      </p>
    </div>
  );
}
