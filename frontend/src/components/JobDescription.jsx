import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const JobDescription = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
        if (res.data.success) setJob(res.data.job);
      } catch (e) {
        console.error(e);
      }
    };
    fetchJob();
  }, [id]);

  const [resume, setResume] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const myApplication = useMemo(() => {
    if (!user?._id) return null;
    const appsAll = Array.isArray(job?.applications) ? job.applications : [];
    const mine = appsAll.filter((a) => (a?.applicant === user._id) || (a?.applicant?._id === user._id));
    if (mine.length === 0) return null;
    // Prefer a non-withdrawn application; otherwise take the most recent
    const nonWithdrawn = mine.find((a) => a.status !== 'withdrawn');
    if (nonWithdrawn) return nonWithdrawn;
    // Fallback: latest by createdAt
    return mine.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))[0];
  }, [job, user]);
  const apply = async () => {
    try {
  const fd = new FormData();
      if (resume) fd.append('file', resume);
  if (resumeLink) fd.append('resumeLink', resumeLink);
      const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
  if (res.data.success) toast.success(res.data.message);
      // refresh job to update applications
      const ref = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
      if (ref.data.success) setJob(ref.data.job);
  // reset inputs
  setResume(null);
  setResumeLink("");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to apply");
    }
  };

  const withdraw = async () => {
    try {
      if (!myApplication?._id) return;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/${myApplication._id}/withdraw`, {}, { withCredentials: true });
      if (res.data.success) toast.success('Application withdrawn');
      const ref = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
      if (ref.data.success) setJob(ref.data.job);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Withdraw failed');
    }
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto p-0">
        {!job ? (
          <p>Loading…</p>
        ) : (
          <div className="bg-white border rounded p-6">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company?.name} • {job.location}</p>
            <p className="mt-4 whitespace-pre-wrap">{job.description}</p>
            {Array.isArray(job.requirements) && (
              <ul className="list-disc pl-5 mt-3 text-gray-700">
                {job.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
            {/* Applied state / Withdraw / Reapply */}
            {myApplication && myApplication.status !== 'withdrawn' ? (
              <div className="mt-6 p-3 border rounded bg-gray-50 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="font-medium">You have already applied.</span>
                  <span className="ml-2 text-sm text-gray-600">Status: {myApplication.status}</span>
                </div>
                <Button variant="outline" onClick={withdraw}>Withdraw application</Button>
              </div>
            ) : (
              <div className="mt-6 flex gap-3 items-center flex-wrap">
                <input type="file" accept="application/pdf,image/*" onChange={(e)=>setResume(e.target.files?.[0]||null)} />
                <input type="url" placeholder="Resume link (Google Drive, etc.)" className="border border-gray-300 rounded-md px-3 py-2" value={resumeLink} onChange={(e)=>setResumeLink(e.target.value)} />
                <Button onClick={apply}>{myApplication && myApplication.status === 'withdrawn' ? 'Reapply' : 'Apply'}</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescription;
