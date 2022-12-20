import {
  Comment,
  GetProjectFilesResult,
  Project,
  ProjectFile,
  User,
} from "figma-api/lib/api-types";
import { clone } from "remeda";
import ApiWrapper from "./api_wrapper";
import asyncBatch from "async-batch";

export type ProgressUpdate = {
  totalProjects: number;
  projectsAnalysed: number;
  totalFilesForThisProject: number;
  filesAnalysedForThisProject: number;
};

type handle = string;
type projectID = string;
type fileKey = string;
type UserData = {
  user: User;
  comments: Comment[];
  commentsThisYear: number;
  // mentionsOfPeople: Record<handle, Comment[]>;
  // mentionedByPeople: Record<handle, Comment[]>;
  // commentsOnProjects: Record<projectID, Comment[]>;
  // mentionedInProjects: Record<projectID, Comment[]>;
  // commentsOnFiles: Record<fileKey, Comment[]>;
  // mentionedInFiles: Record<fileKey, Comment[]>;
};
type ProjectData = {
  project: Project;
  filesModifiedThisYear: number;
  commentsThisYear: number;
  commentsByPeople: Record<handle, number>; // needed?
};
type FileData = {
  file: ProjectFile;
  projectID: projectID;
  comments: Comment[];
  commentsByPeople: Record<handle, number>; // needed?
  mentioned: Record<handle, number>; // needed?
};

type FileAndProjectAndComments = {
  fileKey: string;
  projectID: string;
  comments: Comment[];
};
export type Data = {
  users: Record<handle, UserData>;
  projects: Record<projectID, ProjectData>;
  files: Record<fileKey, FileData>;
  comments: Record<fileKey, FileAndProjectAndComments>; // not sure yet that comments should be stored like this. better to nest inside projects? or just have a flat list?
  stats: {
    filesModifiedThisYearCount: null | number;
    commentsLeftThisYearCount: null | number;
  };
};

export default class Crawler {
  teamID: string;
  fetcher: ApiWrapper;
  onProgress?: (progress: ProgressUpdate | null) => void;
  onStatus?: (status: string) => void;
  onGranularStatus?: (status: string) => void;
  destroyed: boolean = false;
  concurrency = 5;
  periodStart = "2022-01-01T00:00:00Z";
  periodEnd = "2023-01-01T00:00:00Z";

  constructor(
    { teamID: teamID, fetcher, onProgress, onStatus, onGranularStatus }: {
      teamID: string;
      fetcher: ApiWrapper;
      onProgress?: (progress: ProgressUpdate | null) => void;
      onStatus?: (status: string) => void;
      onGranularStatus?: (status: string) => void;
    },
  ) {
    this.teamID = teamID;
    this.fetcher = fetcher;
    this.onProgress = onProgress;
    this.onStatus = onStatus;
    this.onGranularStatus = onGranularStatus;
  }

  destroy() {
    this.destroyed = true;
    this.onProgress = () => {};
    this.onStatus = () => {};
  }

  async crawlTeam() {
    const data: Data = {
      users: {},
      projects: {},
      files: {},
      comments: {},
      stats: {
        filesModifiedThisYearCount: null,
        commentsLeftThisYearCount: null,
      },
    };

    /**
     * Get all projects
     */

    this.onStatus && this.onStatus("Fetching project list");
    const projects = await this.fetcher.getTeamProjects(this.teamID);
    projects.projects.forEach((project) => {
      data.projects[project.id] = {
        project,
        commentsThisYear: 0,
        commentsByPeople: {},
        filesModifiedThisYear: 0,
      };
    });

    if (this.destroyed) return null;

    /**
     * Get all files for all projects, in batches
     */

    const projectIDs = Object.keys(data.projects);

    this.onStatus && this.onStatus("Fetching files for each project");
    const allFilesByProject = await asyncBatch(
      projectIDs,
      async (projectID, taskIndex, workerNumber) => {
        console.log("fetching files for project ", projectID);
        this.onGranularStatus &&
          this.onGranularStatus(
            `Fetching files for project ${
              taskIndex + 1
            } of ${projectIDs.length}: ${
              data.projects[projectID].project.name
            }`,
          );

        if (this.destroyed) return Promise.resolve({ projectID, files: [] }); // how to fix types to allow returning null here?
        const result = await this.fetcher
          .getProjectFiles(projectID);
        return {
          projectID,
          files: result.files,
        };
      },
      this.concurrency,
    );

    if (this.destroyed) return null;

    for (const project of allFilesByProject) {
      for (const file of project.files) {
        const fileObj = {
          file,
          comments: [],
          commentsByPeople: {},
          mentioned: {},
          projectID: project.projectID,
        };
        data.files[file.key] = fileObj;
      }
    }

    /**
     * Get all comments for all files, in batches
     */

    this.onStatus && this.onStatus("Fetching comments for each file");
    const fileKeys = Object.keys(data.files);
    const allCommentsByFile: FileAndProjectAndComments[] = await asyncBatch(
      fileKeys,
      async (fileKey, taskIndex, workerNumber) => {
        console.log("fetching comments for file", fileKey);
        this.onGranularStatus &&
          this.onGranularStatus(
            `Fetching comments for file ${
              taskIndex + 1
            } of ${fileKeys.length}: ${data.files[fileKey].file.name}`,
          );
        if (this.destroyed) {
          return Promise.resolve({
            fileKey,
            comments: [],
            projectID: data.files[fileKey].projectID,
          }); // how to fix types to allow returning null here?
        }
        const result = await this.fetcher
          .getComments(fileKey);
        return {
          fileKey,
          projectID: data.files[fileKey].projectID,
          comments: result.comments,
        };
      },
      this.concurrency,
    );

    for (const file of allCommentsByFile) {
      data.comments[file.fileKey] = file;
    }

    const stats = this.analyseAndAugment(data);
    console.log(data);

    this.onGranularStatus && this.onGranularStatus("");
    this.onStatus && this.onStatus("Done");

    return data;
  }

  analyseAndAugment(data: Data) {
    /**
     * Get comments per user
     * and get comments per project
     */
    for (const fileKey in data.comments) {
      for (const comment of data.comments[fileKey].comments) {
        if (!data.users[comment.user.handle]) {
          data.users[comment.user.handle] = {
            user: comment.user,
            comments: [],
            commentsThisYear: 0,
            // mentionsOfPeople: {},
            // mentionedByPeople: {},
            // commentsOnProjects: {},
            // mentionedInProjects: {},
            // commentsOnFiles: {},
            // mentionedInFiles: {},
          };
        }
        data.users[comment.user.handle].comments.push(comment);
        const projectID = data.files[fileKey].projectID;
        if (comment.created_at >= this.periodStart) {
          data.projects[projectID].commentsThisYear++;
          data.users[comment.user.handle].commentsThisYear++;
        }
      }
    }

    /**
     * count files mofified this year per project
     */
    for (const fileKey in data.files) {
      if (data.files[fileKey].file.last_modified >= this.periodStart) {
        const projectID = data.files[fileKey].projectID;
        data.projects[projectID].filesModifiedThisYear++;
      }
    }

    /**
     * Get overall stats
     */
    data.stats.filesModifiedThisYearCount =
      Object.values(data.files).filter((f) =>
        f.file.last_modified >= this.periodStart
      ).length;

    data.stats.commentsLeftThisYearCount = Object.values(data.comments).reduce(
      (count, fileAndProjectAndComments) =>
        count +
        fileAndProjectAndComments.comments.filter((c) =>
          c.created_at >= this.periodStart
        ).length,
      0,
    );
  }
}
