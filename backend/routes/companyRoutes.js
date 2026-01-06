import express from "express";
import { createCompany } from "../controller/companyController.js";


const router = express.Router();

// Create Company
router.post("/", createCompany);

export default router;
