import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Search, MapPin, Building2, Briefcase, Clock, DollarSign, ChevronRight, Loader2 } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || "");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (q) params.keyword = q;
      if (company) params.company = company;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      const res = await axios.get(`${JOB_API_END_POINT}/get`, {
        params,
        withCredentials: true,
      });
      if (res.data.success) setJobs(res.data.jobs || []);
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.error("Please login to view jobs");
        navigate("/login");
        return;
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchJobs();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
        <p className="text-gray-500 mt-1">Discover your next career opportunity</p>
      </div>

      {/* Search Filters */}
      <form onSubmit={handleSearch} className="card-elevated p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Job title or keyword" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="pl-10" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" />
          </div>
          <select
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Any type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          <Button type="submit" className="h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold">
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
          <div className="grid gap-4 stagger">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/description/${job._id}`}
                className="card-elevated p-5 flex items-start gap-4 group cursor-pointer"
              >
                {/* Company logo placeholder */}
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company?.name}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--primary)] transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {job.location && (
                      <span className="badge badge-gray">
                        <MapPin className="w-3 h-3 mr-1" /> {job.location}
                      </span>
                    )}
                    {job.jobType && (
                      <span className="badge badge-primary">
                        <Clock className="w-3 h-3 mr-1" /> {job.jobType}
                      </span>
                    )}
                    {job.salary && (
                      <span className="badge badge-success">
                        <DollarSign className="w-3 h-3 mr-1" /> {job.salary.toLocaleString()}
                      </span>
                    )}
                    {job.position && (
                      <span className="badge badge-warning">{job.position} position{job.position > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No jobs found</h3>
                <p className="text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Jobs;
