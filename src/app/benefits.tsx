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
        "bg-secondary font-staatliches motion-preset-slide-left flex flex-row items-center justify-start gap-x-3 rounded-full px-5 py-3 text-center text-lg uppercase text-foreground",
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
