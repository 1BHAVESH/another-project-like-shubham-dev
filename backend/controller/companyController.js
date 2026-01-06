import { Company } from "../models/Compnies.js";

export const createCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      description,
      address,
      website,
      establishedOn,
    } = req.body;

    // --------------------------
    // BASIC VALIDATION
    // --------------------------

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // Email format check (optional but good)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    // Phone format simple validation
    if (phone && phone.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Phone number is too short",
      });
    }

    // Website validation (optional)
    if (website) {
      try {
        new URL(website);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid website url",
        });
      }
    }

    // --------------------------
    // CHECK IF COMPANY ALREADY EXISTS
    // --------------------------
    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company with this name already exists",
      });
    }

    // --------------------------
    // CREATE COMPANY
    // --------------------------
    const company = await Company.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};