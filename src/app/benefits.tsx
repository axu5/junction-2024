import HoneyCombImage from "@/../public/honeycomb.png";
import { cn } from "@/cn";
import Image from "next/image";

type BenefitProps = {
  name: string;
  className?: string;
};

export function Benefit({ name, className }: BenefitProps) {
  return (
    <div
      className={cn(
        "motion-preset-slide-left flex flex-row items-center justify-start gap-x-3 rounded-full bg-secondary px-5 py-3 text-center font-staatliches text-lg uppercase text-foreground",
        className,
      )}
    >
      <Image
        src={HoneyCombImage}
        alt="Honeycomb"
        className="w-6 object-cover object-center"
      />
      {name}
    </div>
  );
}
