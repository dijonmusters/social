"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Countdown({ numFollowed }: { numFollowed: number }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft > 0) {
          return timeLeft - 1;
        } else {
          clearInterval(interval);
          redirect("/onboarding/failed");
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-6xl font-bold">
        Follow {100 - numFollowed} more people!
      </h1>
      <p className="text-gray-300 mt-2">You have {timeLeft} seconds left</p>
    </div>
  );
}
