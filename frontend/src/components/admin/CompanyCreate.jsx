import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const CompanyCreate = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
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
    }
  }

  return (
    <div>
      <div className="max-w-xl mx-auto p-4">
        <form onSubmit={submit} className="bg-white border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Create Company</h2>
          <Input placeholder="Company Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button className="mt-4" type="submit">Create</Button>
        </form>
      </div>
    </div>
  )
}

export default CompanyCreate