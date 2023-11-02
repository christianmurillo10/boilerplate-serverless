import fs from "fs";
import path from "path";
import _ from "lodash";
import ErrorException from "../exceptions/ErrorException";

export const setUploadPath = (file: any, filePath: string): string => {
  let value: string = "";

  if (!_.isUndefined(file)) {
    const extension = path.extname(file.filename);
    value = `${filePath}image-${Date.now()}${extension}`;
  }

  return value;
};

export const uploadFile = (path: string | null, file: any): void => {
  try {
    if (path) {
      fs.writeFile(path, file.content, (err) => {
        if (err) throw err;
      });
    }
  } catch (error) {
    console.error(error);
    throw new ErrorException([]);
  };
};