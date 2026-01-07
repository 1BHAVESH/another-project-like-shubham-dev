import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  SUPPORTED_FORMATS_IMAGE,
  SUPPORTED_FORMATS_DOC,
} from "./formValidConfig.js";


// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const slugify = (str = "") =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")           // spaces → hyphen
    .replace(/-+/g, "-");      



// GENERIC UPLOAD FUNCTION  

export const uploadTo = ({
  dir = "uploads",
  isImage = false,
  isDoc = false,
  fileSize = 2,
  getDir, // 👈 NEW (DYNAMIC PATH SUPPORT)
}) => {

  const maxAllowSize = fileSize * Math.pow(1024, 2);


  // ---------------- FILE FILTER ----------------
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



  // ---------------- STORAGE CONFIG ----------------
  const storage = multer.diskStorage({

    destination: (req, file, cb) => {

      // 🟢 agar getDir diya hai → dynamic folder
      let finalDir = dir;

      if (getDir) {
        finalDir = getDir(req, file);
      }
      

      const uploadPath = path.join(__dirname, `../uploads/${finalDir}`);

      console.log("uploadToPath: ", uploadPath);
      

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



  // ---------------- MULTER INSTANCE ----------------
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






// DELETE OLD FILE 

export const deleteOldImage = () => (req, res, next) => {
  try {
    const oldImage = req.body?.oldImage || req.query?.oldImage;

    if (!oldImage) return next();

    console.log("old image = ", oldImage);
    

    const filePath = path.join(process.cwd(), oldImage);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // throw Error("Hello")

    next();
  } catch (err) {
    console.log("Delete Error:", err);
    next();
  }
};





// STATIC USE CASES 

export const uploadBlogImage = uploadTo({
  dir: "blogs",
  isImage: true,
  fileSize: 5,
});


export const uploadBanner = uploadTo({
  dir: "banners",
  isImage: true,
  fileSize: 5,
});





// REAL ESTATE — DYNAMIC COMPANY + PROJECT 



export const uploadCompanyLogo = uploadTo({
  isImage: true,
  fileSize: 5,

  getDir: (req, file) => {

    console.log("req.body", req.body);
    

    let slug;

    if(!req.body.slug){
      slug = slugify(req.body.name)
      
    }

    slug = req.body.slug


    //  throw Error("error")

    console.log("slug", slug);
    

    return `companies/${slug}/logo`;
  },
});

export const uploadProjectMedia = uploadTo({
  isImage: true,
  fileSize: 20,

  getDir: (req, file) => {

    const { companyName, projectName, type } = req.body;

    // SAFETY fallback
    const c = companyName || "unknown-company";
    const p = projectName || "unknown-project";
    const t = type || "misc";

    return `companies/${c}/projects/${p}/${t}`;
  },
});
