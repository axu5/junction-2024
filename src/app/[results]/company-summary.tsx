"use client";

import RatingsSummary from "@/app/[results]/ratings-summary";
import ProsConsSummary from "@/app/[results]/pros-cons-summary";
import { CompanyDocument } from "@/app/[results]/page";
import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDownIcon } from "lucide-react";

interface Props {
  doc: CompanyDocument;
  alias: string;
  topValues: string[];
  opinions: string[];
  match: string;
}

export default function CompanySummary(props: Props) {
  const { doc, alias, topValues, opinions, match } = props;
  const [currentAlias, setCurrentAlias] = useState(alias);
  const [revealed, setRevealed] = useState(false);

  const onRevealCompany = () => {
    setCurrentAlias(doc.name);
    setRevealed(true);
  };

  return (
    <div className="pb-8">
      <div className="bg-secondary-backdrop sticky top-4 z-10 flex flex-row items-center justify-between rounded-xl backdrop-blur-sm">
        <h1 className="px-5 py-8 font-staatliches text-3xl font-semibold text-foreground xl:text-5xl">
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
      <div className="flex flex-col gap-x-8">
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDownIcon />}>
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
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDownIcon />}>
            Pros & Cons for you
          </AccordionSummary>
          <AccordionDetails>
            <ProsConsSummary
              document={doc}
              alias={currentAlias}
              values={topValues}
              opinions={opinions}
            ></ProsConsSummary>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
