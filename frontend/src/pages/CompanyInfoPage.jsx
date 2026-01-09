import { useGetDataQuery } from "@/redux/features/shubamdevApi";
import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building2,
  ArrowLeft,
} from "lucide-react";
import CompanyBannerImg from "@/components/CompanyBannerImag";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";

const CompanyDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetDataQuery({
    url: `/company/${id}`,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  const company = data?.company;

  const projects = data?.company?.projects;

  console.log("AWAWAWAWAWAW = ", projects);

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-center text-gray-600">Company not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <CompanyBannerImg />
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              to="/company"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Companies</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={`${API_URL}${company.logo}`}
                  alt={company.name}
                  className="w-32 h-32 rounded-xl object-cover bg-gray-100 border-2 border-gray-200"
                />
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {company.name}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {company.address?.city}, {company.address?.state},{" "}
                      {company.address?.country}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      company.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                    }`}
                  >
                    {company.status}
                  </span>
                </div>

                {/* Short Description */}
                {company.shortDescription && (
                  <p className="text-lg text-gray-700 mb-4">
                    {company.shortDescription}
                  </p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-gray-900">
                      {company.projects?.length || 0}
                    </span>{" "}
                    Projects
                  </div>
                  {company.establishedOn && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      Established {formatDate(company.establishedOn)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {company.description ||
                    company.shortDescription ||
                    "No description available."}
                </p>
              </div>

              {/* Projects Section */}
              {company.projects && company.projects.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Projects ({company.projects.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                      <div
                        key={project._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-amber-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">
                            {project.title}
                          </span>
                          <Link
                            to={`/project/${project._id}`}
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {/* Phone */}
                  {company.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <a
                          href={`tel:${company.phone}`}
                          className="text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {company.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {company.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <a
                          href={`mailto:${company.email}`}
                          className="text-gray-900 hover:text-amber-600 transition-colors break-all"
                        >
                          {company.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {company.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Website</p>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 hover:text-amber-600 transition-colors break-all"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {company.address && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Address
                  </h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-700 leading-relaxed">
                      {company.address.street && (
                        <p>{company.address.street}</p>
                      )}
                      <p>
                        {company.address.city}, {company.address.state}
                      </p>
                      <p>
                        {company.address.country} - {company.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(company.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(company.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetailPage;
