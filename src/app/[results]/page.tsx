import { client } from "@/db";
import { notFound } from "next/navigation";
import { Categories } from "../job-quiz/page";

type ResultsParams = {
  params: Promise<{ results: string }>;
};

export default async function Results({ params }: ResultsParams) {
  try {
    const tmp = [
      "% of people that have a positive business outlook",
      "% that approve of CEO",
      "% that would recommend to a friend",
      "Career opportunities",
      "Compensation and benefits",
      "Culture & values",
      "Diversity & Inclusion",
      "Overall Stars",
      "Senior management",
      "Work/Life balance",
    ] satisfies Categories[];
    const { results } = await params;
    const shi = JSON.parse(atob(decodeURIComponent(results)));
    if (tmp.length != shi.length) {
      throw undefined;
    }
    const tmp2 = Object.fromEntries(tmp.map((x, i) => [x, shi[i]])) as Record<
      Categories,
      number
    >;
    const dbClient = await client.connect();
    const database = dbClient.db("companies");
    const collection = database.collection("companies");
    const cursor = collection.find({});
    type Doc = {
      name: string;
      ratings: { category: Categories; rating: number }[];
      positiveBusinessOutlookRate: number;
      ceo: { approval: number };
      recommendRate: number;
      rating: number;
    };
    const allDocuments = (await cursor.toArray()) as unknown as Doc[];
    const calculateRating = (doc: Doc) => {
      const rating =
        doc.ratings.reduce(
          (acc: number, _rating: { category: Categories; rating: number }) => {
            const { category, rating } = _rating;
            if (!(category in tmp2)) {
              return acc;
            }
            return acc + tmp2[category] * rating;
          },
          0,
        ) +
        doc.positiveBusinessOutlookRate *
          tmp2["% of people that have a positive business outlook"] +
        doc.ceo.approval * tmp2["% that approve of CEO"] +
        doc.recommendRate * tmp2["% that would recommend to a friend"] +
        doc.rating;
      return rating;
    };
    const sortedPreferences = allDocuments.sort((docA, docB) => {
      return calculateRating(docB) - calculateRating(docA);
    });

    await client.close();
    return (
      <>
        {sortedPreferences.map((preference) => {
          return (
            <div key={preference.name}>
              <span>
                {(calculateRating(preference) * 100) | 0} {preference.name}
              </span>
            </div>
          );
        })}
      </>
    );
  } catch {
    notFound();
  }
}
