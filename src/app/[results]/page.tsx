import { client } from "@/db";
import { notFound } from "next/navigation";
import { categories, Categories } from "../job-quiz/page";

type ResultsParams = {
  params: Promise<{ results: string }>;
};

type CompanyDocument = {
  name: string;
  ratings: { category: Categories; rating: number }[];
  positiveBusinessOutlookRate: number;
  ceo: { approval: number };
  recommendRate: number;
  rating: number;
};

export default async function Results({ params }: ResultsParams) {
  try {
    const { results } = await params;
    const personalityValuesArray = JSON.parse(
      atob(decodeURIComponent(results)),
    );
    if (categories.length != personalityValuesArray.length) {
      throw undefined;
    }
    // personal work value -> score
    const personalityValues = Object.fromEntries(
      categories.map((x, i) => [x, personalityValuesArray[i]]),
    ) as Record<Categories, number>;
    const dbClient = await client.connect();
    const database = dbClient.db("companies");
    const collection = database.collection("companies");
    const cursor = collection.find({});
    const allDocuments =
      (await cursor.toArray()) as unknown as CompanyDocument[];
    await client.close();
    const calculateRating = (doc: CompanyDocument) => {
      const rating =
        doc.ratings.reduce(
          (acc: number, _rating: { category: Categories; rating: number }) => {
            const { category, rating } = _rating;
            if (!(category in personalityValues)) {
              return acc;
            }
            return acc + personalityValues[category] * rating;
          },
          0,
        ) +
        doc.positiveBusinessOutlookRate *
          personalityValues[
            "% of people that have a positive business outlook"
          ] +
        doc.ceo.approval * personalityValues["% that approve of CEO"] +
        doc.recommendRate *
          personalityValues["% that would recommend to a friend"] +
        doc.rating;
      return rating;
    };
    const sortedPreferences = allDocuments.sort((docA, docB) => {
      return calculateRating(docB) - calculateRating(docA);
    });
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
