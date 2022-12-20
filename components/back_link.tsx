import Link from "next/link";
import Image from "next/image";

export default function BackLink() {
  return <div className="my-8 text-l font-black">
    <Link href="/">
      <Image src="/disclose.svg" alt="" width="14" height="9" className="inline-block rotate-90 mr-1" />
      Go back and try a different team
    </Link>
  </div>
}