import Link from "next/link";

export default function Pitchdeck() {
  const url =
    "https://www.canva.com/design/DAGWAzuLWxU/tQlU0mIJUNekvs8hbfiNiw/edit?utm_content=DAGWAzuLWxU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton";
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${url}`} />
      <div className="flex h-[50vh] w-full items-center justify-center text-2xl">
        <Link href={url}>
          If your browser doesn&apos;t redirect you automatically,{" "}
          <span className="underline">click here</span>
        </Link>
      </div>
    </>
  );
}
