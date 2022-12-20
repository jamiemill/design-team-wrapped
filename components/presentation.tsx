import Image from "next/image";
import { User, Comment } from "figma-api/lib/api-types";
import { ReactNode, useState } from "react";
import { Data } from "../lib/crawler";
import Link from "next/link";
import BackLink from "./back_link";
import { maxBy, uniqBy } from "remeda";

function Avatar({ user, size = 20 }: { user: User, size: number }) {
    return <Image src={user.img_url} width={size} height={size} alt={`Avatar of ${user.handle}`} className="rounded-full inline-block" />
}

function Section({ children, title, subtitle }: { children: ReactNode, title: string, subtitle: string }) {
    return <div className="flex gap-4 my-16">
        <div className="w-1/3">
            <h2 className="text-2xl uppercase font-display font-black">{title}</h2>
            <p>{subtitle}</p>
        </div>
        <div className="w-2/3">
            <div className="flex flex-col gap-5">
                {children}
            </div>
        </div>
    </div>
}

function Disclose({ children }: { children: ReactNode }) {
    const [hidden, setHidden] = useState<boolean>(true);

    function toggle() {
        setHidden(!hidden);
    }

    return <div>
        <div onClick={toggle} className={"cursor-pointer mb-4 font-black " + (hidden ? "" : "opacity-30")}>See all <Image src="/disclose.svg" alt="" width="14" height="9" className={"inline-block transition-all " + (hidden ? "" : "rotate-180")} /></div>
        <div className={"overflow-hidden transition-all " + (hidden ? "max-h-0" : "max-h-full")}>
            {children}
        </div>
    </div >
}

function ResultRow({ i, stat, name, small, lead, user }: { i: number, stat: string, name: string, small?: boolean, lead?: boolean, user?: User }) {
    return <div className="mb-2">
        <div className="flex gap-4">
            <div className={`${lead ? `text-4xl` : small ? `text-base` : `text-xl`} font-display font-black text-neutral-300 -rotate-6 w-10 text-right`}>#{i + 1}</div>
            {user &&
                <div className="w-18">
                    {user && <Avatar user={user} size={lead ? 70 : 40} />}
                </div>
            }
            <div>
                <div className={`${lead ? `text-2xl` : small ? `text-base` : `text-xl`} font-black tracking-tighter`}>{stat}</div>
                <div className={`${lead ? `text-5xl` : small ? `text-base` : `text-3xl`} font-black tracking-tight font-display`}>{name}</div>
            </div>
        </div>
    </div>;
}

function BigStat({ prefix, value, suffix }: { prefix: string, value: string | number, suffix: string }) {
    return <div>
        <div>{prefix}</div>
        <div className="text-8xl tracking-tighter">{value}</div>
        <div className="text-right">{suffix}</div>
    </div>
}


export default function Presentation({ data }: { data: Data }) {
    const projectsByFileCount = Object.values(data.projects).slice(0).sort((a, b) => b.filesModifiedThisYear - a.filesModifiedThisYear);
    const projectsByCommentCount = Object.values(data.projects).slice(0).sort((a, b) => b.commentsThisYear - a.commentsThisYear);
    const commentLeaderBoard = Object.values(data.users).slice(0).sort((a, b) => b.commentsThisYear - a.commentsThisYear);
    const longestThread = maxBy(Object.values(data.commentThreads), (thread) => thread.length);

    return <div className="flex flex-col gap-10 items-center">
        <h2 className="text-2xl font-display font-black pt-10 -skew-y-2 uppercase">This year your team...</h2>

        <div className="bg-neutral-800 text-neutral-200 font-display w-full p-10 -skew-y-2">
            <div className="flex gap-24 justify-center text-xl uppercase font-black">
                {/* TODO: get rid of these empty string things */}
                <BigStat prefix="Modified" value={data.stats.filesModifiedThisYearCount || ""} suffix="files" />
                <BigStat prefix="Left" value={data.stats.commentsLeftThisYearCount || ""} suffix="comments" />
            </div>
        </div>

        <Section title="Most files" subtitle="Which projects had the most modified files?">
            {projectsByFileCount.slice(0, 3).map((project, i) => {
                return <ResultRow key={i} i={i} lead={i === 0} stat={project.filesModifiedThisYear + " files modified"} name={project.project.name} />
            })}
            {projectsByFileCount.length > 3 && <>
                <Disclose>
                    {projectsByFileCount.slice(3).map((project, i) => {
                        return <ResultRow key={i} i={i + 3} small stat={project.filesModifiedThisYear + " files modified"} name={project.project.name} />
                    })}
                </Disclose>
            </>}
        </Section>

        <Section title="Most comments" subtitle="Where was the chat happening?">
            {projectsByCommentCount.slice(0, 3).map((project, i) => {
                return <ResultRow key={i} i={i} lead={i === 0} stat={project.commentsThisYear + " comments"} name={project.project.name} />
            })}
            {projectsByCommentCount.length > 3 && <>
                <Disclose>
                    {projectsByFileCount.slice(3).map((project, i) => {
                        return <ResultRow key={i} i={i + 3} small stat={project.commentsThisYear + " comments"} name={project.project.name} />
                    })}
                </Disclose>
            </>}
        </Section>

        <Section title="Commenters" subtitle="Who was the chattiest?">
            {commentLeaderBoard.slice(0, 3).map((user, i) => {
                return <ResultRow key={i} i={i} lead={i === 0} stat={user.commentsThisYear + " comments"} name={user.user.handle} user={user.user} />
            })}
            {commentLeaderBoard.length > 3 && <>
                <Disclose>
                    {commentLeaderBoard.slice(3).map((user, i) => {
                        return <ResultRow key={i} i={i + 3} small stat={user.commentsThisYear + " comments"} name={user.user.handle} user={user.user} />
                    })}
                </Disclose>
            </>}
        </Section>

        {longestThread &&
            <Section title="Longest thread" subtitle="What really got you talking?">
                <div className="font-black text-xl">{longestThread.length - 1} replies</div>
                <RenderComment comment={longestThread[0]} />
                <div>{uniqBy(longestThread.slice(1), (c) => c.user.handle).map(c => <Avatar user={c.user} size={30} />)}</div>
                <div>on file: <span className="font-black">{data.files[longestThread[0].file_key].file.name}</span></div>
                <div><Image src={data.files[longestThread[0].file_key].file.thumbnail_url} alt="Thumbnail of the file" width={200} height={120} /></div>
            </Section>
        }

        <BackLink />
    </div>
}


function RenderComment({ comment }: { comment: Comment }) {
    return <div className="p-4 border-2 border-neutral-200 rounded-tl-xl rounded-tr-xl rounded-br-xl flex gap-2">
        <div>
            <Avatar user={comment.user} size={40} />
        </div>
        <div>
            <div><span className="font-bold">{comment.user.handle}</span> on {new Date(comment.created_at).toLocaleDateString()}</div>
            <div>{comment.message}</div>
        </div>

    </div>
}