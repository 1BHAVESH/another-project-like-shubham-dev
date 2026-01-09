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

const slugify = (str = "") =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ========== FILE DELETION UTILITIES (REUSABLE) ==========

/**
 * Delete a single file safely
 * @param {string} filePath - Relative path like "/uploads/companies/abc/file.jpg"
 */
export const deleteFile = (filePath) => {
  try {
    if (!filePath || filePath === "null" || filePath === "undefined") {
      return false;
    }

    const cleanPath = filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath;
    const fullPath = path.join(process.cwd(), cleanPath);
    console.log("Before Delete");

    if (fs.existsSync(fullPath)) {
      console.log("Before Delete");

      fs.unlinkSync(fullPath);
      console.log("✅ Deleted:", cleanPath);
      return true;
    } else {
      console.log("⚠️ File not found:", cleanPath);
      return false;
    }
  } catch (error) {
    console.error("❌ Error deleting file:", filePath, error.message);
    return false;
  }
};

/**
 * Delete multiple files
 * @param {string[]} filePaths - Array of file paths
 */
export const deleteFiles = (filePaths) => {
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  const results = { deleted: 0, notFound: 0 };

  filePaths.forEach((filePath) => {
    if (filePath && filePath !== "null" && filePath !== "undefined") {
      const result = deleteFile(filePath);
      if (result) results.deleted++;
      else results.notFound++;
    }
  });

  console.log(
    `🗑️ Deletion Summary: ${results.deleted} deleted, ${results.notFound} not found`
  );
  return results;
};

/**
 * Middleware to delete old files from request body
 * Usage: router.put("/path", deleteOldFiles(), controller)
 */
export const deleteOldFiles = () => (req, res, next) => {
  try {
    const { deletedFiles, oldImage, oldImages } = req.body;
    let filesToDelete = [];

      const deletedAmenityIcons = req.body?.deletedAmenityIcons
      ? Array.isArray(req.body.deletedAmenityIcons)
        ? req.body.deletedAmenityIcons
        : [req.body.deletedAmenityIcons]
      : [];

    console.log("zzzzzzzzzzzz", req.body);

    console.log("oldImages === ", oldImages);
    

    //  throw Error("error")

    if (oldImage) filesToDelete.push(oldImage);
    if (oldImages) {
      const images = Array.isArray(oldImages) ? oldImages : [oldImages];
      filesToDelete.push(...images);
    }
    if(deletedAmenityIcons){
       const images = Array.isArray(deletedAmenityIcons) ? deletedAmenityIcons : [deletedAmenityIcons];
      filesToDelete.push(...images);
    }
    
    if (deletedFiles) {
      const files = Array.isArray(deletedFiles) ? deletedFiles : [deletedFiles];
      filesToDelete.push(...files);
    }

    if (filesToDelete.length > 0) {
      console.log("🗑️ Deleting old files:", filesToDelete.length);
      deleteFiles(filesToDelete);
    }

    next();
  } catch (err) {
    console.error(" Delete Middleware Error:", err);
    next();
  }
};

export const deleteVideoFolder = (videoFileUrl) => {
  if (!videoFileUrl) return;

  try {
    // "/uploads/companies/.../videos/video-123.mp4"
    const cleanPath = videoFileUrl.startsWith("/")
      ? videoFileUrl.substring(1)
      : videoFileUrl;

    const fullFilePath = path.join(process.cwd(), cleanPath);

    // 👇 extract /videos folder
    const videoFolderPath = path.dirname(fullFilePath);

    if (fs.existsSync(videoFolderPath)) {
      fs.rmSync(videoFolderPath, { recursive: true, force: true });
      console.log("🗑️ Video folder deleted:", videoFolderPath);
    }
  } catch (err) {
    console.error("❌ Video folder delete error:", err.message);
  }
};



/**
 * Delete entire folder recursively
 */
export const deleteFolder = (folderPath) => {
  try {
    const cleanPath = folderPath.startsWith("/")
      ? folderPath.substring(1)
      : folderPath;
    const fullPath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log("✅ Deleted folder:", cleanPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Error deleting folder:", folderPath, error.message);
    return false;
  }
};

// ========== LEGACY DELETE (Keep for backward compatibility) ==========
export const deleteOldImage = () => deleteOldFiles();

// ========== GENERIC UPLOAD FUNCTION ==========
export const uploadTo = ({
  dir = "uploads",
  isImage = false,
  isDoc = false,
  fileSize = 2,
  getDir,
}) => {
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
      let finalDir = dir;

      if (getDir) {
        finalDir = getDir(req, file);
      }

      const uploadPath = path.join(__dirname, `../uploads/${finalDir}`);

      console.log(`📁 Upload Path for ${file.fieldname}:`, uploadPath);

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

// ========== STATIC USE CASES ==========

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

export const uploadCompanyBanner = uploadTo({
  isImage: true,
  fileSize: 5,

  getDir: (req) => {
    const {slug} = req.body;

    console.log("###########", req.body);
    

    console.log("000000000000000", slug);
    

    if (!slug) {
      throw new Error("Company slug missing for banner upload");
    }

    return `companies/${slug}/banners`;
  },
});

// ========== COMPANY LOGO UPLOAD ==========

export const uploadCompanyLogo = uploadTo({
  isImage: true,
  fileSize: 5,

  getDir: (req, file) => {
    const slug = req.body.slug || slugify(req.body.name);
    console.log("🏢 Company Slug:", slug);
    return `companies/${slug}/logo`;
  },
});

// ========== PROJECT MEDIA UPLOAD WITH SMART ROUTING ==========

export const uploadProjectMedia = uploadTo({
  fileSize: 100, // 100MB for videos

  getDir: (req, file) => {
    const { companySlug, projectSlug } = req.body;

    const c = companySlug || "unknown-company";
    const p = projectSlug || slugify(req.body.title) || "unknown-project";

    // ✅ SMART FOLDER ROUTING BASED ON FIELDNAME
    let folder = "misc";

    // Main project images
    if (
      ["image", "logo", "overviewImage", "buildingImage", "gallery"].includes(
        file.fieldname
      )
    ) {
      folder = "images";
    }

    // Floor plans and master plans
    if (["masterPlanImage", "floorPlanImage"].includes(file.fieldname)) {
      folder = "floorplans";
    }

    // Amenity icons and assets
    if (["amenityIcons", "assets"].includes(file.fieldname)) {
      folder = "assets";
    }

    // Documents (PDF)
    if (["brochure", "priceSheet"].includes(file.fieldname)) {
      folder = "docs";
    }

    // Video files
    if (file.fieldname === "video") {
      folder = "videos";
    }

    const finalPath = `companies/${c}/projects/${p}/${folder}`;

    console.log(`📂 Routing ${file.fieldname} → ${finalPath}`);

    return finalPath;
  },
});
