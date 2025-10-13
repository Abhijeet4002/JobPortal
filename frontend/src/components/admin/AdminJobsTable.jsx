import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminJobsTable = () => {
  const { adminJobs, searchText } = useSelector((s) => s.job);
  const filtered = adminJobs.filter((j) => j.title?.toLowerCase().includes((searchText||"").toLowerCase()));
  return (
    <div className="bg-white border rounded">
      <div className="grid grid-cols-4 font-medium border-b p-3">
        <div>Title</div>
        <div>Company</div>
        <div>Location</div>
        <div>Action</div>
      </div>
      {filtered.map((j) => (
        <div key={j._id} className="grid grid-cols-4 p-3 border-b last:border-b-0">
          <div>{j.title}</div>
          <div>{j.company?.name}</div>
          <div>{j.location}</div>
          <div>
            <Link to={`/admin/jobs/${j._id}/applicants`} className="text-[#6A38C2]">Applicants</Link>
          </div>
        </div>
      ))}
      {filtered.length === 0 && <div className="p-3 text-gray-600">No jobs</div>}
    </div>
  );
};

export default AdminJobsTable;
