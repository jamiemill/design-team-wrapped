import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../layouts/layout'
import { Analytics } from '@vercel/analytics/react';


const beforeSend = (event: any) => {
  const url = new URL(event.url);
  url.searchParams.delete('code');
  return {
    ...event,
    url: url.toString(),
  };
}

export default function App({ Component, pageProps }: AppProps) {
  return <Layout>
    <Component {...pageProps} />
    <Analytics beforeSend={beforeSend} />
  </Layout>
}
