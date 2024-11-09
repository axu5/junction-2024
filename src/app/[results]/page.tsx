import { client } from "@/db";
import { notFound } from "next/navigation";
import { categories, Categories } from "../job-quiz/page";
import { WithId } from "mongodb";
import CompanySummary from "@/app/[results]/company-summary";

type ResultsParams = {
  params: Promise<{ results: string }>;
};

export type CompanyDocument = {
  name: string;
  ratings: { category: Categories; rating: number }[];
  positiveBusinessOutlookRate: number;
  ceo: { approval: number };
  recommendRate: number;
  rating: number;
  ratingsEmbedding: number[];
  descriptionEmbedding: number[];
  reviewsEmbedding: number[];
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVXYZ";

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
    const cursor = collection.find({}, { projection: { ratingsEmbedding: 0, reviewsEmbedding: 0, descriptionEmbedding: 0 } });
    const allDocuments =
      (await cursor.toArray()) as unknown as WithId<CompanyDocument>[];
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
    const sortedValues = Object.entries(personalityValues)
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .map(value => value[0]);
    const topValues = sortedValues.slice(0, 3);

    const topDocuments: CompanyDocument[] = sortedPreferences.slice(0, 4).map((obj) => {
      return { ...obj, _id: undefined };
    });

    await client.close();

    return (
        <section className="mb-8">
          <h1 className="font-staatliches text-white font-bold text-4xl mt-6 mb-6">Top results</h1>
          {topDocuments
            .filter((doc) => !!doc)
            .map((doc, i) => {
              return <CompanySummary key={doc.name} doc={doc} alias={`Company ${ALPHABET[i]}`} topValues={topValues}></CompanySummary>
            })}
        </section>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
}
