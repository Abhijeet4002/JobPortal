import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const PostJob = () => {
  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', salary: '', location: '', jobType: '', experience: '', position: '', companyId: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true })
        if (res.data.success) setCompanies(res.data.companies || [])
      } catch (e) { console.error(e) }
    }
    run()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/post`, form, { withCredentials: true })
      if (res.data.success) { toast.success(res.data.message); navigate('/admin/jobs') }
    } catch (e) { toast.error(e?.response?.data?.message || 'Failed to post job') }
  }
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div>
      <div className='max-w-2xl mx-auto p-4'>
        <form onSubmit={submit} className='bg-white border rounded p-4 grid gap-3'>
          <Input name='title' placeholder='Title' value={form.title} onChange={onChange} />
          <Input name='description' placeholder='Description' value={form.description} onChange={onChange} />
          <Input name='requirements' placeholder='Requirements (comma separated)' value={form.requirements} onChange={onChange} />
          <div className='grid grid-cols-2 gap-3'>
            <Input name='salary' type='number' placeholder='Salary' value={form.salary} onChange={onChange} />
            <Input name='position' type='number' placeholder='Positions' value={form.position} onChange={onChange} />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <Input name='location' placeholder='Location' value={form.location} onChange={onChange} />
            <Input name='jobType' placeholder='Job Type (Full-time)' value={form.jobType} onChange={onChange} />
          </div>
          <Input name='experience' type='number' placeholder='Experience (years)' value={form.experience} onChange={onChange} />
          <select name='companyId' value={form.companyId} onChange={onChange} className='border rounded px-3 py-2'>
            <option value=''>Select company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <Button type='submit'>Post Job</Button>
        </form>
      </div>
    </div>
  )
}

export default PostJob