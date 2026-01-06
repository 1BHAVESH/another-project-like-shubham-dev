import CompanyForm from "@/components/admin/CompanyForm";
import React, { useState } from "react";


const AdminCompany = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <p className="text-white text-xl mb-4">Admin Company</p>

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Company
      </button>

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
