import { HexagonSharp } from "@/app/hexagon";

export function Placeholder() {
  return <div className="grid grid-cols-2 grid-rows-2 gap-x-[2px]">
  <HexagonSharp
    className="motion-preset-blink col-span-2 flex self-center justify-self-center motion-duration-1500"
  fill="var(--highlight)"
  fillOpacity={1}
  />
  <HexagonSharp
  className="motion-preset-blink -translate-y-4 motion-duration-1500 motion-delay-1000"
  fill="var(--highlight)"
  fillOpacity={1}
  />
  <HexagonSharp
  className="motion-preset-blink -translate-y-4 motion-duration-1500 motion-delay-500"
  fill="var(--highlight)"
  fillOpacity={1}
  />
  </div>
}
