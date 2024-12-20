"use client";

import { CompanyDocument } from "@/app/[results]/types";
import { useEffect, useState } from "react";
import { readChatStream } from "@/app/chat-client";
import { UserProfile } from "@/app/user-profile";

interface Props {
  alias: string;
  document: CompanyDocument;
  user: UserProfile;
}

export default function RatingsSummary(props: Props) {
  const { alias, document, user } = props;
  const [chatResponse, setChatResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [generatedWithAlias, setGeneratedWithAlias] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const pain = async () => {
      let res: Response;

      try {
        res = await fetch("/api/ratings-summary", {
          method: "POST",
          body: JSON.stringify({ alias, document, user }),
          signal: controller.signal,
        });
      } catch (e) {
        if (e instanceof Error) {
          if (e.name !== "AbortError") {
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

    if (
      typeof generatedWithAlias === "string" &&
      alias !== generatedWithAlias
    ) {
      shouldRegenerate = true;
      setIsStreaming(true);
      setChatResponse("");
    }

    if (typeof window === "undefined" || !shouldRegenerate) {
      return;
    }

    void pain();

    return () => {
      try {
        controller.abort("Effect destroyed");
      } catch (tmp: unknown) {
        const error = tmp as { name: string };
        if (error.name === "AbortError") {
          // aborted gracefully
          return;
        } else {
          throw tmp;
        }
      }
    };
  }, [document, user, alias, isStreaming, generatedWithAlias]);

  if (chatResponse.length === 0) {
    return <p className="italic text-foreground">Thinking...</p>;
  }

  return (
    <p>
      {chatResponse}
      {isStreaming ? "..." : null}
    </p>
  );
}
