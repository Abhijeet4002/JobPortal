import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { ArrowLeft, Building2, Loader2 } from 'lucide-react'

const CompanyCreate = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName: name },
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/admin/companies')
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to register company')
    } finally { setLoading(false) }
  }

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      <Link to="/admin/companies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--primary)] mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to companies
      </Link>

      <div className="card-elevated overflow-hidden">
        <div className="gradient-hero p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Create Company</h1>
              <p className="text-white/70 text-sm">Register a new company to start posting jobs</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Building2 className="w-4 h-4 text-gray-400" /> Company Name
            </label>
            <Input placeholder="e.g. Acme Corporation" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : 'Create Company'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CompanyCreate