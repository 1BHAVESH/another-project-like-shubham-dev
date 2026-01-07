import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import CompanyForm from "./CompanyForm";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3008/";

const AdminCompanyCard = ({
  company,
  logo,
  name,
  totalProjects,
  status = true,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [openForm, setOpenForm] = useState(false);

  const edit = true

  return (
    <>
      <div className="block max-w-sm p-6 border border-default rounded-xl border-gray-500 shadow-xs">
        {/* Company Logo */}
        <img
          src={`${API_URL}${logo}`}
          alt={name}
          className="w-82 h-32 rounded-md object-cover border border-neutral-700"
        />

        {/* Company Name */}
        <h2 className="text-white mt-6 mb-2 text-xl font-semibold  ">{name}</h2>

        {/* Status & Switch */}
        <div className="flex items-center mt-3 mb-2 gap-3">
          <Badge className={status ? "bg-green-600" : "bg-red-600"}>
            {status ? "Active" : "Inactive"}
          </Badge>

          <Switch
            checked={status}
            onCheckedChange={onStatusChange}
            className={
              status
                ? "data-[state=checked]:bg-green-500"
                : "data-[state=unchecked]:bg-red-500"
            }
          />
        </div>

        {/* Total Projects */}
        <p className="text-gray-400 text-sm mt-1">
          Total Projects: <span className="text-white">{5}</span>
        </p>

        {/* Buttons Row */}
        <div className="w-full flex justify-between mt-3">
          <Button
            onClick={() => setOpenForm(!openForm)}
            className="bg-blue-500 cursor-pointer  hover:bg-blue-600"
          >
            Edit
          </Button>

          <Button
            onClick={onDelete}
            className="bg-red-500 cursor-pointer hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>

      {openForm && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 text-white p-6 rounded-lg max-h-[100vh] ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Company</h2>

              <button
                onClick={() => setOpenForm(false)}
                className="text-white text-2xl leading-none"
              >
                ✖
              </button>
            </div>

            <CompanyForm
              company={company}
              isEdit={edit}
              onCancel={() => setOpenForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCompanyCard;
