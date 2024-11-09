import openai from "@/app/ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { values, document } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      {
        role: "system",
        content: `
Your job is to analyze a company and a job seeker's values and determine whether they are a good fit.
Your output is shown to the job seeker. Only include the summary. Explain to the user why they would be a good fit
for the given company. Write your response in plain text. Focus on the shared values. Keep your response within 200 words at maximum.
`
      },
      {
        role: "user",
        content: `
The input follows this type:

type Category = {
category: string;
rating: number;
};

type CEO = {
name: string;
approvalRate: number;
};

type Input = {
average: number;
categories: Category[];
recommendRate: number;
positiveBusinessOutlookRate: number;
ceo: CEO;
};

The average rating and category ratings are a number between 0 and 5, where 5 is best. Recommend rate, positive business outlook rate and CEO approval rate are numbers between 0 and 1, where 1 is best. If any field does not conform to the spec, ignore it.

User's values (starts at --- and ends at ---):

---

${values.join(", ")}

---

Input (starts at --- and ends at ---):

---

${JSON.stringify(document).slice(0, 10_000)}

---


        `
      }
    ]
  });

  return new NextResponse(completion.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
