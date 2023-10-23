import fs from "fs";
import path from "path";
import _ from "lodash";
import ErrorException from "../utils/ErrorException";

export const setUploadPath = (file: any, filePath: string): string => {
  let value: string = "";

  if (!_.isUndefined(file)) {
    const extension = path.extname(file.originalname);
    value = `${filePath}image-${Date.now()}${extension}`;
  }

  return value;
};

export const uploadFile = (path: string | null, file: any): void => {
  try {
    if (path) {
      fs.writeFile(path, file.buffer, (err) => {
        if (err) throw err;
      });
    }
  } catch (error) {
    console.error(error);
    throw new ErrorException();
  };
};