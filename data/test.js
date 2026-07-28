import fs from "node:fs/promises";

const json = await fs.readFile("./data/generated/typescript.json", "utf8");

const data = JSON.parse(json);

console.log(data[0].answer.en);