import { ReactNode } from "react";
import HeadTag from "../components/headtag";
import Image from "next/image";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <HeadTag />
            <main className='text-neutral-700'>
                {children}
            </main>
            <div className='mt-8 p-8 text-neutral-400 text-center text-xs border-t'>
                Made by <a className='underline' href="https://twitter.com/jamiemill">@jamiemill</a>. &nbsp;&nbsp;&nbsp; P.S. I'm looking for design leadership work in early-stage companies. <a href="https://jamiemill.com" className='underline'>Hire me!</a> ♥️
            </div>
        </>
    )
}