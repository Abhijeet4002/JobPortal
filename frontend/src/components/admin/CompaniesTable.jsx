import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Building2, Globe, Settings, ExternalLink } from "lucide-react";

const CompaniesTable = () => {
  const { companies, searchText } = useSelector((s) => s.company);
  const filtered = companies.filter((c) => c.name?.toLowerCase().includes(searchText.toLowerCase()));

  if (filtered.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">No companies found</h3>
        <p className="text-gray-400 mt-1">Create your first company to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((c) => (
        <div key={c._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
              {c.logo ? (
                <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-[var(--primary)]" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-900 block">{c.name}</span>
              {c.website ? (
                <a href={c.website} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline inline-flex items-center gap-1 truncate max-w-[200px]">
                  <Globe className="w-3 h-3" /> {c.website.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <span className="text-sm text-gray-400">No website</span>
              )}
            </div>
          </div>
          <Link
            to={`/admin/companies/${c._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            <Settings className="w-4 h-4" /> Setup
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CompaniesTable;
