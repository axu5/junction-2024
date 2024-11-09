import HustleHiveArrowDown from "@/../public/arrow-down.png";
import Image from "next/image";
import Link from "next/link";
import { Benefit } from "./benefits";

export default function Home() {
  return (
    <>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-5 py-20 xl:max-w-[60%]">
            <h1 className="font-staatliches text-7xl uppercase text-foreground">
              Ignore the <span className="text-highlight">buzz</span> with AI
              powered job search
            </h1>
            <h2 className="font-staatliches text-3xl uppercase text-foreground">
              Find a role that lets you{" "}
              <span className="text-highlight">bee yourself</span> — In a
              workplace that aligns with what matters to you most
            </h2>
            <p>Made with ❤️ in Junction</p>
          </div>
          {/* <Link
          className="bg-primary flex flex-row justify-center rounded-full p-3 text-center text-foreground"
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
        className="font-staatliches absolute bottom-20 left-1/2 mx-auto my-5 flex -translate-x-1/2 -translate-y-1/2 flex-row justify-center rounded-full bg-highlight px-16 py-5 text-center text-3xl text-foreground"
      >
        Get started
      </Link>
      <Image
        src={HustleHiveArrowDown}
        alt="Scroll down for more"
        className="motion-preset-oscillate absolute bottom-10 right-20 w-16 object-cover object-center"
      />
    </>
  );
}
