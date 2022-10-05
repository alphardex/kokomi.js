import { readdir, writeFile } from "fs/promises";

// https://stackoverflow.com/a/24594123
const getDirectories = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const folders = await getDirectories("./entries");

const data = {
  entries: folders,
};

const dataStr = JSON.stringify(data);

await writeFile("./entries/files.json", dataStr);
