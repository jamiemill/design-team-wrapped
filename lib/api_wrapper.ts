import * as Figma from "figma-api";
import {
  GetCommentsResult,
  GetProjectFilesResult,
  GetTeamProjectsResult,
} from "figma-api/lib/api-types";

const DELAY = 500;

class ApiWraper {
  api: Figma.Api;

  constructor(token: string) {
    this.api = new Figma.Api({
      oAuthToken: token,
    });
  }

  getTeamComponents(teamID: string) {
    return this.api.getTeamComponents(teamID);
  }

  getVersions(fileKey: string) {
    return this.api.getVersions(fileKey);
  }

  getMe() {
    return this.api.getMe();
  }

  getTeamProjects(teamID: string): Promise<GetTeamProjectsResult> {
    if (process.env.NEXT_PUBLIC_USE_STUBS === "true") {
      return new Promise((r) =>
        setTimeout(
          () =>
            r(fetch("/api/figmastub/projects/" + teamID).then((r) => r.json())),
          DELAY,
        )
      );
    }
    return this.api.getTeamProjects(teamID);
  }

  getProjectFiles(projectId: string): Promise<GetProjectFilesResult> {
    if (process.env.NEXT_PUBLIC_USE_STUBS === "true") {
      return new Promise((r) =>
        setTimeout(
          () =>
            r(fetch("/api/figmastub/files/" + projectId).then((r) => r.json())),
          DELAY,
        )
      );
    }
    return this.api.getProjectFiles(projectId);
  }

  getComments(fileKey: string): Promise<GetCommentsResult> {
    if (process.env.NEXT_PUBLIC_USE_STUBS === "true") {
      return new Promise((r) =>
        setTimeout(
          () =>
            r(
              fetch("/api/figmastub/comments/" + fileKey).then((r) => r.json()),
            ),
          DELAY,
        )
      );
    }
    return this.api.getComments(fileKey);
  }
}

export default ApiWraper;
