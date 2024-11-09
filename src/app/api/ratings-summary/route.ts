import { chat } from "@/app/api/chat-server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { alias, values, document } = await req.json();

  return await chat({
    system: `
Your job is to analyze a company and a job seeker's values and determine whether they are a good fit.
Your output is shown to the job seeker. Only include the summary. Explain to the user why they would be a good fit
for the given company. Write your response in plain text. Focus on the shared values. Keep your response within 140 words at maximum.
If possible and if applicable, use reviews as references and put emphasis on them. Also, put emphasis on potential cons.
`,
    prompt: `
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

Use ${alias} instead of the company name everywhere.
Turn a rating between 0 and 1 to a percentage (i.e. 0.45 becomes 45%).
        `
  });
}
