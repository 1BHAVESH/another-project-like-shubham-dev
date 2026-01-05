import nodemailer from "nodemailer";
import Contact from "../models/Enquiry.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";
import ExcelEnquiry from "../models/ExcelEnquiry.js";

export const contactSubmit = async (req, res) => {
  const { fullName, email, phone, message, project } = req.body;

  try {
    console.log("📩 Incoming project:", project);

    let finalProject = null;
    let projectDoc = null;

    // -------- VALID PROJECT CASE --------
    if (project && mongoose.Types.ObjectId.isValid(project)) {
      projectDoc = await Project.findById(project).select("title");

      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      finalProject = projectDoc._id;
    }

    // -------- SAVE TO DB --------
    const newContact = await Contact.create({
      fullName,
      email,
      phone,
      message,
      project: finalProject,
    });

    // -------- SEND EMAIL (ONLY IF PROJECT EXISTS) --------
    if (projectDoc) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST_NAME,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${fullName}" <${email}>`,
          to: "1bhaveshjaswani1@gmail.com",
          subject: `Enquiry - ${projectDoc.title}`,
          html: `
            <h3>New Project Enquiry</h3>
            <p><b>Name:</b> ${fullName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Project:</b> ${projectDoc.title}</p>
            <p><b>Message:</b> ${message}</p>
          `,
        });

        console.log("📧 Email sent successfully");
      } catch (mailError) {
        console.error("📧 Email failed:", mailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Your enquiry has been submitted successfully. Our team will contact you soon.",
      data: newContact,
    });
  } catch (error) {
    console.error("Contact Submit Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEnquiry = await Contact.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
        success: false,
      });
    }

    await ExcelEnquiry.deleteOne({ email: deletedEnquiry.email });

    return res.status(200).json({
      message: "Enquiry deleted successfully (Contact + Excel)",
      success: true,
    });
  } catch (error) {
    console.error("Deleted Enquiry Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to delete enquiry",
      success: false,
    });
  }
};
