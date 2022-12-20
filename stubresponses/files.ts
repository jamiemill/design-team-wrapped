import pickFrom from "../lib/pickfrom";

const startID = 1;

const areas = [
  "Onboarding",
  "Search & Discovery",
  "Checkout",
  "B2B",
  "Finance",
];
const features = ["New flow", "Filters", "Help", "UXR", "Reports"];
const statuses = ["LIVE", "alpha", "planning", ""];

export default function (projectID: string) {
  const count = Math.floor(5 + Math.random() * 25);
  const files = [];
  for (let i = startID; i < startID + count; i++) {
    files.push({
      "key": `project-${projectID}-file-${i}`,
      "name": `${pickFrom(areas)} ${pickFrom(features)} ${pickFrom(statuses)}`,
      "thumbnail_url":
        "https://s3-alpha.figma.com/thumbnails/67811c0c-25e9-4dc3-9233-7dbd549f303b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ4GOSFWCRF4HOUNN%2F20221215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221215T000000Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=8a98fc1d36b1951d7a1ceb7efd7a4251612c9d5430131648b4a1763df5713cff",
      "last_modified": "2022-12-14T21:52:40Z",
    });
  }

  return {
    "name": "Project name",
    "files": files,
  };
}
