"use client";

import { cn } from "@/cn";
import Link from "next/link";
import { useState } from "react";

export function GetStartedButton() {
  const [clicked, setClicked] = useState(false);

  return (
    <Link
      onClick={() => {
        setClicked(true);
      }}
      href="/job-quiz"
      className={
        "sticky top-5 mx-auto flex max-w-2xl translate-y-5 flex-row justify-center rounded-full bg-highlight py-5 text-center font-staatliches text-3xl text-foreground xl:top-10 xl:translate-y-0"
      }
    >
      <span
        className={cn({
          "motion-preset-confetti": clicked,
        })}
      >
        Get started
      </span>
    </Link>
  );
}
