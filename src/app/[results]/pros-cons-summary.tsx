"use client";

import { CompanyDocument } from "@/app/[results]/page";
import { useEffect, useState } from "react";

interface Props {
  document: CompanyDocument,
  values: string[]
}

type Content = {
  pros: string[];
  cons: string[];
}

export default function ProsConsSummary(props: Props) {
  const { document, values } = props;
  const [content, setContent] = useState<Content | string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const pain = async () => {
      let res: Response;

      try {
        res = await fetch('/api/pros-cons-summary', {
          method: "POST",
          body: JSON.stringify({ document, values }),
          signal: controller.signal
        });
      } catch (e) {
        if (e instanceof Error) {
          if (e.name !== 'AbortError') {
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
    };

    if (typeof window === "undefined" || content !== undefined) {
      return;
    }

    void pain();

    return () => {
      controller.abort("Effect destroyed");
    };
  }, [document, values, content]);

  if (content === undefined) {
    return <p>Loading...</p>
  }

  if (typeof content === 'string') {
    return <p>{content}</p>
  }

  return <section>
    <h2 className="font-semibold">Pros</h2>
    <ul className="list-decimal">
      {content.pros.map((pro) => <li key={pro}>{pro}</li>)}
    </ul>
    <h2 className="font-semibold mt-4">Cons</h2>
    <ul className="list-decimal">
      {content.cons.map((con) => <li key={con}>{con}</li>)}
    </ul>
  </section>
}