import express from "express";
import { addCompanyBanners, createCompany, getCompanies, getCompaniesTitles, getCompany, updateCompany } from "../controller/companyController.js";
import { deleteOldImage, uploadBanner, uploadCompanyLogo } from "../helper/Storage.js";


const router = express.Router();

router.get("/", getCompanies);

router.get("/get-title", getCompaniesTitles)

router.get("/:id", getCompany);



// Create Company
router.post(
  "/",
  uploadCompanyLogo.single("logo"),
  createCompany
);

router.put(
  "/:id",
  uploadCompanyLogo.single("logo"),
  deleteOldImage(),
  updateCompany
);

router.post(
  "/companies/:id/banners",
  uploadBanner.array("banners", 5), // max 5 banners
  addCompanyBanners
);

export default router;
