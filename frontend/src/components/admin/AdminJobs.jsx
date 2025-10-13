import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ company: '', location: '', status: 'open' });
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
      if (res.data.success) setJobs(res.data.jobs || []);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => { fetchJobs(); }, []);

  const filtered = useMemo(() => {
    return (jobs || []).filter(j => {
      const matchCompany = filters.company ? (j.company?.name || '').toLowerCase().includes(filters.company.toLowerCase()) : true;
      const matchLoc = filters.location ? (j.location || '').toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchStatus = filters.status === 'all' ? true : (filters.status === 'open' ? !j.closed : !!j.closed);
      return matchCompany && matchLoc && matchStatus;
    });
  }, [jobs, filters]);

  const closeJob = async (id) => {
    try { await axios.post(`${JOB_API_END_POINT}/${id}/close`, {}, { withCredentials: true }); fetchJobs(); } catch {}
  }
  const reopenJob = async (id) => {
    try { await axios.post(`${JOB_API_END_POINT}/${id}/reopen`, {}, { withCredentials: true }); fetchJobs(); } catch {}
  }

  return (
    <div>
  <div className="max-w-7xl mx-auto p-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Jobs</h2>
          <div className='flex items-center gap-2'>
            <input className='border rounded px-2 py-1' placeholder='Company' value={filters.company} onChange={(e)=>setFilters(p=>({...p, company: e.target.value}))} />
            <input className='border rounded px-2 py-1' placeholder='Location' value={filters.location} onChange={(e)=>setFilters(p=>({...p, location: e.target.value}))} />
            <select className='border rounded px-2 py-1' value={filters.status} onChange={(e)=>setFilters(p=>({...p, status: e.target.value}))}>
              <option value='open'>Open</option>
              <option value='closed'>Closed</option>
              <option value='all'>All</option>
            </select>
            <Link to="/admin/jobs/create"><Button>Post Job</Button></Link>
          </div>
        </div>
        <div className="grid gap-3">
          {filtered.map((j) => (
            <div key={j._id} className="border rounded p-4 bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium flex items-center gap-2">{j.title} {j.closed && <span className='text-xs px-2 py-0.5 bg-gray-200 rounded'>Closed</span>}</div>
                  <div className="text-sm text-gray-600">{j.company?.name} • {j.location}</div>
                </div>
                <Link to={`/admin/jobs/${j._id}/applicants`} className="text-[#6A38C2]">Applicants</Link>
              </div>
              <div className='mt-2'>
                {j.closed ? (
                  <Button variant='outline' onClick={()=>reopenJob(j._id)}>Reopen</Button>
                ) : (
                  <Button variant='outline' onClick={()=>closeJob(j._id)}>Close</Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>No jobs match your filters.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;