import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="shortcut icon" href="/design-team-wrapped-favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;800&family=Unbounded:wght@400;900&display=swap" rel="stylesheet"></link>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Head>
        </Html>
    )
}