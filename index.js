/* eslint-disable */
import fileInfo from "./fileInfo.json";

function getResource() {
  const fileMap = {};
  const { assetsBasePath, files } = fileInfo;
  const basePath = assetsBasePath.replace("src/", "");
  Object.keys(files).map((fileName) => {
    fileMap[fileName] = require(`../${basePath}/${files[fileName]}`);
  });
  return fileMap;
}

export const assets = getResource()
