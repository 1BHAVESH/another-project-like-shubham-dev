import express from "express";
import multer from "multer";
import path from "path";
import { getAllBanners, createBanner, updateBanner, deleteBanner, getAllBannersForAdmin } from "../controller/bannerController.js";
import { protect } from "../middleware/auth.js";
import { deleteOldImage, uploadBanner } from "../helper/Storage.js";

const router = express.Router();

router.get("/", getAllBanners);
router.get("/banner", protect, getAllBannersForAdmin)
router.post("/", protect, uploadBanner.single("image"), createBanner);
router.put("/:id", protect, uploadBanner.single("image"), deleteOldImage("banners"), updateBanner);
router.delete("/:id", protect, deleteBanner);

export default router;
