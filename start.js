const fs = require("fs");
const util = require("util");
const path = require("path");

const readdir = util.promisify(fs.readdir);

const assetDir = process.argv.slice(2)[0];

async function getFileList(pathname, prefix) {
  const fileNames = await readdir(
    prefix ? `${pathname}/${prefix.join("/")}` : pathname
  );
  return Promise.all(
    fileNames.map((name) => {
      if (name.indexOf(".") === -1) {
        // 폴더인 경우
        return getFileList(pathname, [...prefix, name]);
      }
      if (name.indexOf(".") !== 0) {
        // 파일인 경우
        let CONSTANTS_NAME = name.toUpperCase().split(".")[0];
        let filePath = name;
        if (prefix.length > 0) {
          CONSTANTS_NAME =
            `${prefix.join("_").toUpperCase()}_${CONSTANTS_NAME}`
            .replace( /[\{\}\[\]\/?,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi,"_");
          filePath = `${prefix.join("/")}/${name}`;
        }
        return new Promise(function (resolve) {
          resolve({ name: CONSTANTS_NAME, filePath });
        });
      }
      return new Promise(function (resolve) {
        resolve(null);
      });
    })
  );
}

async function updateFileInfoJson(basePath) {
  if (basePath) {
    const fileInfoObj = {
      assetsBasePath: basePath,
      files: {},
    };
    const pathName = path.resolve(process.cwd(), basePath);
    try {
      const fileList = await getFileList(pathName, []);
      fileList
        .flat(Infinity)
        .filter(Boolean)
        .map(({ name, filePath }) => {
          fileInfoObj.files[name] = filePath;
        });
      const savePath = path.resolve(__dirname, "fileInfo.json");
      fs.writeFileSync(savePath, JSON.stringify(fileInfoObj));
      console.log("--- AssetManager -> Update assets ---\n", fileInfoObj);
    } catch (e) {
      console.error(e);
    }
  }
}

async function init(dir) {
  try {
    await updateFileInfoJson(dir);
    fs.watch(
      assetDir,
      {
        recursive: true,
      },
      (eventType, fileName) => {
        console.log("--- AssetManager -> Detect Asset File Changes ---");
        console.info("fileName:", fileName);
        updateFileInfoJson(dir);
      }
    );
  } catch (e) {
    console.error(e);
  }
}

init(assetDir);
