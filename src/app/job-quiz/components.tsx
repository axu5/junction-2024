"use client";

import { useEffect, useState } from "react";
import { Categories, Questions } from "./page";
import { useRouter } from "next/navigation";

type QuizComponetProps = {
  questions: Questions;
  qIdx: number;
};

const MIN_ANSWERS = 3;

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
        qs[qIdx] = qs[qs.length - 1];
        qs.pop();
        return qs;
      });
      setQuestionIdx((Math.random() * (questions.length - 1)) | 0);
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
      <div className="w-full h-[80%] justify-around">
        Preparing results...
      </div>
    )
  }

  return (
    <>
      {counter + 1}/{MIN_ANSWERS}
      <div className="grid h-[80%] w-full grid-cols-2 justify-around gap-x-5">
        <div
          onClick={handleClick(-1)}
          className="motion-scale-in-[0.5] motion-translate-x-in-[25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate flex h-full w-full cursor-pointer flex-col justify-center rounded-lg border border-black p-10 text-center"
        >
          {question.a}
        </div>
        <div
          onClick={handleClick(1)}
          className="motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate flex h-full w-full cursor-pointer flex-col justify-center rounded-lg border border-black p-10 text-center"
        >
          {question.b}
        </div>
      </div>
    </>
  );
}
