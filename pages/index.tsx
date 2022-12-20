import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Image from "next/image";
import Logo from "../components/logo";
import Link from "next/link";

function parseTeamIDFromURL(url: string) {
  const matches = url.trim().match(/^https:\/\/www\.figma\.com\/files\/team\/([\d]+)$/);
  if (!matches) return null;
  return matches[1];
}

function submit(teamIDInputString: string) {
  const teamID = parseTeamIDFromURL(teamIDInputString);
  if (!teamID) throw "Expected teamID to be valid";
  localStorage.setItem("teamID", teamID);
  localStorage.setItem("teamIDInputString", teamIDInputString);
  const state = nanoid();
  localStorage.setItem("state", state);

  if (!process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || !process.env.NEXT_PUBLIC_OAUTH_CALLBACK) throw "Missing environment variables.";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK,
    scope: "file_read",
    state,
    response_type: "code"
  });
  window.location.href = `https://www.figma.com/oauth?${params.toString()}`;;
}

export default function Index() {

  const [teamIDInputString, setTeamIDInputString] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [inputIsValid, setInputIsValid] = useState<boolean>(false);

  useEffect(() => {
    const teamFromLocalStorage = localStorage.getItem("teamIDInputString");
    if (teamFromLocalStorage) {
      setTeamIDInputString(teamFromLocalStorage);
      handleTeamURLChange(teamFromLocalStorage);
    };
  }, []);

  function handleTeamURLChange(val: string) {
    setTeamIDInputString(val);
    if (!parseTeamIDFromURL(val)) {
      setInputError("Please paste a valid team link. See where to find it below.");
      setInputIsValid(false);
    } else {
      setInputError(null);
      setInputIsValid(true);
    }
  }
  return (
    <>
      <Logo />
      <div className='flex justify-center my-8'>
        <div className='max-w-xl'>
          <p className='mb-4 text-2xl font-black font-display'>What did your team get up to in Figma this year?</p>
          <p className='mb-4'>Paste in the link of your team (not your org or a project), and we&apos;ll count up the files and comments and show you where the action was.</p>
        </div>
      </div>
      <div className='flex justify-center my-8'>
        <div className="max-w-xl w-full flex gap-2 justify-center items-start">
          <div className="w-full">
            <input placeholder="Paste team link here" className="w-full border-2 border-slate-200 rounded-sm p-2" type="text" value={teamIDInputString} onChange={(e) => handleTeamURLChange(e.target.value)} />
            {inputError && <div className="text-rose-600 p-2 text-xs">{inputError}</div>}
          </div>
          <button className="bg-violet-500 border-2 border-violet-500 text-white py-2 px-4 whitespace-nowrap rounded-sm disabled:opacity-30 active:bg-violet-800 active:border-violet-800 active:translate-y-1" disabled={!inputIsValid} onClick={() => inputIsValid && submit(teamIDInputString)}>Connect to Figma</button>
        </div>
      </div>


      <div className='flex justify-center my-8'>
        <div className='max-w-xl'>
          <h2 className='font-bold mb-2 mt-12'>Where to find the team link</h2>
          <p className='mb-4'>Ctrl-click or right-click on the team name in the file browser of Figma and choose &quot;Copy link&quot;. Be sure not to click on an organisation or project. This only works with teams.</p>
          <p className='mb-4'>It should look something like &quot;https://www.figma.com/files/team/123456790&quot;.</p>
          <p className='mb-4 flex justify-center'><Image src="/how-to-get-team-link.png" width={502 / 2} height={302 / 2} alt="Screenshot of how to right-click on a team in Figma and copy the link." /></p>

          <h2 className='font-bold mb-2 mt-12'>Security and privacy</h2>
          <p className='mb-4'>We&apos;ll ask you to authorize access to your account, but all data will be requested and processed by your browser — not sent to our servers. We don&apos;t store the access token, but for peace of mind just revoke access in Figma&apos;s Settings &gt; Connected Apps once you&apos;re done.</p>
          <p className='mb-4'>You can see the <Link href="https://github.com/jamiemill/design-team-wrapped" className='underline'>source on GitHub</Link>, and even run it locally if you prefer.</p>

        </div>
      </div>
    </>
  )
}
