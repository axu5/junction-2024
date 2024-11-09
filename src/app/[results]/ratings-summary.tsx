"use client";

import { CompanyDocument } from "@/app/[results]/page";
import { useEffect, useState } from "react";
import { readChatStream } from "@/app/chat-client";

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
  }, [document, values, isStreaming]);

  return <p>{ chatResponse }</p>
}