"use client";

import RatingsSummary from "@/app/[results]/ratings-summary";
import ProsConsSummary from "@/app/[results]/pros-cons-summary";
import { CompanyDocument } from "@/app/[results]/page";
import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDownIcon } from "lucide-react";
import { Benefit } from "@/app/benefits";
import { Frustration } from "@/app/frustration";

interface Props {
  doc: CompanyDocument;
  alias: string;
  topValues: string[];
  opinions: string[];
  match: string;
}

export type BulletPoints = {
  pros: string[];
  cons: string[];
};

function BulletPoints(props: { bulletPoints: BulletPoints }) {
  const { bulletPoints } = props;

  return (
    <div className="flex flex-col xl:flex-row xl:gap-12">
      <div className="xl:w-1/2">
        {bulletPoints.pros.map((pro) => {
          return (
            <Benefit
              key={pro}
              name={pro}
              className="text-m mb-2 mt-2"
            ></Benefit>
          );
        })}
      </div>
      <div className="xl:w-1/2">
        {bulletPoints.cons.map((con) => {
          return (
            <Frustration
              key={con}
              name={con}
              className="text-m mb-2 mt-2"
            ></Frustration>
          );
        })}
      </div>
    </div>
  );
}

export default function CompanySummary(props: Props) {
  const { doc, alias, topValues, opinions, match } = props;
  const [currentAlias, setCurrentAlias] = useState(alias);
  const [bulletPoints, setBulletPoints] = useState<BulletPoints | undefined>(
    undefined,
  );
  const [revealed, setRevealed] = useState(false);

  const onBulletPointsCreated = (bulletPoints: BulletPoints) => {
    setBulletPoints(bulletPoints);
  };

  const onRevealCompany = () => {
    setCurrentAlias(doc.name);
    setRevealed(true);
  };

  return (
    <div className="pb-8">
      <div className="bg-secondary-backdrop flex flex-row items-center justify-between rounded-xl backdrop-blur-sm">
        <h1 className="font-staatliches px-5 py-8 text-3xl font-semibold text-foreground xl:text-5xl">
          {currentAlias}
        </h1>
        <p>{match} match</p>
        <button
          onClick={onRevealCompany}
          className="m-4 cursor-pointer justify-center rounded-lg border border-white p-3 text-center text-foreground"
          disabled={revealed}
        >
          {revealed ? "Revealed" : "Reveal company"}
        </button>
      </div>
      {bulletPoints === undefined ? undefined : (
        <BulletPoints bulletPoints={bulletPoints}></BulletPoints>
      )}
      <div className="flex flex-col gap-x-8">
        <Accordion sx={{ background: "var(--background)" }}>
          <AccordionSummary
            expandIcon={<ArrowDownIcon />}
            className="font-semibold"
          >
            Summary
          </AccordionSummary>
          <AccordionDetails>
            <RatingsSummary
              document={doc}
              alias={currentAlias}
              values={topValues}
              opinions={opinions}
            ></RatingsSummary>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ background: "var(--background)" }}>
          <AccordionSummary
            expandIcon={<ArrowDownIcon />}
            className="font-semibold"
          >
            Pros & Cons for you
          </AccordionSummary>
          <AccordionDetails>
            <ProsConsSummary
              document={doc}
              alias={currentAlias}
              values={topValues}
              opinions={opinions}
              bulletPointsCallback={onBulletPointsCreated}
            ></ProsConsSummary>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
