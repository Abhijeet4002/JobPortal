import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Plus, Search, Building2 } from 'lucide-react'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                    <p className="text-gray-500 mt-1">Manage your registered companies</p>
                </div>
                <Button onClick={() => navigate("/admin/companies/create")} className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2">
                    <Plus className="w-4 h-4" /> New Company
                </Button>
            </div>

            <div className="card p-4 mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none"
                        placeholder="Search companies by name..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            </div>

            <CompaniesTable />
        </div>
    )
}

export default Companies