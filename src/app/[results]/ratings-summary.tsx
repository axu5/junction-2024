"use client";

import { CompanyDocument } from "@/app/[results]/page";
import { useEffect, useState } from "react";
import { readChatStream } from "@/app/chat-client";

interface Props {
  alias: string;
  document: CompanyDocument;
  values: string[];
  opinions: string[];
}

export default function RatingsSummary(props: Props) {
  const { alias, document, values, opinions } = props;
  const [chatResponse, setChatResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [generatedWithAlias, setGeneratedWithAlias] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const pain = async () => {
      let res: Response;

      try {
        res = await fetch('/api/ratings-summary', {
          method: "POST",
          body: JSON.stringify({ alias, document, values, opinions }),
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

      if (res.body === null) {
        setIsStreaming(false);
        setChatResponse("Invalid response");
        return;
      }

      await readChatStream(res, (chunk) => {
        setChatResponse((t) => t + chunk);
      });

      setIsStreaming(false);
      setGeneratedWithAlias(alias);
    };

    let shouldRegenerate = isStreaming;

    if (typeof generatedWithAlias === 'string' && alias !== generatedWithAlias) {
      shouldRegenerate = true;
      setIsStreaming(true);
      setChatResponse("");
    }

    if (typeof window === "undefined" || !shouldRegenerate) {
      return;
    }

    void pain();

    return () => {
      controller.abort("Effect destroyed");
    };
  }, [document, values, alias, isStreaming, generatedWithAlias]);

  if (chatResponse.length === 0) {
    return <p className="italic text-white">Thinking...</p>
  }

  return <p>{ chatResponse }{ isStreaming ? "..." : null }</p>
}