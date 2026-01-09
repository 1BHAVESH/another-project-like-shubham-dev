import { useState } from "react";

const CompaniesMenu = () => {
  const [open, setOpen] = useState(false);

  const companies = [
    "Tata Motors",
    "Reliance Industries",
    "Infosys",
    "Wipro",
    "HDFC Bank",
  ];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Companies Button */}
      <button className="px-4 py-2 text-white font-medium hover:text-blue-400">
        Companies
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-zinc-900 text-white rounded-lg shadow-lg border border-zinc-700">
          {companies.map((company, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
            >
              {company}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesMenu;
