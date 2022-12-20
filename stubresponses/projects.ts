import pickFrom from "../lib/pickfrom";

const count = 10;
const startID = 2000000;

const foods = ["Popcorn", "Ketchup", "Pot Noodle", "Mochi", "Onigiri"];
const animals = ["Wolves", "Snakes", "Bears", "Pandas", "Turtles"];

export default function () {
  const projects = [];

  for (let i = startID; i < startID + count; i++) {
    projects.push({
      "id": i.toString(),
      "name": `${pickFrom(foods)} ${pickFrom(animals)}`,
    });
  }

  return {
    "name": "Test Team",
    "projects": projects,
  };
}
