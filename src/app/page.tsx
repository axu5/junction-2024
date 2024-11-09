import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="font-staatliches text-5xl uppercase text-white">
        Ignore the buzz <br />
        with AI powered search
      </h1>
      <h2 className="text-3xl uppercase text-white">
        Find a role that lets you{" "}
        <span className="text-highlight">bee yourself</span> — In a workplace
        that aligns with what matters to you most
      </h2>
      <Link
        className="bg-primary flex flex-row justify-center rounded-full p-3 text-center text-white"
        href="/job-quiz"
      >
        Get Started <ArrowRight />
      </Link>
    </>
  );
}
