# Design Team Wrapped

This is a next.js app that generates end-of-2022 stats for a team using the
Figma API.

To run this yourself:

1. Create an App at https://figma.com/developers, give it a name
2. Set the callback to `<host>/callback` where host is wherever you're running
   it (e.g. http://localhost:3000/callback if running locally). You can add
   multiple callbacks if you're going to run it in different places (e.g. also
   deployed somewhere.
3. Save the client ID and secret.
4. Create a `.env.local` file at the root of this project that looks like:

```
NEXT_PUBLIC_OAUTH_CLIENT_ID=XXXXXXX
NEXT_PUBLIC_OAUTH_CALLBACK=http://YYYYYYYY/callback
OAUTH_CLIENT_SECRET=ZZZZZZZ
NEXT_PUBLIC_USE_STUBS=false
```

5. Then run `npm run dev` to develop locally. You can also run it deployed on
   vercel. Don't forget to change the callback hostname both in `.env.local` and
   in the client app setup on figma.com/developers.
