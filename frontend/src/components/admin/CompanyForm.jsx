import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Upload } from "lucide-react";
import {
  useCreateDataMutation,
  useUpdateDataMutation,
} from "@/redux/features/adminApi";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";

const CompanyForm = ({ onCancel, company, isEditing, isEdit }) => {
  // console.log(company);

  console.log(isEdit);

  const [createData] = useCreateDataMutation();
  const [updateData, { isLoading }] = useUpdateDataMutation();
  const [logoPreview, setLogoPreview] = useState(company?.logo || null);
  const [selectedLogo, setSelectedLogo] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: company?.name || "",
      logo: company?.logo || "",
      shortDescription: company?.shortDescription || "",
      description: company?.description || "",
      email: company?.email || "",
      phone: company?.phone || "",
      address: {
        street: company?.address?.street || "",
        city: company?.address?.city || "",
        state: company?.address?.state || "",
        country: company?.address?.country || "",
        pincode: company?.address?.pincode || "",
      },
      website: company?.website || "",
      establishedOn: company?.establishedOn || "",
      status: company?.status || "active",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .transform((value) => value?.trim())
        .min(2, "Name must be at least 2 characters")
        .required("Company name is required"),

      shortDescription: Yup.string()
        .trim()
        .strict(true)
        .matches(/\S/, "Spaces only are not allowed")
        .min(5, "Min 5 characters")
        .max(100, "Max 100 characters")
        .required("Short description is required"),

      description: Yup.string()
        .trim()
        .strict(true)
        .matches(/\S/, "Spaces only are not allowed")
        .min(10, "Min 10 characters")
        .required("Description is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      phone: Yup.string()
        .matches(/^\d{10,}$/, "Enter valid phone number")
        .required("Phone is required"),

      address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
        pincode: Yup.string()
          .matches(/^\d{6}$/, "Enter 6 digit pincode")
          .required("Pincode is required"),
      }),

      website: Yup.string().url("Invalid website URL").nullable(),

      establishedOn: Yup.date().required("Date required"),

      status: Yup.string().oneOf(["active", "inactive"]),
    }),

    onSubmit: (values) => {
      console.log(values);
      // alert("Company " + (isEditing ? "Updated" : "Created") + " Successfully!");
      onCancel();
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSelectedLogo(null);
    formik.setFieldValue("logo", "");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    await formik.submitForm();

    if (Object.keys(formik.errors).length > 0) return;

    const formData = new FormData();

    formData.append("name", formik.values.name);
    formData.append("email", formik.values.email);
    formData.append("phone", formik.values.phone);
    formData.append("shortDescription", formik.values.shortDescription);
    formData.append("description", formik.values.description);
    formData.append("website", formik.values.website);
    formData.append("establishedOn", formik.values.establishedOn);
    formData.append("status", formik.values.status);

    formData.append("street", formik.values.address.street);
    formData.append("city", formik.values.address.city);
    formData.append("state", formik.values.address.state);
    formData.append("country", formik.values.address.country);
    formData.append("pincode", formik.values.address.pincode);

    // CREATE MODE

    if (!isEdit) {
      if (!selectedLogo) {
        alert("Logo required");
        return;
      }

      formData.append("logo", selectedLogo);

      try {
        await createData({
          url: "/company",
          body: formData,
          tag: "Company",
        }).unwrap();

        onCancel();
      } catch (err) {
        console.log(err);
        alert("Create failed");
      }

      return;
    }

    // EDIT MODE

    if (selectedLogo) {
      formData.append("logo", selectedLogo);
      formData.append("oldImage", company.logo);
    }

    try {
      formData.append("slug", company.slug);
     const respone =  await updateData({
        url: `/company/${company._id}`,
        body: formData,
        tag: "Company",
      }).unwrap();

      onCancel();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-lg max-w-xl mx-auto max-h-[70vh] overflow-y-auto relative">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? "Edit Company" : "Add New Company"}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#d4af37]">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                {...formik.getFieldProps("name")}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                placeholder="Enter company name"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...formik.getFieldProps("email")}
                type="email"
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                placeholder="company@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                {...formik.getFieldProps("phone")}
                type="tel"
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                placeholder="Enter phone number"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Website</label>
              <input
                {...formik.getFieldProps("website")}
                type="url"
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                placeholder="https://example.com"
              />
              {formik.touched.website && formik.errors.website && (
                <p className="text-red-500 text-sm">{formik.errors.website}</p>
              )}
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#d4af37]">Logo</h3>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm text-zinc-300">Company Logo</label>
            {logoPreview ? (
              <div className="relative inline-block">
                <img
                  src={selectedLogo ? logoPreview : `${API_URL}${logoPreview}`}
                  alt="Logo Preview"
                  className="w-32 h-32 object-contain rounded-lg border border-zinc-700 bg-zinc-800 p-2"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-1 right-[391px] p-1 bg-red-500 rounded-full text-white hover:bg-red-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <span className="text-zinc-400 text-xs">Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            )}
            {formik.touched.logo && formik.errors.logo && (
              <p className="text-red-500 text-sm">{formik.errors.logo}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#d4af37]">Description</h3>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              {...formik.getFieldProps("shortDescription")}
              className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              placeholder="Brief company description (max 100 characters)"
              maxLength={100}
            />
            <div className="flex justify-between items-center">
              {formik.touched.shortDescription &&
                formik.errors.shortDescription && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.shortDescription}
                  </p>
                )}
              <p className="text-xs text-zinc-400 ml-auto">
                {formik.values.shortDescription?.length || 0}/100
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Company Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...formik.getFieldProps("description")}
              rows={4}
              className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37] resize-none"
              placeholder="Enter detailed company description"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#d4af37]">
            Address Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["street", "city", "state", "country", "pincode"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm text-zinc-300 capitalize">
                  {field} <span className="text-red-500">*</span>
                </label>
                <input
                  {...formik.getFieldProps(`address.${field}`)}
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  placeholder={`Enter ${field}`}
                />
                {formik.touched.address?.[field] &&
                  formik.errors.address?.[field] && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.address[field]}
                    </p>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Other Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#d4af37]">
            Other Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Established On <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...formik.getFieldProps("establishedOn")}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
              {formik.touched.establishedOn && formik.errors.establishedOn && (
                <p className="text-red-500 text-sm">
                  {formik.errors.establishedOn}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Status</label>
              <select
                {...formik.getFieldProps("status")}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky -bottom-6 bg-zinc-900 pt-4 border-t border-zinc-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleFormSubmit}
            className="px-6 py-2 rounded-lg bg-[#d4af37] text-black font-medium hover:bg-[#c4a137] transition-colors cursor-pointer"
          >
            {isEdit ? "Update Company" : "Create Company"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
