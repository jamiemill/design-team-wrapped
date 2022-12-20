import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router'
import Logo from '../components/logo';

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
                setTimeout(() => router.push("/home"), 3000); // delay to wait for token to be active?
            });
        } else {
            throw "Oauth state did not match.";
        }
    }, [router]);

    return <>
        <Logo />
        <div className='p-24 font-mono text-xs text-center'>{status}</div>
    </>

}
