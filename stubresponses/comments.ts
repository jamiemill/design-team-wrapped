import pickFrom from "../lib/pickfrom";

const startID = 1;

const words =
  "Nice gradient shame about the pixel precision on the button but this is going to really please the sales team";
const handles = [
  "Livingston Kerr",
  "Stein Sharp",
  "Carolyn Savage",
  "Mcknight Navarro",
  "Sweet Munoz",
  "Roslyn Underwood",
  "Mayra Daniels",
  "Hunt Merrill",
  "Jackson Tucker",
  "Morales Bright",
  "Kirsten Day",
  "Danielle Alvarez",
  "Lynette Jenkins",
  "Velazquez Hobbs",
  "Tami Velasquez",
  "Ericka Richmond",
  "Elliott Blackwell",
  "Schmidt Crosby",
  "Deena Joyner",
  "Lynch Robles",
];

export default function (fileKey: string) {
  const comments = [];
  const count = Math.floor(Math.random() * 50);

  for (let i = startID; i < startID + count; i++) {
    comments.push({
      "id": `${fileKey}-comment-${i}`,
      "file_key": fileKey,
      "parent_id": (Math.random() > 0.7) ? `${fileKey}-comment-${startID}` : "", // make some point at the first comment
      "user": {
        "handle": pickFrom(handles),
        "img_url":
          "https://www.gravatar.com/avatar/da722ce7c26903be08b38ad5f11dedb0?size=240&default=https%3A%2F%2Fs3-alpha.figma.com%2Fstatic%2Fuser_j_v2.png",
        "id": "342316821831983935",
      },
      "created_at": "2022-12-14T21:53:20.541Z",
      "resolved_at": null,
      "message": words,
      "reactions": [],
      "client_meta": {
        "node_id": "1:197",
        "node_offset": { "x": 201.5999755859375, "y": 52.79998779296875 },
      },
      "order_id": "1",
    });
  }

  return {
    "comments": comments,
  };
}
