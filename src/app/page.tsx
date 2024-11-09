import HustleHiveArrowDown from "@/../public/arrow-down.png";
import Image from "next/image";
import Link from "next/link";
import { Benefit } from "./benefits";
import { HexagonSharp } from "./hexagon";

export default function Home() {
  return (
    <>
      <section className="h-[100vh]">
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
      </section>

      <section className="flex h-[75vh] flex-col items-center justify-center gap-y-10">
        <h2 className="bg-secondary font-staatliches rounded-xl p-12 text-2xl text-foreground">
          Aligning your career with your values has a direct impact on your
          overall satisfaction, motivation, and well-being.
        </h2>
        <h2 className="bg-secondary font-staatliches rounded-xl p-12 text-2xl text-foreground">
          Roles that respect work-life balance support mental and physical
          health, preventing burnout and helping you stay present in all areas
          of life.
        </h2>
      </section>
      <section className="flex h-[75vh] flex-col items-center justify-center gap-y-10">
        <h2 className="font-staatliches text-2xl text-foreground">
          Let our AI match you with potential employers
        </h2>
        <h2 className="font-staatliches text-2xl text-foreground">
          Train it by answering a few questions!
        </h2>
        <div className="grid grid-cols-2 grid-rows-2 gap-x-[2px]">
          <HexagonSharp className="col-span-2 flex self-center justify-self-center" />
          <HexagonSharp
            className="motion-preset-blink -translate-y-4 motion-duration-2000 motion-delay-1000"
            fill="var(--highlight)"
            fillOpacity={1}
          />
          <HexagonSharp
            className="motion-preset-blink -translate-y-4 motion-duration-2000"
            fill="var(--highlight)"
            fillOpacity={1}
          />
        </div>
      </section>
    </>
  );
}
