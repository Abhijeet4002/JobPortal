import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Search, MapPin, Building2, Globe, Loader2 } from 'lucide-react';

const Browse = () => {
  useGetAllCompanies();
  const dispatch = useDispatch();
  const { companies } = useSelector(s => s.company);
  const [filters, setFilters] = useState({ q: '', location: '' });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.location) params.location = filters.location;
      const res = await axios.get(`${COMPANY_API_END_POINT}/list`, { params });
      setRemote(res.data.companies || []);
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  }
  const [remote, setRemote] = useState(null);
  const displayList = remote ?? filtered;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Companies</h1>
        <p className="text-gray-500 mt-1">Discover companies hiring right now</p>
      </div>

      {/* Search */}
      <div className="card-elevated p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search company name" value={filters.q} onChange={e => setFilters(prev => ({ ...prev, q: e.target.value }))} className="pl-10" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Filter by location" value={filters.location} onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))} className="pl-10" />
          </div>
          <Button onClick={searchRemote} className="h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold">
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{displayList.length} compan{displayList.length !== 1 ? 'ies' : 'y'} found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {displayList.map(c => (
              <div key={c._id} className="card-elevated p-6 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-[var(--primary)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors">{c.name}</h3>
                    {c.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{c.location}</p>
                    )}
                  </div>
                </div>
                {c.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">{c.description}</p>
                )}
                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] mt-3 font-medium">
                    <Globe className="w-3.5 h-3.5" /> Visit Website
                  </a>
                )}
              </div>
            ))}
            {displayList.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No companies found</h3>
                <p className="text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Browse;
