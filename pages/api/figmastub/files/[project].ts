import { NextApiRequest, NextApiResponse } from "next";
import stubFiles from "../../../../stubresponses/files";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (!req.query.project) throw "No project specified";
  if (typeof req.query.project !== "string") {
    throw "More than one project specified";
  }
  res.status(200).json(stubFiles(req.query.project));
}
