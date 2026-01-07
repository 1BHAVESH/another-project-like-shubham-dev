import { Company } from "../models/Compnies.js";


import fs from "fs";
import path from "path";

export const getCompanies = async (req, res) => {
  try {

    // Query Params
    let {
      page = 1,
      limit = 10,
      search = "",
      status
    } = req.query;

    page = Number(page);
    limit = Number(limit);


    // ---------- FILTER ----------
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (status) {
      filter.status = status;
    }


    // ---------- COUNT ----------
    const total = await Company.countDocuments(filter);


    // ---------- DATA ----------
    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);


    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: companies.length,
      companies,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }

};


const slugify = (str = "") =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const createCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      shortDescription,
      description,
      website,
      establishedOn,
      status,
      street,
      city,
      state,
      country,
      pincode,
    } = req.body;


    // ---------------- VALIDATION ----------------
    if (
      !name ||
      !email ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !country ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Company logo is required",
      });
    }

   // 1. normalize slashes
const normalized = req.file.path.replace(/\\/g, "/");

// 2. remove system prefix
const relative = normalized.split("uploads")[1];

// 3. final frontend path
const logoPath = "/uploads" + relative;

    
    


    // -------------- CHECK DUPLICATE --------------
    const exists = await Company.findOne({ email });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Company already exists with this email",
      });
    }

    


    // -------------- SAVE DATA ---------------------
    const company = await Company.create({
      name,
      slug: slugify(name),
      email,
      phone,
      shortDescription,
      description,
      website,
      establishedOn,
      status,

      address: {
        street,
        city,
        state,
        country,
        pincode,
      },

      logo: logoPath
    });


    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    let company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ------------------------------
    // OLD SLUG
    // ------------------------------
    const oldSlug = company.slug;

    // ------------------------------
    // UPDATE BASIC FIELDS
    // ------------------------------
    company.name = req.body.name ?? company.name;
    company.email = req.body.email ?? company.email;
    company.phone = req.body.phone ?? company.phone;
    company.shortDescription =
      req.body.shortDescription ?? company.shortDescription;
    company.description =
      req.body.description ?? company.description;
    company.website = req.body.website ?? company.website;
    company.establishedOn =
      req.body.establishedOn ?? company.establishedOn;
    company.status = req.body.status ?? company.status;

    company.address.street = req.body.street ?? company.address.street;
    company.address.city = req.body.city ?? company.address.city;
    company.address.state = req.body.state ?? company.address.state;
    company.address.country = req.body.country ?? company.address.country;
    company.address.pincode = req.body.pincode ?? company.address.pincode;

    // ------------------------------
    // NEW SLUG (WE KEEP SAME IF NOT SENT)
    // ------------------------------
    const newSlug = slugify(req.body.name) || oldSlug;

    // ------------------------------
    // CHECK IF SLUG CHANGED → RENAME FOLDER
    // ------------------------------

    console.log("new slug: ", newSlug);
    console.log("old slug: ", oldSlug);
    
    
    
    if (newSlug !== oldSlug) {
      const oldPath = path.join(process.cwd(), `uploads/companies/${oldSlug}`);
      const newPath = path.join(process.cwd(), `uploads/companies/${newSlug}`);
    
    
      console.log("old PATH", oldPath);
      console.log("new PATH", newPath);


      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }

      company.slug = newSlug;

      // update logo path also
      if (company.logo) {
        company.logo = company.logo.replace(`/companies/${oldSlug}`, `/companies/${newSlug}`);
      }
    }

    // ------------------------------
    // HANDLE LOGO FILE (OPTIONAL)
    // ------------------------------
    if (req.file) {
      const normalized = req.file.path.replace(/\\/g, "/");
      company.logo = "/uploads" + normalized.split("uploads")[1];
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};