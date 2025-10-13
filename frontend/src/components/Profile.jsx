import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const Profile = () => {
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ fullname: user?.fullname || '', phoneNumber: user?.phoneNumber || '', bio: user?.profile?.bio || '', skills: (user?.profile?.skills || []).join(',') });
  const [file, setFile] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries({ fullname: form.fullname, phoneNumber: form.phoneNumber, bio: form.bio, skills: form.skills }).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
      if (res.data.success) toast.success('Profile updated');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-4'>User Profile</h2>
      {user?.role === 'student' ? (
        <form onSubmit={onSubmit} className='grid gap-3 max-w-xl'>
          <Input name='fullname' value={form.fullname} onChange={onChange} placeholder='Full name' />
          <Input name='phoneNumber' value={form.phoneNumber} onChange={onChange} placeholder='Phone number' />
          <Input name='bio' value={form.bio} onChange={onChange} placeholder='Bio' />
          <Input name='skills' value={form.skills} onChange={onChange} placeholder='Skills (comma separated)' />
          <Input type='file' accept='application/pdf,image/*' onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          <Button type='submit'>Save</Button>
        </form>
      ) : (
        <div className='space-y-3'>
          <p className='text-gray-700'>Post jobs and manage applicants from your admin dashboard.</p>
          <div className='flex gap-3'>
            <Link to='/admin/jobs' className='text-white bg-[#6A38C2] hover:bg-[#5b30a6] px-4 py-2 rounded-md'>Your Jobs</Link>
            <Link to='/admin/jobs/create' className='text-[#6A38C2] border border-[#6A38C2] px-4 py-2 rounded-md'>Post Job</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile;
