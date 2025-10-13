import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { setSearchCompanyByText } from '@/redux/companySlice';

const Browse = () => {
  useGetAllCompanies();
  const dispatch = useDispatch();
  const { companies } = useSelector(s => s.company);
  const [filters, setFilters] = useState({ q: '', location: '' });

  useEffect(() => { dispatch(setSearchCompanyByText(filters.q)); }, [filters.q]);

  const filtered = useMemo(() => {
    return (companies || []).filter(c => {
      const matchName = filters.q ? c.name?.toLowerCase().includes(filters.q.toLowerCase()) : true;
      const matchLoc = filters.location ? (c.location || '').toLowerCase().includes(filters.location.toLowerCase()) : true;
      return matchName && matchLoc;
    });
  }, [companies, filters]);

  const searchRemote = async () => {
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.location) params.location = filters.location;
      const res = await axios.get(`${COMPANY_API_END_POINT}/list`, { params });
      // Render the results from server directly by replacing local list (temporary UI sync)
      // In a fully normalized state, we'd sync to redux; here we just map over filtered
      // by setting a pseudo local copy.
      // For simplicity, we mutate companies via a local state; but to avoid bigger refactors
      // we'll render `remote` below if exists.
      setRemote(res.data.companies || []);
    } catch (e) { /* ignore */ }
  }
  const [remote, setRemote] = useState(null);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search company name" value={filters.q} onChange={e=>setFilters(prev=>({...prev, q: e.target.value}))} />
        <Input placeholder="Filter by location" value={filters.location} onChange={e=>setFilters(prev=>({...prev, location: e.target.value}))} />
        <Button onClick={searchRemote}>Search</Button>
      </div>
      <div className="grid gap-3">
        {(remote ?? filtered).map(c => (
          <div key={c._id} className="border rounded p-4 bg-white">
            <div className="font-semibold">{c.name}</div>
            {c.description && <p className="text-gray-700 mt-1 line-clamp-3">{c.description}</p>}
            <div className="text-sm text-gray-600 mt-2">{c.location || '—'}</div>
          </div>
        ))}
        {(remote ?? filtered).length === 0 && <p className="text-gray-600">No companies match your filters.</p>}
      </div>
    </div>
  );
};

export default Browse;
