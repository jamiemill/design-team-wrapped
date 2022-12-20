import Image from "next/image";

export default function Logo() {
    return <div className='flex justify-center my-16'>
        <Image priority alt="Design Team Wrapped logo" src="/design-team-wrapped-logo@3x.png" width="600" height="215" />
    </div>
}