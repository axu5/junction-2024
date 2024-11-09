import Link from "next/link";
import { Benefit } from "./benefits";

export default function Home() {
  return (
    <>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-5 py-20 xl:max-w-[60%]">
            <h1 className="font-staatliches text-7xl uppercase text-white">
              Ignore the <span className="text-highlight">buzz</span> with AI
              powered job search
            </h1>
            <h2 className="font-staatliches text-3xl uppercase text-white">
              Find a role that lets you{" "}
              <span className="text-highlight">bee yourself</span> — In a
              workplace that aligns with what matters to you most
            </h2>
          </div>
          {/* <Link
          className="bg-primary flex flex-row justify-center rounded-full p-3 text-center text-white"
          href="/job-quiz"
        >
          Get Started <ArrowRight />
        </Link> */}
        </div>
        <div className="flex flex-col justify-center gap-y-3 xl:w-[40%]">
          <Benefit
            name="Career Opportunities"
            className="z-10 h-20 shadow-md motion-delay-[0.25s]/translate xl:-translate-x-10"
          />
          <Benefit
            name="Remote work"
            className="z-20 h-16 shadow-md motion-delay-[0.5s]/translate xl:-translate-x-5"
          />
          <Benefit
            name="Compensation and benefits"
            className="z-10 h-20 shadow-md motion-delay-[0.75s]/translate xl:-translate-x-12"
          />
        </div>
      </div>
      <Link
        href="/job-quiz"
        className="mx-auto flex max-w-lg flex-row justify-center rounded-full bg-highlight px-5 py-5 text-center font-staatliches text-3xl text-white"
      >
        Get started
      </Link>
    </>
  );
}
