import { NextApiRequest, NextApiResponse } from "next";
import stubProjects from "../../../../stubresponses/projects";

// GET/v1/teams/:team_id/projects
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.status(200).json(stubProjects());
}
