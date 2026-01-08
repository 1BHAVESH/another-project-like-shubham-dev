import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTtile,
  toggleProjectStatus,
} from "../controller/projectController.js";
import { protect } from "../middleware/auth.js";
import { deleteOldImage, uploadProjectMedia } from "../helper/Storage.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/get-title", getProjectTtile);
router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);
router.patch("/toggle/:id", protect, toggleProjectStatus);

router.post(
  "/",
  protect,
  uploadProjectMedia.fields([
    { name: "image", maxCount: 1 },              // Main image
    { name: "logo", maxCount: 1 },               // Logo (if used)
    { name: "overviewImage", maxCount: 1 },      // Overview image
    { name: "masterPlanImage", maxCount: 1 },    // Master plan
    { name: "floorPlanImage", maxCount: 1 },     // Floor plan
    { name: "buildingImage", maxCount: 1 },      // Building image
    { name: "gallery", maxCount: 20 },           // Gallery images
    { name: "amenityIcons", maxCount: 30 },      // ✅ ADD THIS - for amenity icons
    { name: "assets", maxCount: 20 },            // Other assets
    { name: "brochure", maxCount: 1 },           // Brochure PDF
    { name: "priceSheet", maxCount: 1 },         // Price sheet PDF
    { name: "video", maxCount: 1 },              // Video file
  ]),
  createProject
);

router.put(
  "/:id",
  protect,
  uploadProjectMedia.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "overviewImage", maxCount: 1 },
    { name: "masterPlanImage", maxCount: 1 },
    { name: "floorPlanImage", maxCount: 1 },
    { name: "buildingImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
    { name: "amenityIcons", maxCount: 30 },      
    { name: "assets", maxCount: 20 },
    { name: "brochure", maxCount: 1 },
    { name: "priceSheet", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  deleteOldImage(),
  updateProject  // ✅ Removed deleteOldImage middleware
);

router.delete("/:id", protect, deleteProject);

export default router;