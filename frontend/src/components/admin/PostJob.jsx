import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Briefcase, FileText, ListChecks, DollarSign, MapPin, Clock, Award, Users, Building2, Loader2, ImagePlus } from 'lucide-react'

const PostJob = () => {
  const [loading, setLoading] = useState(false)
  const [companyLogo, setCompanyLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', salary: '', location: '', jobType: '', experience: '', position: '', companyName: ''
  })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (companyLogo) formData.append('file', companyLogo)
      const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      if (res.data.success) { toast.success(res.data.message); navigate('/admin/jobs') }
    } catch (e) { toast.error(e?.response?.data?.message || 'Failed to post job') }
    finally { setLoading(false) }
  }
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCompanyLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const Field = ({ icon: Icon, label, children }) => (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        <Icon className="w-4 h-4 text-gray-400" /> {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--primary)] mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>

      <div className="card-elevated overflow-hidden">
        <div className="gradient-hero p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Post a New Job</h1>
              <p className="text-white/70 text-sm">Fill in the details below to create a job listing</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <Field icon={Briefcase} label="Job Title">
            <Input name="title" placeholder="e.g. Senior Frontend Developer" value={form.title} onChange={onChange} className="rounded-xl" required />
          </Field>

          <Field icon={FileText} label="Description">
            <textarea name="description" placeholder="Describe the role, responsibilities, and what makes it exciting..." value={form.description} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none h-24 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none" required />
          </Field>

          <Field icon={ListChecks} label="Requirements">
            <Input name="requirements" placeholder="React, Node.js, TypeScript (comma separated)" value={form.requirements} onChange={onChange} className="rounded-xl" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={DollarSign} label="Salary">
              <Input name="salary" type="number" placeholder="e.g. 80000" value={form.salary} onChange={onChange} className="rounded-xl" />
            </Field>
            <Field icon={Users} label="Positions">
              <Input name="position" type="number" placeholder="e.g. 3" value={form.position} onChange={onChange} className="rounded-xl" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={MapPin} label="Location">
              <Input name="location" placeholder="e.g. San Francisco, CA" value={form.location} onChange={onChange} className="rounded-xl" />
            </Field>
            <Field icon={Clock} label="Job Type">
              <Input name="jobType" placeholder="e.g. Full-time" value={form.jobType} onChange={onChange} className="rounded-xl" />
            </Field>
          </div>

          <Field icon={Award} label="Experience (years)">
            <Input name="experience" type="number" placeholder="e.g. 3" value={form.experience} onChange={onChange} className="rounded-xl" />
          </Field>

          <Field icon={Building2} label="Company Name">
            <Input name="companyName" placeholder="e.g. Google, Microsoft" value={form.companyName} onChange={onChange} className="rounded-xl" required />
            <p className="text-xs text-gray-400 mt-1">If this company doesn't exist yet, it will be created automatically.</p>
          </Field>

          <Field icon={ImagePlus} label="Company Logo (optional)">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                <ImagePlus className="w-4 h-4" />
                {companyLogo ? 'Change image' : 'Upload logo'}
                <input type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
              </label>
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
              )}
            </div>
          </Field>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold mt-2">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...</> : 'Post Job'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default PostJob