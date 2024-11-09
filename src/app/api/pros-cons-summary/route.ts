import { json } from "@/app/api/chat-server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { alias, document, user } = await req.json();

  return await json({
    system: `
Using information of a company and the values of an user, list the 5 most common pros and 5 most common cons.
Also, include three short bullet points from both pros and cons. Format them in the form [adjective] [verb].
Use reviews as references, and mention them whenever possible.
Format your output as following this JSON:

{
  pros: [/* insert pros here as strings */],
  cons: [/* insert cons here as strings */],
  bulletPointsPros: [/* short bullet points built from pros */],
  bulletPointsCons: [/* short bullet points built from cons */]
}

The output MUST be valid JSON. It must NOT contain anything other than the JSON. The output must be able to be
passed to JSON.parse without issues.

Give more importance to pros and cons that relate to the user's values.

The company name must not be included in the input. Use the alias ${alias} instead.
If the alias is the same as the company name, ignore the instruction.
`,
    prompt: `
The input follows this type:

type Review = {
  rating: number; // 0 - 5
  pros: string;
  cons: string;
  role: string; // Role of the person writing the review
};

type Input = {
  average: number;
  categories: {
    category: string;
    rating: number;
  }[];
  reviews: Review[];
  recommendRate: number;
  positiveBusinessOutlookRate: number;
  ceo: {
    name: string;
    approvalRate: number;
  };
};

The average rating and category ratings are a number between 0 and 5, where 5 is best. Recommend rate, positive business outlook rate and CEO approval rate are numbers between 0 and 1, where 1 is best. If any field does not conform to the spec, ignore it.
User's values (starts at --- and ends at ---):

---
${user.topValues.join(", ")}

${user.opinions.join("\n")}
---

User's preferred industries, if any (starts at --- and ends at ---):

---
${user.industries.join(", ")}
---

Input (starts at --- and ends at ---):
---
${JSON.stringify(document).slice(0, 10_000)}
---

Use ${alias} instead of the company name everywhere. If the alias is the same as the company name,
do not change the approach.

If a pro or con is written in first person or clearly talks about someone's experiences, surround it in double
quotes and state what role the person writing the comment has, if they have one.
Feel free to modify the text so that it is grammatically correct without changing its meaning.
The only exception to this is the alias.
If text is very informal, surround it in double quotes.

If you mention a rating, also the maximum value (i.e. "4.5 out of 5.0" instead of just "4.5")

Remember: give your output as plain JSON.
        `,
  });
}
