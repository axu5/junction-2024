import { cn } from "@/cn";

export function HexagonGroup({ className = "" }: { className?: string }) {
  const hex1 = Math.random();
  const hex1Active = ((hex1 * 1000) | 0) % 3 === 0;
  const hex2 = Math.random();
  const hex2Active = ((hex2 * 1000) | 0) % 3 === 0;
  const hex3 = Math.random();
  const hex3Active = ((hex3 * 1000) | 0) % 3 === 0;
  return (
    <div className={cn("absolute -z-50 flex flex-col", className)}>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-[2px]">
        <HexagonSharp
          className={cn("col-span-2 flex self-center justify-self-center", {
            "motion-preset-blink motion-duration-1000":
              hex1Active && hex1 < 0.3,
            "motion-preset-blink motion-duration-1500":
              hex1Active && hex1 > 0.3 && hex1 < 0.6,
            "motion-preset-blink motion-duration-2000":
              hex1Active && hex1 > 0.6,
          })}
        />
        <HexagonSharp
          className={cn("flex -translate-y-4 self-center justify-self-center", {
            "motion-preset-blink motion-duration-1000":
              hex2Active && hex2 < 0.3,
            "motion-preset-blink motion-duration-1500":
              hex2Active && hex2 > 0.3 && hex2 < 0.6,
            "motion-preset-blink motion-duration-2000":
              hex2Active && hex2 > 0.6,
          })}
        />
        <HexagonSharp
          className={cn("flex -translate-y-4 self-center justify-self-center", {
            "motion-preset-blink motion-duration-1000":
              hex3Active && hex3 < 0.3,
            "motion-preset-blink motion-duration-1500":
              hex3Active && hex3 > 0.3 && hex3 < 0.6,
            "motion-preset-blink motion-duration-2000":
              hex3Active && hex3 > 0.6,
          })}
        />
      </div>
    </div>
  );
}

export function HexagonSharp({ className = "" }: { className?: string }) {
  return (
    <svg
      width="65"
      height="75"
      viewBox="0 0 65 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask
        id="mask0_23_619"
        style={{ maskType: "luminance" }} //"mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="65"
        height="75"
      >
        <path d="M0 0H64.5822V74.1552H0V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_23_619)">
        <path
          d="M0.0140305 20.5986V53.8247C0.0140305 54.5077 0.182213 55.1479 0.518579 55.7415C0.854944 56.3352 1.31394 56.8036 1.89557 57.1469L30.0732 73.7367C30.6548 74.08 31.282 74.2517 31.9512 74.2517C32.624 74.2517 33.2476 74.08 33.8293 73.7367L62.0034 57.1469C62.585 56.8036 63.044 56.3352 63.3804 55.7415C63.7167 55.1479 63.8849 54.5077 63.8849 53.8247V20.5986C63.8849 19.912 63.7167 19.2719 63.3804 18.6782C63.044 18.0846 62.585 17.6197 62.0034 17.2764L33.8293 0.675855C33.2476 0.332544 32.624 0.160889 31.9512 0.160889C31.282 0.160889 30.6548 0.332544 30.0732 0.675855L1.89557 17.2764C1.31394 17.6197 0.854944 18.0846 0.518579 18.6782C0.182213 19.2719 0.0140305 19.912 0.0140305 20.5986Z"
          fill="#F38854"
          fillOpacity={0.1}
        />
        <mask
          id="mask1_23_619"
          style={{ maskType: "luminance" }} //"mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="65"
          height="75"
        >
          <path d="M0 0H64.5822V74.1552H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask1_23_619)">
          <path
            d="M0.0140305 20.5986V53.8247C0.0140305 54.5077 0.182213 55.1479 0.518579 55.7415C0.854944 56.3352 1.31394 56.8036 1.89557 57.1469L30.0732 73.7367C30.6548 74.08 31.282 74.2517 31.9512 74.2517C32.624 74.2517 33.2476 74.08 33.8293 73.7367L62.0034 57.1469C62.585 56.8036 63.044 56.3352 63.3804 55.7415C63.7167 55.1479 63.8849 54.5077 63.8849 53.8247V20.5986C63.8849 19.912 63.7167 19.2719 63.3804 18.6782C63.044 18.0846 62.585 17.6197 62.0034 17.2764L33.8293 0.675855C33.2476 0.332544 32.624 0.160889 31.9512 0.160889C31.282 0.160889 30.6548 0.332544 30.0732 0.675855L1.89557 17.2764C1.31394 17.6197 0.854944 18.0846 0.518579 18.6782C0.182213 19.2719 0.0140305 19.912 0.0140305 20.5986Z"
            fill="#F38854"
            fillOpacity={0.1}
          />
        </g>
      </g>
    </svg>
  );
}
