"use client";

import { useEffect, useState } from "react";
import { Categories, Questions } from "./page";
import { useRouter } from "next/navigation";

type QuizComponetProps = {
  questions: Questions;
  qIdx: number;
};

const MIN_ANSWERS = 10;

export function QuizComponent({
  questions: _questions,
  qIdx,
}: QuizComponetProps) {
  const [counter, setCounter] = useState(0);
  const [questions, setQuestions] = useState(Object.values(_questions));
  const [questionIdx, setQuestionIdx] = useState(qIdx);
  const question = questions[questionIdx];
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
      setCounter((c) => c + 1);
      setQuestions((qs) => {
        qs[questionIdx] = qs[qs.length - 1];
        qs.pop();
        return qs;
      });
      setQuestionIdx((Math.random() * (questions.length - 2)) | 0);
    };
  };

  useEffect(() => {
    if (counter >= MIN_ANSWERS) {
      setIsLoading(true);
      router.push(`/${btoa(JSON.stringify(Object.values(tally)))}`);
    }
  }, [router, counter, tally]);

  if (isLoading) {
    return (
      <div className="h-[80%] w-full justify-around italic">
        Preparing results...
      </div>
    );
  }

  return (
    <>
      <span className="text-highlight">
        {counter + 1}/{MIN_ANSWERS}
      </span>
      <div className="grid h-[80%] w-full grid-cols-2 justify-around gap-x-5">
        <div
          onClick={handleClick(-1)}
          key={question.a}
          className="flex h-full w-full cursor-pointer flex-col justify-center rounded-lg border border-black bg-highlight p-10 text-center font-staatliches text-xl text-white motion-scale-in-[0.5] motion-translate-x-in-[25%] motion-translate-y-in-[25%] motion-rotate-in-[10deg] motion-blur-in-[5px] motion-opacity-in-[0%] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate hover:shadow-xl"
        >
          {question.a}
        </div>
        <div
          onClick={handleClick(1)}
          key={question.b}
          className="flex h-full w-full cursor-pointer flex-col justify-center rounded-lg border border-black bg-highlight p-10 text-center font-staatliches text-xl text-white motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-opacity-in-[0%] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate hover:shadow-xl"
        >
          {question.b}
        </div>
      </div>
    </>
  );
}
