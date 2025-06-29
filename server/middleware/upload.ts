import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("uploads/gallery");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const galleryUpload = multer({ storage });
