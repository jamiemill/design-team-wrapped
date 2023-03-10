import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  access_token: any;
  expires_in: any;
  refresh_token: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { code } = req.query;
  if (typeof code !== "string") throw "Expected exactly one code";
  if (
    !process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID ||
    !process.env.NEXT_PUBLIC_OAUTH_CALLBACK ||
    !process.env.OAUTH_CLIENT_SECRET
  ) throw "Missing environment variables.";

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.NEXT_PUBLIC_OAUTH_CALLBACK,
    code,
    grant_type: "authorization_code",
  });
  const url = `https://www.figma.com/api/oauth/token?${params.toString()}`;
  const result = await fetch(url, { method: "POST" });
  const data = await result.json();
  if (data.error) {
    throw "Error fetching token: " + data.message;
  }
  const { access_token, expires_in, refresh_token } = data;

  res.status(200).json({ access_token, expires_in, refresh_token });
}
