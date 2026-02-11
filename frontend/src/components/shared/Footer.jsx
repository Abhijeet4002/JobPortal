import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border-color)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Job<span className="text-[var(--primary)]">Portal</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connecting talented professionals with amazing opportunities worldwide.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">For Job Seekers</h3>
            <ul className="space-y-2.5">
              <li><Link to="/jobs" className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">Browse Jobs</Link></li>
              <li><Link to="/browse" className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">Companies</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">For Employers</h3>
            <ul className="space-y-2.5">
              <li><Link to="/admin/jobs/create" className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">Post a Job</Link></li>
              <li><Link to="/admin/companies" className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">Manage Companies</Link></li>
              <li><Link to="/admin/jobs" className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">Manage Jobs</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] flex items-center justify-center text-gray-500 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z"></path></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] flex items-center justify-center text-gray-500 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z"></path></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] flex items-center justify-center text-gray-500 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;