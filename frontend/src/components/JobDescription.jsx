import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Briefcase, MapPin, DollarSign, Clock, Users, ArrowLeft, Upload, LinkIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const JobDescription = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
        if (res.data.success) setJob(res.data.job);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
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
    const nonWithdrawn = mine.find((a) => a.status !== 'withdrawn');
    if (nonWithdrawn) return nonWithdrawn;
    return mine.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }, [job, user]);

  const apply = async () => {
    try {
      setApplying(true);
      const fd = new FormData();
      if (resume) fd.append('file', resume);
      if (resumeLink) fd.append('resumeLink', resumeLink);
      const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
      if (res.data.success) toast.success(res.data.message);
      const ref = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
      if (ref.data.success) setJob(ref.data.job);
      setResume(null);
      setResumeLink("");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-24">
        <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Job not found</h3>
        <Link to="/jobs" className="text-[var(--primary)] mt-2 inline-block">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--primary)] mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>

      {/* Job Card */}
      <div className="card-elevated overflow-hidden">
        {/* Header */}
        <div className="gradient-hero p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
              <p className="text-white/80 mt-1">{job.company?.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            {job.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </span>
            )}
            {job.jobType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5" /> {job.jobType}
              </span>
            )}
            {job.salary && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                <DollarSign className="w-3.5 h-3.5" /> {job.salary.toLocaleString()}
              </span>
            )}
            {job.position && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                <Users className="w-3.5 h-3.5" /> {job.position} position{job.position > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Requirements */}
          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience */}
          {job.experienceLevel !== undefined && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
              <p className="text-gray-600">{job.experienceLevel} year{job.experienceLevel !== 1 ? 's' : ''} required</p>
            </div>
          )}

          {/* Application Section */}
          {job.closed ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">This job is no longer accepting applications</span>
            </div>
          ) : myApplication && myApplication.status !== 'withdrawn' ? (
            <div className="p-5 rounded-xl bg-green-50 border border-green-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <div>
                    <span className="font-semibold text-green-800">Application submitted</span>
                    <p className="text-sm text-green-600 mt-0.5">Status: <span className="capitalize font-medium">{myApplication.status}</span></p>
                  </div>
                </div>
                <Button variant="outline" onClick={withdraw} className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                  Withdraw
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">
                {myApplication && myApplication.status === 'withdrawn' ? 'Reapply to this job' : 'Apply for this position'}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-[var(--primary)] cursor-pointer transition-all">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {resume ? resume.name : 'Upload resume (PDF, DOC, Image)'}
                  </span>
                  <input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*" onChange={(e) => setResume(e.target.files?.[0] || null)} className="hidden" />
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    placeholder="Or paste resume link (Google Drive, etc.)"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                  />
                </div>
                <Button
                  onClick={apply}
                  disabled={applying}
                  className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold"
                >
                  {applying ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying...</>
                  ) : (
                    myApplication && myApplication.status === 'withdrawn' ? 'Reapply' : 'Submit Application'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
