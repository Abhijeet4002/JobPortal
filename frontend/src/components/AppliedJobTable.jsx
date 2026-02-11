import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Briefcase, Building2, MapPin, Loader2, FileText, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const AppliedJobTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplied = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
      if (res.data.success) setRows(res.data.application || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchApplied(); }, []);

  const withdraw = async (appId) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/${appId}/withdraw`, {}, { withCredentials: true });
      if (res.data.success) { toast.success('Application withdrawn'); fetchApplied(); }
    } catch (e) { toast.error(e?.response?.data?.message || 'Withdraw failed'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 mt-1">Track the status of your job applications</p>
      </div>

      {rows.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No applications yet</h3>
          <p className="text-gray-400 mt-1 mb-4">Start applying to jobs to see them here</p>
          <Link to="/jobs">
            <Button className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">Browse Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Job info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div className="min-w-0">
                  <Link to={`/description/${r.job?._id}`} className="font-semibold text-gray-900 hover:text-[var(--primary)] transition-colors line-clamp-1">
                    {r.job?.title || 'Untitled'}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                    {r.job?.company?.name && (
                      <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {r.job.company.name}</span>
                    )}
                    {r.job?.location && (
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.job.location}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {r.status}
                </span>
                {r.status !== 'withdrawn' && r.status !== 'accepted' && r.status !== 'rejected' && (
                  <Button variant="outline" size="sm" onClick={() => withdraw(r._id)} className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobTable;
