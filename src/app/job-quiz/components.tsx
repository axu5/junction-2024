"use client";

import { useEffect, useState } from "react";
import { Categories, Questions } from "./page";
import { useRouter } from "next/navigation";

type QuizComponetProps = {
  questions: Questions;
  questionKey: string;
};

const MIN_ANSWERS = 8;

export function QuizComponent({ questions, questionKey }: QuizComponetProps) {
  const [currentQuestionKey, setCurrentQuestionKey] = useState(questionKey);
  const [seenQuestionKeys, setSeenQuestionKeys] = useState<string[]>([
    questionKey,
  ]);
  const [opinions, setOpinions] = useState<string[]>([]);
  const question = questions[currentQuestionKey];
  const [isLoading, setIsLoading] = useState(false);
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
    if (seenQuestionKeys.length > MIN_ANSWERS) {
      setIsLoading(true);
      const result = {
        values: Object.values(tally),
        opinions,
      };
      router.push(`/${btoa(JSON.stringify(result))}`);
    }
  }, [router, seenQuestionKeys, tally]);

  if (isLoading) {
    return (
      <div className="h-[80%] w-full justify-around italic">
        Preparing results...
      </div>
    );
  }

  return (
    <>
      <span className="text-white">
        {seenQuestionKeys.length}/{MIN_ANSWERS}
      </span>
      <h1 className="font-staatliches text-3xl font-semibold text-white">
        {currentQuestionKey}
      </h1>
      <div className="grid h-[80%] w-full grid-cols-2 justify-around gap-x-5">
        <div
          onClick={handleClick(-1)}
          key={question.a}
          className="flex h-full w-full cursor-pointer flex-col justify-center rounded-lg border border-black p-10 text-center motion-scale-in-[0.5] motion-translate-x-in-[25%] motion-translate-y-in-[25%] motion-rotate-in-[10deg] motion-blur-in-[5px] motion-opacity-in-[0%] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate"
        >
          {question.a}
        </div>
        <div
          onClick={handleClick(1)}
          key={question.b}
          className="flex h-full w-full cursor-pointer flex-col justify-center rounded-lg border border-black p-10 text-center motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-opacity-in-[0%] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate"
        >
          {question.b}
        </div>
      </div>
    </>
  );
}
