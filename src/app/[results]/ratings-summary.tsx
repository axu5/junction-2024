"use client";

import { CompanyDocument } from "@/app/[results]/page";
import { useEffect, useState } from "react";
import { readChatStream } from "@/app/chat-client";

interface Props {
  alias: string,
  document: CompanyDocument,
  values: string[]
}

export default function RatingsSummary(props: Props) {
  const { alias, document, values } = props;
  const [chatResponse, setChatResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const pain = async () => {
      let res: Response;

      try {
        res = await fetch('/api/ratings-summary', {
          method: "POST",
          body: JSON.stringify({ alias, document, values }),
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
    };

    if (typeof window === "undefined" || !isStreaming) {
      return;
    }

    void pain();

    return () => {
      controller.abort("Effect destroyed");
    };
  }, [document, values, alias, isStreaming]);

  if (chatResponse.length === 0) {
    return <p className="italic">Thinking...</p>
  }

  return <p>{ chatResponse }{ isStreaming ? "..." : null }</p>
}