import AdminCompanyCard from "@/components/admin/AdminCompanyCard";
import CompanyForm from "@/components/admin/CompanyForm";
import { useGetDataQuery } from "@/redux/features/adminApi";
import React, { useState } from "react";

const AdminCompany = () => {
  const { data, isLoading } = useGetDataQuery({
    url: "/company",
    tag: "Company",
  });
  const [open, setOpen] = useState(false);

  if (isLoading) return <h1>Wait...</h1>;

  console.log("Data: ", data);

  const companies = data?.companies;

  console.log("compnies Data: ", companies);

  return (
    <div className="p-6">
      

      {/* 👉 Button ko right side le jane ke liye */}
      <div className="flex justify-between">
        <p className="text-white text-xl mb-4">Admin Company</p>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded"
        >
          Add Company
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies.map((company) => (
          <AdminCompanyCard
            key={company._id}
            company={company}
            logo={company.logo}
            name={company.name}
            totalProjects={company.totalProjects}
            status={company.status}
            onStatusChange={(value) =>
              console.log("Status Changed =>", company._id, value)
            }
            onEdit={() => console.log("Edit", company._id)}
            onDelete={() => console.log("Delete", company._id)}
          />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-y-auto">
          <div className=" p-8 rounded-xl w-full max-w-2xl  ">
            <div className="flex justify-end items-center mb-6 bg-black">
              {/* <h2 className="text-white text-xl font-semibold">
                Create Company
              </h2> */}

              <button
                onClick={() => setOpen(false)}
                className="text-white cursor-pointer lg:mr-5 lg:mt-10 text-2xl leading-none"
              >
                ✖
              </button>
            </div>

            <CompanyForm onCancel={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompany;
