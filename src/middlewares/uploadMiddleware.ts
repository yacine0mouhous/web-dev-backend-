import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const storage: StorageEngine = multer.diskStorage({
  destination: "./uploads/", 
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|svg|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, JPG, PNG, GIF , SVG) are allowed"));
  }
};

const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter,
}).single("image");

const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("images", 5);

export { uploadSingle, uploadMultiple };
