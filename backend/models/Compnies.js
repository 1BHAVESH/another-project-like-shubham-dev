import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    logo: {
      type: String,   //  image url
      default: "",
    },

    shortDescription:{
        type: String,
      default: "",
    },
     slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    website: {
      type: String,
    },

    establishedOn: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

   
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    createdBy: {
      type: String,
     
    },
  },
  { timestamps: true }
);

export const Company =  mongoose.model("Company", companySchema);
