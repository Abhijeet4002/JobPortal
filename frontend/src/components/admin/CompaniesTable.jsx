import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchText } = useSelector((s) => s.company);
  const filtered = companies.filter((c) => c.name?.toLowerCase().includes(searchText.toLowerCase()));
  return (
    <div className="bg-white border rounded">
      <div className="grid grid-cols-3 font-medium border-b p-3">
        <div>Name</div>
        <div>Website</div>
        <div>Action</div>
      </div>
      {filtered.map((c) => (
        <div key={c._id} className="grid grid-cols-3 p-3 border-b last:border-b-0">
          <div>{c.name}</div>
          <div className="truncate text-blue-600">{c.website || "—"}</div>
          <div>
            <Link className="text-[#6A38C2]" to={`/admin/companies/${c._id}`}>Setup</Link>
          </div>
        </div>
      ))}
      {filtered.length === 0 && <div className="p-3 text-gray-600">No companies found.</div>}
    </div>
  );
};

export default CompaniesTable;
