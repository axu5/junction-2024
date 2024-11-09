"use client";

import { CompanyDocument } from "@/app/[results]/page";
import { useEffect, useState } from "react";

interface Props {
  document: CompanyDocument,
  values: string[]
}

export default function RatingsSummary(props: Props) {
  const { document, values } = props;
  const [chatResponse, setChatResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const pain = async () => {
      let res: Response;

      try {
        res = await fetch('/api/ratings-summary', {
          method: "POST",
          body: JSON.stringify({ document, values }),
          signal: controller.signal
        });
      } catch (e) {
        if (e instanceof Error) {
          if (e.name !== 'AbortError') {
            setChatResponse(e.message);
          }
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const result = await reader.read();

        const text = decoder.decode(result.value);

        const subchunks = text.split(/\r?\n/g).filter(x => !!x);

        for (const subchunk of subchunks) {
          const json = JSON.parse(subchunk);
          const realText = json.choices[0]?.delta?.content || "";

          setChatResponse((t) => t + realText);
        }

        done = result.done;
      }

      setIsStreaming(false);
    };

    if (typeof window === "undefined" || !isStreaming) {
      return;
    }

    void pain();

    return () => {
      controller.abort("Effect destroyed");
    };
  }, [document, values, isStreaming]);

  return <p>{ chatResponse }</p>
}