export async function readChatStream(
  response: Response,
  onChunk: (chunk: string) => void,
) {
  if (response.body === null) {
    console.error("readChatStream was given a response with a body of null!");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let done = false;

  while (!done) {
    const result = await reader.read();

    const text = decoder.decode(result.value);

    const subchunks = text.split(/\r?\n/g).filter((x) => !!x);

    for (const subchunk of subchunks) {
      try {
        const json = JSON.parse(subchunk);
        const realText = json.choices[0]?.delta?.content || "";

        onChunk(realText);
      } catch {
        console.log("Unable to parse as json\n", subchunk)
      }
    }

    done = result.done;
  }
}
