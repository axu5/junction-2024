import { client } from "@/db";
import { notFound } from "next/navigation";
import { categories, Categories } from "../job-quiz/page";
import { WithId } from "mongodb";
import CompanySummary from "@/app/[results]/company-summary";
import Link from "next/link";

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
    const resultsObject = JSON.parse(atob(decodeURIComponent(results)));
    const personalityValuesArray = resultsObject.values;
    const opinions = resultsObject.opinions;
    if (categories.length != personalityValuesArray.length) {
      throw undefined; // bro....
    }
    const min = Math.min(...personalityValuesArray);
    const max = Math.max(...personalityValuesArray);
    // personal work value -> score
    const personalityValues = Object.fromEntries(
      categories.map((x, i) => [
        x,
        (personalityValuesArray[i] - min) / (max - min),
      ]),
    ) as Record<Categories, number>;
    const dbClient = await client.connect();
    const database = dbClient.db("companies");
    const collection = database.collection("companies");
    const cursor = collection.find(
      {},
      {
        projection: {
          ratingsEmbedding: 0,
          reviewsEmbedding: 0,
          descriptionEmbedding: 0,
        },
      },
    );
    const allDocuments =
      (await cursor.toArray()) as unknown as WithId<CompanyDocument>[];
    const calculateRating = (doc: CompanyDocument) => {
      const rating =
        (doc.ratings.reduce(
          (acc: number, _rating: { category: Categories; rating: number }) => {
            const { category, rating } = _rating;
            if (!(category in personalityValues)) {
              return acc;
            }
            return acc + personalityValues[category] * (rating / 5);
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
          doc.rating / 5) /
        (doc.ratings.length + 4);
      return rating;
    };
    const sortedPreferences = allDocuments.sort((docA, docB) => {
      return calculateRating(docB) - calculateRating(docA);
    });
    const sortedValues = Object.entries(personalityValues)
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .map((value) => value[0]);
    const topValues = sortedValues.slice(0, 3);

    const topDocuments: CompanyDocument[] = sortedPreferences
      .slice(0, 4)
      .map((obj) => {
        return { ...obj, _id: undefined };
      });

    await client.close();

    return (
      <section className="mb-8">
        <h1 className="font-staatliches mb-6 mt-6 text-4xl font-bold text-foreground">
          Top results
        </h1>
        {topDocuments
          .filter((doc) => !!doc)
          .map((doc, i) => {
            return (
              <CompanySummary
                key={doc.name}
                doc={doc}
                alias={`Company ${ALPHABET[i]}`}
                topValues={topValues}
                opinions={opinions}
                match={((calculateRating(doc) * 10000) | 0) / 100 + "%"}
              ></CompanySummary>
            );
          })}
        <Link href={"/job-quiz"}>
          <button className="m-4 cursor-pointer rounded-lg bg-highlight p-3 px-4 text-center font-semibold text-foreground">
            Start over
          </button>
        </Link>
      </section>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
}
