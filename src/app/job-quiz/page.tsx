/**
Overall Stars/5

Culture & values/5
Company driven by profit or purpose and impact focused
Mentorship opportunities or self-directed learning
Social team with frequent events or minimal social expectations?

Work/Life balance/5
Remote work flexibility or in-office layout
fixed or flexible hours
Contract-based role or full-time, permanent position?
Company with frequent changes or consistency in roles and expectations?
Creative problem-solving or clear procedures and protocols?

Career opportunities/5
mentorship opportunities or self-directed learning
Fast-growing startup with high potential but some risk or stable, established company with predictable growth?
Company with frequent changes or consistency in roles and expectations?
Rapid innovation with constant changes or steady, predictable growth?
Defined role with clear expectations or evolving role with shifting tasks?
Focus on depth in a specific skill or variety and flexibility in responsibilities?

Compensation and benefits/5
high salary with basic benefits or moderate salary with extensive benefits
wellness programs (fitness, therapy) or lifestyle perks (travel, meals)
Fast-growing startup with high potential but some risk or stable, established company with predictable growth?
Individual rewards or team-based incentives?

Senior management approval/5
detailed guidance and procedures or freedom to figure things out independently
Creative problem-solving or clear procedures and protocols?
Working with established systems or room for experimenting with new approaches? 
 */

import { QuizComponent } from "./components";

export type Categories =
  | "Overall Stars"
  | "% that would recommend to a friend"
  | "% that approve of CEO"
  | "% of people that have a positive business outlook"
  | "Diversity & Inclusion"
  | "Culture & values"
  | "Work/Life balance"
  | "Career opportunities"
  | "Compensation and benefits"
  | "Senior management";

type Question = {
  a: string;
  b: string;
  // between [0, 1)
  affects: { [K in Categories]?: number };
};

export type Questions = Record<string, Question>;

const questions: Questions = {
  "Collaborative work style or independent work style?": {
    a: "Collaborative work style", // -1
    b: "Independent work style", // 1
    affects: {
      "% that would recommend to a friend": -0.5,
      "Culture & values": 0.5,
    },
  },
  "Startup/entrepreneurial culture or traditional corporate culture": {
    a: "Startup/entrpreneurship culture",
    b: "Traditional corporate culture",
    affects: {
      "% that approve of CEO": -0.7,
      "% of people that have a positive business outlook": 0.6,
      "Culture & values": 0.3,
    },
  },
  "High-pressure deadlines or steady workload with predictable timelines?": {
    a: "High-pressure deadlines",
    b: "Steady workload with predictable timelines",
    affects: {
      "% of people that have a positive business outlook": 0.3,
      "Work/Life balance": 0.9,
    },
  },
  "Working with established systems or room for experimenting with new approaches?":
    {
      a: "Working with established systems",
      b: "Room for experimenting with new approaches",
      affects: { "Culture & values": -0.1 },
    },
  "Dress code/uniform or own clothes": {
    a: "Dress code/uniform",
    b: "Own clothes",
    affects: {
      "Diversity & Inclusion": 0.6,
      "Culture & values": -0.1,
    },
  },
  "Long term projects with consistent workload or fast paced projects with occasional crunch time":
    {
      a: "Long term projects with consistent workload",
      b: "Fast paced projects with occasional crunch time",
      affects: {
        "Culture & values": -0.2,
      },
    },
  "Small, close-knit team or large, diverse team?": {
    a: "Small, close-knit team",
    b: "Large, diverse team",
    affects: {
      "Diversity & Inclusion": 0.5,
      "Culture & values": 0.1,
    },
  },
  "Focus on depth in a specific skill or variety and flexibility in responsibilities?":
    {
      a: "Focus on depth in a specific skill",
      b: "Variety and flexibility in responsibilities",
      affects: {
        "Diversity & Inclusion": 0.4,
        "Career opportunities": -0.1,
      },
    },
};

export default async function JobQuiz() {
  const randQ = (Math.random() * Object.keys(questions).length) | 0;

  return (
    <div className="flex flex-col gap-y-10">
      <h1 className="text-5xl">Job quiz!</h1>
      <h2 className="text-2xl">Section 1: This or that</h2>
      <QuizComponent questions={questions} qIdx={randQ} />
    </div>
  );
}
