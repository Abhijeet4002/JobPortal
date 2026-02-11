import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { Plus, Search, MapPin, Building2, Users, Lock, Unlock, Loader2, Briefcase, Filter } from 'lucide-react'

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ company: '', location: '', status: 'open' });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
      if (res.data.success) setJobs(res.data.jobs || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Jobs</h1>
          <p className="text-gray-500 mt-1">{jobs.length} total job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/admin/jobs/create">
          <Button className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2">
            <Plus className="w-4 h-4" /> Post New Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-500">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[140px]">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none" placeholder="Company" value={filters.company} onChange={(e) => setFilters(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div className="relative flex-1 min-w-[140px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none" placeholder="Location" value={filters.location} onChange={(e) => setFilters(p => ({ ...p, location: e.target.value }))} />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:border-[var(--primary)] outline-none" value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No jobs match your filters</h3>
          <p className="text-gray-400 mt-1">Try changing your filter criteria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((j) => (
            <div key={j._id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${j.closed ? 'bg-gray-100' : 'bg-[var(--primary)]/10'}`}>
                    <Briefcase className={`w-5 h-5 ${j.closed ? 'text-gray-400' : 'text-[var(--primary)]'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{j.title}</span>
                      {j.closed && <span className="badge badge-gray text-xs">Closed</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {j.company?.name}</span>
                      {j.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {j.location}</span>}
                      {j.applications && <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {j.applications.length} applicant{j.applications.length !== 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/admin/jobs/${j._id}/applicants`}>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                      <Users className="w-3.5 h-3.5" /> Applicants
                    </Button>
                  </Link>
                  {j.closed ? (
                    <Button variant="outline" size="sm" onClick={() => reopenJob(j._id)} className="rounded-xl text-xs gap-1 border-green-200 text-green-600 hover:bg-green-50">
                      <Unlock className="w-3.5 h-3.5" /> Reopen
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => closeJob(j._id)} className="rounded-xl text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50">
                      <Lock className="w-3.5 h-3.5" /> Close
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobs;