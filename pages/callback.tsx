import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Logo from '../components/logo';
import Link from 'next/link';
import Image from "next/image";

export default function Callback() {

    const router = useRouter();
    const [status, setStatus] = useState("Fetching token...");

    useEffect(() => {
        // const { code } = router.query; // not sure why query is empty
        // console.log("router.query", router.query);
        let params = new URLSearchParams(document.location.search); // use this instead
        const code = params.get("code");
        if (!code) throw "Expected a code in the query string";

        const state = params.get("state");
        if (!state) throw "Expected a state in the query string";

        const expectedState = localStorage.getItem("state");
        if (state === expectedState) {
            fetch(`/api/gettoken?code=${code}`).then(res => res.json()).then(({ access_token }) => {
                if (!access_token) throw "No token given back";

                localStorage.setItem("token", access_token);
                setStatus("Token fetched, waiting a little for it to be active...");
                setTimeout(() => router.push("/results"), 3000); // delay to wait for token to be active?
            });
        } else {
            throw "Oauth state did not match.";
        }
    }, [router]);

    return <>
        <div className="my-8 font-bold text-l text-center">
            <Link href="/">
                <Image src="/disclose.svg" alt="" width="14" height="9" className="inline-block rotate-90 mr-1" />
                Go back and try a different team
            </Link>
        </div>
        <Logo />
        <div className='p-24 font-mono text-xs text-center'>{status}</div>
    </>

}
