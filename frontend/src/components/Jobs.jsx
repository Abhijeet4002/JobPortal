import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-0">
        <div className="grid md:grid-cols-5 grid-cols-1 gap-2 mb-4">
          <Input placeholder="Keyword (title/desc)" value={q} onChange={(e) => setQ(e.target.value)} />
          <Input placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <select className="border border-gray-300 rounded-md px-3 py-2" value={jobType} onChange={(e)=>setJobType(e.target.value)}>
            <option value="">Any type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          <Button onClick={fetchJobs}>Search</Button>
        </div>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company?.name} • {job.location}</p>
                </div>
                <Link to={`/description/${job._id}`} className="text-[#6A38C2]">View</Link>
              </div>
              <p className="mt-2 text-gray-700 line-clamp-2">{job.description}</p>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-gray-600">No jobs found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
