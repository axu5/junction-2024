import { cn } from "@/cn";
import { Bandage } from "lucide-react";

type Props = {
  name: string;
  className?: string;
};

export function Frustration({ name, className }: Props) {
  return (
    <div
      className={cn(
        "bg-tertiary motion-preset-slide-left flex flex-row items-center justify-start gap-x-3 rounded-full px-5 py-3 text-center font-staatliches text-lg uppercase text-foreground",
        className,
      )}
    >
      <Bandage className="w-6 rotate-[-45deg]"></Bandage>
      {name}
    </div>
  );
}
