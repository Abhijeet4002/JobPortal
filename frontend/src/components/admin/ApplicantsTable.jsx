import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, FileText, ExternalLink, Users } from 'lucide-react';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const ApplicantsTable = () => {
  const { applicants } = useSelector((s) => s.application);
  const rows = applicants?.applications || [];

  if (rows.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">No applicants yet</h3>
        <p className="text-gray-400 mt-1">Applicants will appear here once someone applies</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((a) => (
        <div key={a._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-900 block">{a.applicant?.fullname || 'Unknown'}</span>
              <span className="text-sm text-gray-500 inline-flex items-center gap-1">
                <Mail className="w-3 h-3" /> {a.applicant?.email || '—'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${statusColors[a.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {a.status}
            </span>

            {a.resumeUrl && (
              <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors">
                <FileText className="w-3.5 h-3.5" /> Resume
              </a>
            )}
            {a.resumeLink && (
              <a href={a.resumeLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Link
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicantsTable;
