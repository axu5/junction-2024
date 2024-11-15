"use client";

import { CompanyDocument } from "@/app/[results]/types";
import { useEffect, useState } from "react";
import { BulletPoints } from "@/app/[results]/company-summary";
import { Placeholder } from "@/app/placeholder";
import { UserProfile } from "@/app/user-profile";

type Content = {
  pros: string[];
  cons: string[];
};

interface Props {
  alias: string;
  document: CompanyDocument;
  user: UserProfile;
  bulletPointsCallback: (bulletPoints: BulletPoints) => void;
}

export default function ProsConsSummary(props: Props) {
  const { alias, document, user, bulletPointsCallback } = props;
  const [content, setContent] = useState<Content | string | undefined>(
    undefined,
  );
  const [generatedWithAlias, setGeneratedWithAlias] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const pain = async () => {
      let res: Response;

      try {
        res = await fetch("/api/pros-cons-summary", {
          method: "POST",
          body: JSON.stringify({ alias, document, user }),
          signal: controller.signal,
        });
      } catch (e) {
        if (e instanceof Error) {
          if (e.name !== "AbortError") {
            setContent(e.message);
          }
        }
        return;
      }

      if (res.body === null) {
        setContent("Invalid response");
        return;
      }

      let result;

      try {
        result = await res.json();
      } catch (e) {
        if (e instanceof Error) {
          setContent(e.message);
        } else {
          setContent("Invalid response");
        }
        return;
      }

      setContent(result);
      setGeneratedWithAlias(alias);

      bulletPointsCallback({
        pros: result.bulletPointsPros,
        cons: result.bulletPointsCons,
      });
    };

    let shouldRegenerate = content === undefined;

    if (
      typeof generatedWithAlias === "string" &&
      alias !== generatedWithAlias
    ) {
      shouldRegenerate = true;
      setContent(undefined);
    }

    if (typeof window === "undefined" || !shouldRegenerate) {
      return;
    }

    void pain();

    return () => {
      controller.abort("Effect destroyed");
    };
  }, [
    document,
    user,
    alias,
    content,
    generatedWithAlias,
    bulletPointsCallback,
  ]);

  if (content === undefined) {
    return <Placeholder></Placeholder>;
  }

  if (typeof content === "string") {
    return <p className="text-foreground">{content}</p>;
  }

  return (
    <section className="flex flex-col gap-10 p-4 xl:flex-row">
      <div className="mb-4 xl:w-1/2">
        <h2 className="text-xl font-semibold">Pros</h2>
        <ul className="list-decimal">
          {content.pros.map((pro) => (
            <li key={pro}>{pro}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4 xl:w-1/2">
        <h2 className="text-xl font-semibold">Cons</h2>
        <ul className="list-decimal">
          {content.cons.map((con) => (
            <li key={con}>{con}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
