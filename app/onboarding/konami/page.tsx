import Link from "next/link";

export default function PassedOnboardingKonamiPage() {
  return (
    <div>
      <h1 className="text-6xl font-bold">Passed onboarding</h1>
      <p className="mt-4">
        Looks like you passed onboarding by cheating with the Konami code! Nice!{" "}
        <Link href="/">👉 See posts!</Link>
      </p>
    </div>
  );
}
