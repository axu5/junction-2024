import openai from "@/app/ai";
import { NextResponse } from "next/server";

type ChatOptions = {
  system: string;
  prompt: string;
}

export async function chat(options: ChatOptions) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      {
        role: "system",
        content: options.system
      },
      {
        role: "user",
        content: options.prompt
      }
    ]
  });

  return new NextResponse(completion.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}

export async function json(options: ChatOptions) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: "system",
        content: options.system
      },
      {
        role: "user",
        content: options.prompt
      }
    ]
  });

  return new NextResponse(completion.choices[0].message.content ?? "{}", {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
