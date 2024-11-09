import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        highlight: "var(--highlight)",
        secondary: "var(--secondary)",
        "secondary-backdrop": "var(--secondary-backdrop)",
      },
      fontFamily: {
        staatliches: "var(--font-staatliches-regular)",
      },
    },
  },
  // eslint-disable-next-line
  plugins: [require("tailwindcss-motion")],
} satisfies Config;
