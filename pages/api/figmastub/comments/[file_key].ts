import { NextApiRequest, NextApiResponse } from "next";
import stubComments from "../../../../stubresponses/comments";

// GET/v1/files/:key/comments
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (!req.query.file_key) throw "No project specified";
  if (typeof req.query.file_key !== "string") {
    throw "More than one project specified";
  }
  res.status(200).json(stubComments(req.query.file_key));
}
