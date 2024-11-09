import { client } from "@/db";
import { notFound } from "next/navigation";
import { categories, Categories } from "../job-quiz/page";
import RatingsSummary from "@/app/[results]/ratings-summary";
import { WithId } from "mongodb";

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
      (await cursor.toArray()) as unknown as CompanyDocument[];
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

    const topDocuments = await Promise.all(sortedPreferences.slice(0, 3).map((doc) => {
      return collection.findOne<CompanyDocument>(
        { _id: (doc as unknown as WithId<CompanyDocument>)._id },
        { projection: { _id: 0, ratingsEmbedding: 0, reviewsEmbedding: 0, descriptionEmbedding: 0 } }
      )
    }));

    await client.close();

    return (
      <>
        {topDocuments.filter((doc) => !!doc).map((doc) => {
          return <RatingsSummary key={doc.name} document={doc} values={topValues}></RatingsSummary>;
        })}
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
  } catch (e) {
    console.error(e);
    notFound();
  }
}
