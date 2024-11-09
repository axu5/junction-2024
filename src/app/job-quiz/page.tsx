import { QuizComponent } from "./components";
import { questions } from "./types";

export default async function JobQuiz() {
  const questionKeys = Object.keys(questions);
  const randQ = (Math.random() * questionKeys.length) | 0;

  return (
    <div className="flex h-[100%] flex-col items-center justify-center gap-y-5 py-5">
      <h1 className="font-staatliches text-5xl text-foreground">Job quiz!</h1>
      <h2 className="text-2xl">Section 1: This or that</h2>
      <QuizComponent questions={questions} questionKey={questionKeys[randQ]} />
    </div>
  );
}
