import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  SUPPORTED_FORMATS_IMAGE,
  SUPPORTED_FORMATS_DOC,
} from "./formValidConfig.js";
import { log } from "console";


// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 🔹 MAIN FUNCTION
export const uploadTo = ({ dir = "uploads", isImage = false, isDoc = false, fileSize = 2 }) => {

  const maxAllowSize = fileSize * Math.pow(1024, 2);

  const fileFilter = (req, file, cb) => {

    const reqSize = parseInt(req.headers["content-length"]);

    if (reqSize && reqSize > maxAllowSize) {
      req.fileValidationError = "File too large";
      return cb(null, false);
    }

    if (isImage && !SUPPORTED_FORMATS_IMAGE.includes(file.mimetype)) {
      req.fileValidationError = "Only image files allowed";
      return cb(null, false);
    }

    if (isDoc && !SUPPORTED_FORMATS_DOC.includes(file.mimetype)) {
      req.fileValidationError = "Only document files allowed";
      return cb(null, false);
    }

    cb(null, true);
  };


  const storage = multer.diskStorage({

    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../uploads/${dir}`);

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

      const unique =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, file.fieldname + "-" + unique);
    },
  });


  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxAllowSize },
  });


  return {
    single: (field = "file") => upload.single(field),
    array: (field = "files", max = 5) => upload.array(field, max),
    fields: (fieldsArray) => upload.fields(fieldsArray),
  };
};



// 🔥 DELETE FILE
export const deleteOldImage = (folderName = "blogs") => (req, res, next) => {
    try {
      const oldImage = req.body?.oldImage || req.query?.oldImage;

      console.log("oldImage", oldImage);
      

      if (!oldImage) return next();

      const filePath = path.join(process.cwd(),oldImage);
console.log(path.join(process.cwd()));

      console.log("filePath", filePath);
      

      if (fs.existsSync(filePath)) {
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        
        fs.unlinkSync(filePath);
      }

      next();
    } catch (err) {
      console.log("Delete Error:", err);
      next();
    }
  };
export const uploadBlogImage = uploadTo({dir: "blogs", isImage: true, fileSize: 5 });     // MB
export const uploadBanner = uploadTo({dir: "banners", isImage: true, fileSize: 5 }); 