import { GetUserMeResult } from "figma-api/lib/api-types";
import Image from "next/image";
import { MouseEventHandler } from "react";

export default function Avatar({ user, handleSignOut }: { user: GetUserMeResult, handleSignOut: MouseEventHandler }) {
    const imgSize = 28;
    return <div className='flex gap-2 items-center'>
        <Image alt="User profile image" src={user.img_url} width={imgSize} height={imgSize} className="rounded-full" />
        <div className='flex flex-col'>
            <div>Connected to Figma as</div>
            <div>{user.email} <button className="text-neutral-400 underline" onClick={handleSignOut}>Sign out</button></div>
        </div>
    </div>
}