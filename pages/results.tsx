import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GetUserMeResult, Project, User } from 'figma-api/lib/api-types';
import { useRouter } from 'next/router';
import ApiWraper from '../lib/api_wrapper';

import Presentation from '../components/presentation';
import Avatar from '../components/avatar';
import Logo from '../components/logo';
import Crawler, { Data } from '../lib/crawler';
import Link from 'next/link';

function GetResults() {
    const [data, setData] = useState<Data | null>(null);
    const [user, setUser] = useState<GetUserMeResult | null>(null);
    const [teamID, setTeamID] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");
    const [granularStatus, setGranularStatus] = useState<string>("");
    const [authError, setAuthError] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setAuthError(true);
            return;
        }
        const teamID = localStorage.getItem("teamID");
        if (!teamID) {
            setStatus("No team ID. Please go back and set one.");
            return;
        }
        setTeamID(teamID);

        setStatus("Fetching data.")
        const apiWrapper = new ApiWraper(token);

        const crawler = new Crawler({
            fetcher: apiWrapper, teamID, onStatus: setStatus, onGranularStatus: setGranularStatus
        });

        apiWrapper.getMe().then(me => {
            setUser(me);
            crawler.crawlTeam().then(data => setData(data)).catch(function (e) {
                if (e.response.status === 400 || e.response.status === 404) {
                    crawler.destroy();
                    setStatus(`Got error from Figma API: "${e.response.data.message}". Perhaps you signed in with the wrong Figma account?`);
                } else {
                    setStatus(`Error calling the Figma API. Refresh to try again. Message: ${e.message}`)
                }
            });
        }).catch(function (e) {
            if (e.response.status === 403) {
                setAuthError(true);
            } else {
                setStatus(`Error checking your user profile. Message: ${e.message}`)
            }
        });
        return () => {
            crawler.destroy();
        }
    }, []);

    const router = useRouter();

    function handleSignOut() {
        localStorage.removeItem("teamID");
        localStorage.removeItem("token");
        localStorage.removeItem("teamIDInputString");
        router.push("/");
    }

    return <div>
        <div className="flex gap-2 justify-between mb-8 p-2 text-neutral-500 text-xs border-b">
            {user && <Avatar user={user} handleSignOut={handleSignOut} />}
            <div>Team # {teamID}</div>
        </div>

        <div className="my-8 font-bold text-l text-center">
            <Link href="/">
                <Image src="/disclose.svg" alt="" width="14" height="9" className="inline-block rotate-90 mr-1" />
                Go back and try a different team
            </Link>
        </div>
        <Logo />
        {authError ? <div className='font-mono text-xs mx-auto text-left max-w-[600px] text-rose-600'>You were signed out. Please <Link href="/" className='underline'>go back and re-connect Figma.</Link></div> :
            data ?
                <Presentation data={data} /> :
                <><div className='font-mono text-xs mx-auto text-left max-w-[600px]'>{status}</div>
                    <div className='font-mono text-xs mx-auto text-left max-w-[600px]'>{granularStatus}</div>
                </>
        }

    </div>;
}


export default function Results() {
    const [inBrowser, setInBrowser] = useState(false);
    useEffect(() => setInBrowser(typeof window !== "undefined"), []);
    return (
        <>
            {inBrowser ? <GetResults /> : null}
        </>
    )
}
