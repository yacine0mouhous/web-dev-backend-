import fs from "fs";
import path from "path";

const deleteFiles = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    const absolutePath = path.resolve(filePath); 

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(absolutePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Failed to delete ${absolutePath}:`, unlinkErr);
          }
        });
      }
    });
  });
};

export default deleteFiles;
