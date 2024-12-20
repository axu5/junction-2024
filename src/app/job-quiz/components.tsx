"use client";

import { useEffect, useState } from "react";
import { Categories, Questions } from "./types";
import { useRouter } from "next/navigation";
import { HexagonSharp } from "../hexagon";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";

type QuizComponentProps = {
  questions: Questions;
  questionKey: string;
};

type Stage = "quiz" | "industries";

const MIN_ANSWERS = 10;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const industries = [
  "Business Consulting and Services",
  "Software Development",
  "Computers and Electronics Manufacturing",
  "Telecommunications",
  "IT Services and IT Consulting",
  "Real Estate",
  "Financial Services",
  "Hospitals and Health Care",
  "Appliances, Electrical, and Electronics Manufacturing",
  "Retail",
  "Industrial Machinery Manufacturing",
  "Personal Care Product Manufacturing",
  "Civil Engineering",
  "Computer Games",
  "Marketing Services",
  "Technology, Information and Internet",
  "Information Technology & Services",
  "Wholesale Building Materials",
  "Truck Transportation",
  "Armed Forces",
];

export function QuizComponent({ questions, questionKey }: QuizComponentProps) {
  const [currentQuestionKey, setCurrentQuestionKey] = useState(questionKey);
  const [seenQuestionKeys, setSeenQuestionKeys] = useState<string[]>([
    questionKey,
  ]);
  const [opinions, setOpinions] = useState<string[]>([]);
  const question = questions[currentQuestionKey];
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("quiz");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const router = useRouter();
  const [tally, setTally] = useState<{ [K in Categories]: number }>({
    "% of people that have a positive business outlook": 0,
    "% that approve of CEO": 0,
    "% that would recommend to a friend": 0,
    "Career opportunities": 0,
    "Compensation and benefits": 0,
    "Culture & values": 0,
    "Diversity & Inclusion": 0,
    "Overall Stars": 0,
    "Senior management": 0,
    "Work/Life balance": 0,
  });

  const handleClick = (score: -1 | 1) => {
    return () => {
      setTally((t) => {
        for (const [affectKey, affectMagnitude] of Object.entries(
          question.affects,
        )) {
          if (affectKey && affectMagnitude) {
            // @ts-expect-error hush
            t[affectKey] += affectMagnitude * score;
          }
        }
        return t;
      });

      let opinion: string;

      if (score === -1) {
        opinion = `${question.a} over ${question.b}`;
      } else {
        opinion = `${question.b} over ${question.a}`;
      }

      setOpinions((opinions) => [...opinions, opinion]);

      let newQuestionKey: string | undefined = undefined;

      const keys = Object.keys(questions);

      while (
        newQuestionKey === undefined ||
        seenQuestionKeys.includes(newQuestionKey)
      ) {
        newQuestionKey = keys[(Math.random() * (keys.length - 2)) | 0];
      }

      setSeenQuestionKeys((keys) => [...keys, newQuestionKey]);
      setCurrentQuestionKey(newQuestionKey);
    };
  };

  useEffect(() => {
    if (seenQuestionKeys.length > MIN_ANSWERS && stage === "quiz") {
      setStage("industries");
    }
  }, [seenQuestionKeys, stage]);

  if (isLoading) {
    return (
      <div className="h-[80%] w-full justify-around text-center font-staatliches text-4xl">
        Preparing results...
        <div className="flex h-full flex-col items-center justify-center py-12">
          <div className="grid grid-cols-2 grid-rows-2 gap-x-[2px]">
            <HexagonSharp
              className="motion-preset-blink col-span-2 flex self-center justify-self-center motion-duration-1500"
              fill="var(--highlight)"
              fillOpacity={1}
            />
            <HexagonSharp
              className="motion-preset-blink -translate-y-4 motion-duration-1500 motion-delay-1000"
              fill="var(--highlight)"
              fillOpacity={1}
            />
            <HexagonSharp
              className="motion-preset-blink -translate-y-4 motion-duration-1500 motion-delay-500"
              fill="var(--highlight)"
              fillOpacity={1}
            />
          </div>
        </div>
      </div>
    );
  }

  const onIndustriesConfirmed = () => {
    setIsLoading(true);
    const result = {
      values: Object.values(tally),
      opinions,
      industries: selectedIndustries,
    };
    router.push(`/${btoa(JSON.stringify(result))}`);
  };

  const onIndustriesChange = (
    evt: SelectChangeEvent<typeof selectedIndustries>,
  ) => {
    const {
      target: { value },
    } = evt;
    setSelectedIndustries(typeof value === "string" ? value.split(",") : value);
  };

  if (stage === "industries") {
    return (
      <>
        <h1 className="motion-preset-pop font-staatliches text-3xl font-semibold text-foreground">
          What are your preferred industries?
        </h1>
        <FormControl className="motion-preset-pop w-full xl:w-1/2">
          <InputLabel>Industries</InputLabel>
          <Select
            multiple
            variant="filled"
            input={<OutlinedInput label="Tag" />}
            value={selectedIndustries}
            onChange={onIndustriesChange}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {industries.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={selectedIndustries.includes(name)} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button
          onClick={onIndustriesConfirmed}
          className="m-4 cursor-pointer rounded-lg bg-highlight p-3 px-4 text-center font-semibold text-foreground"
        >
          Confirm
        </button>
      </>
    );
  }

  return (
    <>
      <span className="text-foreground">
        {seenQuestionKeys.length}/{MIN_ANSWERS}
      </span>
      <h1
        key={currentQuestionKey}
        className="motion-preset-pop min-h-[20vh] font-staatliches text-3xl font-semibold text-foreground"
      >
        {currentQuestionKey}
      </h1>
      <div className="grid h-[80%] w-full grid-cols-1 justify-around gap-5 xl:grid-cols-2">
        <div
          onClick={handleClick(-1)}
          key={question.a}
          className="flex h-full min-h-[20vh] w-full cursor-pointer flex-col justify-center rounded-lg border border-black border-highlight bg-secondary-backdrop p-10 text-center motion-scale-in-[0.5] motion-translate-x-in-[25%] motion-translate-y-in-[25%] motion-rotate-in-[10deg] motion-blur-in-[5px] motion-opacity-in-[0%] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate"
        >
          {question.a}
        </div>
        <div
          onClick={handleClick(1)}
          key={question.b}
          className="flex h-full min-h-[20vh] w-full cursor-pointer flex-col justify-center rounded-lg border border-black border-highlight bg-secondary-backdrop p-10 text-center motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-opacity-in-[0%] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate"
        >
          {question.b}
        </div>
      </div>
    </>
  );
}
