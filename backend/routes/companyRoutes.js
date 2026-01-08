import express from "express";
import { createCompany, getCompanies, getCompany, updateCompany } from "../controller/companyController.js";
import { deleteOldImage, uploadCompanyLogo } from "../helper/Storage.js";


const router = express.Router();

router.get("/", getCompanies);

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

export default router;
