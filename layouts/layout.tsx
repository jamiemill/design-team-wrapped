import { ReactNode } from "react";
import HeadTag from "../components/headtag";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <HeadTag />
            <main className='text-neutral-700 px-4'>
                {children}
                <div className='mt-8 px-4 py-8 text-neutral-400 text-center text-xs border-t'>
                    <p className="mb-2">This is an experiment by <Link className='underline' href="https://twitter.com/jamiemill">@jamiemill</Link>. There might be bugs. <Link href="https://github.com/jamiemill/design-team-wrapped" className="underline">Get the code on GitHub</Link>.</p>
                    <p>P.S. I'm looking for design leadership work in early-stage companies. <Link href="https://jamiemill.com" className='underline'>Hire me!</Link> ♥️</p>
                </div>
            </main>
        </>
    )
}