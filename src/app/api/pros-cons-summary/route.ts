import { json } from "@/app/api/chat-server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { values, document } = await req.json();

  return await json({
    system: `
Using information of a company and the values of an user, list the 5 most common pros and 5 most common cons.
Use reviews as references, and mention them whenever possible.
Format your output as following this JSON:

{
  pros: [/* insert pros here as strings */],
  cons: [/* insert cons here as strings */]
}

The output MUST be valid JSON. It must NOT contain anything other than the JSON. The output must be able to be
passed to JSON.parse without issues.
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

Remember: give your output as plain JSON.
        `
  });
}
