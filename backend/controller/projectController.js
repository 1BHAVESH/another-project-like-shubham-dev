import Project from "../models/Project.js";
import fs from "fs";
import path from "path";
import { Company } from "../models/Compnies.js";
import { deleteFiles, deleteVideoFolder } from "../helper/Storage.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      tagline,
      description,
      location,
      address,
      status,
      price,
      area,
      propertyTypes,
      contactNumber,
      videoUrl,
      amenities,
      highlights,
      nearbyLocations,
      mapEmbedUrl,
      isActive,
      isFeatured,
      order,
      amenityIconIndexes,
      companySlug,
      projectSlug,
      companyId,
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Main project image is required",
      });
    }

    // Generate slug if not provided
    const finalSlug =
      slug ||
      projectSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    console.log("📝 Creating project:", title);
    console.log("🏢 Company Slug:", companySlug);
    console.log("📂 Project Slug:", finalSlug);

    // ========== HELPER FUNCTION TO GET RELATIVE PATH ==========
    const getRelativePath = (file) => {
      if (!file) return null;
      // Extract path after 'uploads/'
      const fullPath = file.path.replace(/\\/g, "/");
      const uploadsIndex = fullPath.indexOf("uploads/");
      return uploadsIndex !== -1
        ? `/${fullPath.substring(uploadsIndex)}`
        : `/${file.path}`;
    };

    // ========== PROCESS FILE UPLOADS ==========

    // Main Image (required)
    const imageUrl = getRelativePath(req.files.image[0]);

    // Optional Images
    const logoUrl = req.files.logo ? getRelativePath(req.files.logo[0]) : null;

    const overviewImageUrl = req.files.overviewImage
      ? getRelativePath(req.files.overviewImage[0])
      : null;

    const masterPlanImageUrl = req.files.masterPlanImage
      ? getRelativePath(req.files.masterPlanImage[0])
      : null;

    const floorPlanImageUrl = req.files.floorPlanImage
      ? getRelativePath(req.files.floorPlanImage[0])
      : null;

    const buildingImageUrl = req.files.buildingImage
      ? getRelativePath(req.files.buildingImage[0])
      : null;

    // Gallery Images
    const galleryImages = req.files.gallery
      ? req.files.gallery.map((file) => getRelativePath(file))
      : [];

    // Documents
    const brochureUrl = req.files.brochure
      ? getRelativePath(req.files.brochure[0])
      : null;

    const priceSheetUrl = req.files.priceSheet
      ? getRelativePath(req.files.priceSheet[0])
      : null;

    // Video File (not URL)
    const videoFileUrl = req.files.video
      ? getRelativePath(req.files.video[0])
      : null;

    console.log(" Files processed:");
    console.log("  - Main Image:", imageUrl);
    console.log("  - Gallery:", galleryImages.length, "images");
    console.log("  - Video File:", videoFileUrl || "None");
    console.log("  - Brochure:", brochureUrl || "None");

    // ========== PROCESS AMENITIES WITH ICONS ==========

    let parsedAmenities = amenities ? JSON.parse(amenities) : [];

    if (req.files?.amenityIcons && amenityIconIndexes) {
      const iconFiles = req.files.amenityIcons;
      const indexes = Array.isArray(amenityIconIndexes)
        ? amenityIconIndexes
        : [amenityIconIndexes];

      console.log(" Processing amenity icons:");
      console.log("  - Total icons:", iconFiles.length);
      console.log("  - Indexes:", indexes);

      // Map icon files to their corresponding amenities
      indexes.forEach((index, i) => {
        const amenityIndex = parseInt(index);
        if (iconFiles[i] && parsedAmenities[amenityIndex]) {
          const iconPath = getRelativePath(iconFiles[i]);
          parsedAmenities[amenityIndex].icon = iconPath;
          console.log(
            `  ✓ Amenity ${amenityIndex} (${parsedAmenities[amenityIndex].name}):`,
            iconPath
          );
        }
      });
    }

    // Validate amenities (ensure all have icons)
    const amenitiesWithoutIcons = parsedAmenities.filter((a) => !a.icon);
    if (amenitiesWithoutIcons.length > 0) {
      console.warn(
        "⚠️ Some amenities missing icons:",
        amenitiesWithoutIcons.map((a) => a.name)
      );
      // Remove amenities without icons
      parsedAmenities = parsedAmenities.filter((a) => a.icon);
    }

    // ========== CREATE PROJECT IN DATABASE ==========

    const project = await Project.create({
      title,
      slug: finalSlug,
      tagline,
      description,
      location,
      address,
      status: status || "ongoing",
      price,
      area,
      propertyTypes,
      contactNumber,
      imageUrl,
      logoUrl,
      videoUrl: videoUrl || null, // YouTube/external URL
      videoFileUrl, // Uploaded video file
      overviewImageUrl,
      masterPlanImageUrl,
      floorPlanImageUrl,
      buildingImageUrl,
      galleryImages,
      brochureUrl,
      priceSheetUrl,
      amenities: parsedAmenities,
      highlights: highlights ? JSON.parse(highlights) : [],
      nearbyLocations: nearbyLocations ? JSON.parse(nearbyLocations) : [],
      mapEmbedUrl,
      isActive: isActive === "true" || isActive === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      order: parseInt(order) || 0,
      company: companyId,
    });

    const company = await Company.findById(companyId);

    company.projects.push(project._id);

    await company.save();

    console.log("✅ Project created successfully:", project._id);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("❌ Create Project Error:", error);

    // Provide more specific error messages
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Project with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating project",
      error: error.message,
    });
  }
};

const deleteOldFile = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join("uploads", fileUrl.replace("/uploads/", ""));
  if (fs.existsSync(filePath)) {
    console.log("hii");
    fs.unlinkSync(filePath);
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      tagline,
      description,
      location,
      address,
      status,
      price,
      area,
      propertyTypes,
      contactNumber,
      videoUrl,
      amenities,
      highlights,
      nearbyLocations,
      mapEmbedUrl,
      isActive,
      isFeatured,
      order,
      amenityIconIndexes,
      projectSlug,
      deletedFiles,
    } = req.body;
    console.log("===============================", req.files);

    // -----------------------------
    // 1️⃣ FIND PROJECT
    // -----------------------------
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // -----------------------------
    // 2️⃣ FORCE oldImages AS ARRAY
    // -----------------------------
    const oldImages = req.body?.oldImages
      ? Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages]
      : [];

    // -----------------------------
    // 3️⃣ DELETE FILES FROM FOLDER
    // -----------------------------
    if (deletedFiles) {
      const filesToDelete = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      deleteFiles(filesToDelete);
    }

    // -----------------------------
    // 4️⃣ SAFE PATH HANDLER
    // -----------------------------
    const getRelativePath = (fileOrPath) => {
      if (!fileOrPath) return null;

      // CASE 1: already string path
      if (typeof fileOrPath === "string") {
        return fileOrPath.startsWith("/") ? fileOrPath : `/${fileOrPath}`;
      }

      // CASE 2: multer file object
      if (fileOrPath.path) {
        const fullPath = fileOrPath.path.replace(/\\/g, "/");
        const uploadsIndex = fullPath.indexOf("uploads/");
        return uploadsIndex !== -1
          ? `/${fullPath.substring(uploadsIndex)}`
          : `/${fullPath}`;
      }

      return null;
    };

    // -----------------------------
    // 5️⃣ PROCESS MAIN IMAGES
    // -----------------------------
    const imageUrl = req.files?.image
      ? getRelativePath(req.files.image[0])
      : existingProject.imageUrl;

    const logoUrl = req.files?.logo
      ? getRelativePath(req.files.logo[0])
      : existingProject.logoUrl;

    const overviewImageUrl = req.files?.overviewImage
      ? getRelativePath(req.files.overviewImage[0])
      : existingProject.overviewImageUrl;

    const masterPlanImageUrl = req.files?.masterPlanImage
      ? getRelativePath(req.files.masterPlanImage[0])
      : existingProject.masterPlanImageUrl;

    const floorPlanImageUrl = req.files?.floorPlanImage
      ? getRelativePath(req.files.floorPlanImage[0])
      : existingProject.floorPlanImageUrl;

    const buildingImageUrl = req.files?.buildingImage
      ? getRelativePath(req.files.buildingImage[0])
      : existingProject.buildingImageUrl;

    // -----------------------------
    // 6️⃣ GALLERY LOGIC (DELETE + ADD)
    // -----------------------------
    let galleryImages = [...existingProject.galleryImages];

    // DELETE FROM DB
    if (oldImages.length > 0) {
      const deleteImages = oldImages.map((img) => getRelativePath(img));

      galleryImages = galleryImages.filter(
        (img) => !deleteImages.includes(img)
      );
    }

    // ADD NEW FILES
    if (req.files?.gallery?.length > 0) {
      const newGalleryImages = req.files.gallery
        .map((file) => getRelativePath(file))
        .filter(Boolean);

      galleryImages = [...galleryImages, ...newGalleryImages];
    }

    // -----------------------------
    // 7️⃣ DOCUMENTS & VIDEO
    // -----------------------------
    const brochureUrl = req.files?.brochure
      ? getRelativePath(req.files.brochure[0])
      : existingProject.brochureUrl;

    const priceSheetUrl = req.files?.priceSheet
      ? getRelativePath(req.files.priceSheet[0])
      : existingProject.priceSheetUrl;

    let videoFileUrl = existingProject.videoFileUrl;

    // ✅ ONLY when user uploads NEW video
    if (req.files?.video?.length > 0) {
      // 1️⃣ delete OLD video FILE (NOT folder yet)
      if (existingProject.videoUrl) {
        deleteFiles(existingProject.videoUrl);
      }

      // 2️⃣ OPTIONAL: delete folder IF empty
      // (safe cleanup, not mandatory)
      // cleanupEmptyParentFolder(existingProject.videoUrl);

      // 3️⃣ set NEW video path
      videoFileUrl = getRelativePath(req.files.video[0]);
    }

    // -----------------------------
    // 8️⃣ AMENITIES WITH ICONS
    // -----------------------------
    let parsedAmenities = [];

    if (amenities) {
      parsedAmenities = JSON.parse(amenities);
    }

    if (req.files?.amenityIcons && amenityIconIndexes) {
      const indexes = Array.isArray(amenityIconIndexes)
        ? amenityIconIndexes
        : [amenityIconIndexes];

      indexes.forEach((idx, i) => {
        const index = parseInt(idx);
        if (parsedAmenities[index] && req.files.amenityIcons[i]) {
          parsedAmenities[index].icon = getRelativePath(
            req.files.amenityIcons[i]
          );
        }
      });
    }

    // -----------------------------
    // 9️⃣ UPDATE DB
    // -----------------------------
    const finalSlug = slug || projectSlug || existingProject.slug;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title: title || existingProject.title,
        slug: finalSlug,
        tagline: tagline || existingProject.tagline,
        description: description || existingProject.description,
        location: location || existingProject.location,
        address: address || existingProject.address,
        status: status || existingProject.status,
        price: price || existingProject.price,
        area: area || existingProject.area,
        propertyTypes: propertyTypes || existingProject.propertyTypes,
        contactNumber: contactNumber || existingProject.contactNumber,
        imageUrl,
        logoUrl,
        videoUrl: videoFileUrl || existingProject.videoUrl,
        overviewImageUrl,
        masterPlanImageUrl,
        floorPlanImageUrl,
        buildingImageUrl,
        galleryImages,
        brochureUrl,
        priceSheetUrl,
        amenities: parsedAmenities,
        highlights: highlights
          ? JSON.parse(highlights)
          : existingProject.highlights,
        nearbyLocations: nearbyLocations
          ? JSON.parse(nearbyLocations)
          : existingProject.nearbyLocations,
        mapEmbedUrl: mapEmbedUrl || existingProject.mapEmbedUrl,
        isActive: isActive === "true" || isActive === true,
        isFeatured: isFeatured === "true" || isFeatured === true,
        order: order ? parseInt(order) : existingProject.order,
      },
      { new: true, runValidators: true }
    );

    // -----------------------------
    // 🔚 RESPONSE
    // -----------------------------
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("❌ Update Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating project",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // console.log(project)

    if (project.videoUrl) {
      deleteOldFile(project.videoUrl);
    }

    if (project.imageUrl) {
      deleteOldFile(project.imageUrl);
    }

    if (project.overviewImageUrl) {
      deleteOldFile(project.overviewImageUrl);
    }

    if (project.masterPlanImageUrl) {
      deleteOldFile(project.masterPlanImageUrl);
    }

    if (project.floorPlanImageUrl) {
      deleteOldFile(project.floorPlanImageUrl);
    }

    if (project.buildingImageUrl) {
      deleteOldFile(project.buildingImageUrl);
    }

    if (project.brochureUrl) {
      deleteOldFile(project.brochureUrl);
    }

    if (project.priceSheetUrl) {
      deleteOldFile(project.priceSheetUrl);
    }

    if (
      Array.isArray(project.galleryImages) &&
      project.galleryImages.length > 0
    ) {
      console.log("Total images:", project.galleryImages.length);

      project.galleryImages.forEach((img) => {
        if (img) deleteOldFile(img); // ensure value exists
      });
    }

    if (Array.isArray(project.amenities) && project.amenities.length > 0) {
      console.log("Total images:", project.amenities.length);

      project.amenities.forEach((amenite) => {
        if (amenite) deleteOldFile(amenite.icon); // ensure value exists
      });
    }

    console.log(project);

    await Project.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProjectTtile = async (req, res) => {
  try {
    // Fetch only title from DB
    const projectTitle = await Project.find().select("title");

    // If no projects found
    if (!projectTitle || projectTitle.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No project titles found" });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Project titles fetched successfully",
      titles: projectTitle,
    });
  } catch (error) {
    console.error("Error fetching project titles:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

export const toggleProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Toggle value
    project.isActive = !project.isActive;

    const updated = await project.save();

    res.status(200).json({
      success: project.isActive,
      message: `Project ${
        updated.isActive ? "Activated" : "Deactivated"
      } successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling status",
      error,
    });
  }
};
