import React from 'react';
import { useSelector } from 'react-redux';

const ApplicantsTable = () => {
  const { applicants } = useSelector((s) => s.application);
  const rows = applicants?.applications || [];
  return (
    <div className="bg-white border rounded">
      <div className="grid grid-cols-5 font-medium border-b p-3">
        <div>Name</div>
        <div>Email</div>
        <div>Status</div>
        <div>Resume</div>
        <div>Link</div>
      </div>
      {rows.map((a) => (
        <div key={a._id} className="grid grid-cols-5 p-3 border-b last:border-b-0">
          <div>{a.applicant?.fullname}</div>
          <div>{a.applicant?.email}</div>
          <div className="capitalize">{a.status}</div>
          <div>{a.resumeUrl ? <a className='text-[#6A38C2]' href={a.resumeUrl} target='_blank' rel='noreferrer'>View</a> : '—'}</div>
          <div>{a.resumeLink ? <a className='text-[#6A38C2]' href={a.resumeLink} target='_blank' rel='noreferrer'>Open</a> : '—'}</div>
        </div>
      ))}
      {rows.length === 0 && <div className="p-3 text-gray-600">No applicants</div>}
    </div>
  );
};

export default ApplicantsTable;
