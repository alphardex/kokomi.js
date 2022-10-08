import { readdir, writeFile } from "fs/promises";

const BASEPATH = ".";

const IGNOREPATH = ["node_modules"];

// https://stackoverflow.com/a/24594123
const getDirectories = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const folders = (await getDirectories(BASEPATH)).filter(
  (item) => !IGNOREPATH.includes(item)
);

const data = {
  examples: folders,
};

const dataStr = JSON.stringify(data);

await writeFile(`${BASEPATH}/files.json`, dataStr);
