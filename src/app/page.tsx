import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className='text-5xl'>
        Discover roles that just feel right.
      </h1>
      <span>(In less than 5 minutes)</span>
      <h2 className='text-3xl'>Hustle Hive</h2>
      <Link
        className='p-3 rounded-full bg-purple-700 text-white flex flex-row text-center justify-center'
        href='/job-quiz'>
        Get Started <ArrowRight />
      </Link>
    </>
  );
}
