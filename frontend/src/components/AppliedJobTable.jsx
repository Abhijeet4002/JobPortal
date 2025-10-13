import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { Button } from "./ui/button";
import { toast } from "sonner";

const AppliedJobTable = () => {
  const [rows, setRows] = useState([]);
  const fetchApplied = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
      if (res.data.success) setRows(res.data.application || []);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { fetchApplied(); }, []);

  const withdraw = async (appId) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/${appId}/withdraw`, {}, { withCredentials: true });
      if (res.data.success) { toast.success('Application withdrawn'); fetchApplied(); }
    } catch (e) { toast.error(e?.response?.data?.message || 'Withdraw failed'); }
  }

  return (
    <div className="bg-white border rounded">
      <div className="grid grid-cols-5 font-medium border-b p-3">
        <div>Title</div>
        <div>Company</div>
        <div>Location</div>
        <div>Status</div>
        <div>Action</div>
      </div>
      {rows.map((r) => (
        <div key={r._id} className="grid grid-cols-5 p-3 border-b last:border-b-0 items-center">
          <div>{r.job?.title}</div>
          <div>{r.job?.company?.name}</div>
          <div>{r.job?.location}</div>
          <div className="capitalize">{r.status}</div>
          <div>
            {r.status !== 'withdrawn' && r.status !== 'accepted' && (
              <Button variant='outline' onClick={()=>withdraw(r._id)}>Withdraw</Button>
            )}
          </div>
        </div>
      ))}
      {rows.length === 0 && <div className="p-3 text-gray-600">No applications yet.</div>}
    </div>
  );
};

export default AppliedJobTable;
