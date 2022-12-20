# Design Team Wrapped

<img src="public/design-team-wrapped-logo%403x.png" width=500 />

This is a next.js experiment that generates end-of-2022 stats for a team using
the Figma API. Try it at https://wrapped.jamiemill.com

## Running locally

1. Create an App at https://figma.com/developers, give it a name
2. Set the callback to `http://localhost:3000/callback`.
3. Save the client ID and secret.
4. Create a `.env.local` file at the root of this project that looks like:

```
NEXT_PUBLIC_OAUTH_CLIENT_ID=XXXXXXX
NEXT_PUBLIC_OAUTH_CALLBACK=http://localhost:3000/callback
OAUTH_CLIENT_SECRET=ZZZZZZZ
NEXT_PUBLIC_USE_STUBS=false
```

5. Then run `npm run dev` to develop locally.

## Stubbing the data

If you set `NEXT_PUBLIC_USE_STUBS=true` you'll get a largeish volume of randomly
generated data to test with locally.

## Deploy on Vercel

Set the same environment variables on Vercal that you see in the file above,
changing localhost to the domain of the deployment.

Don't forget to add an additional callback in the client app setup on
figma.com/developers that points to the deployed callback URL.
