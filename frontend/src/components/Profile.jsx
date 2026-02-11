import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { Avatar, AvatarImage } from './ui/avatar'
import { User, Phone, FileText, Wrench, Upload, Save, Loader2, Briefcase, Plus, Building2, Mail } from 'lucide-react'

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({
    fullname: user?.fullname || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: (user?.profile?.skills || []).join(',')
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries({ fullname: form.fullname, phoneNumber: form.phoneNumber, bio: form.bio, skills: form.skills }).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success('Profile updated successfully');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Profile Header Card */}
      <div className="card-elevated p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-4 ring-[var(--primary-light)]">
              <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{user?.fullname}</h1>
            <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
            <span className="badge badge-primary mt-2 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {user?.role === 'student' ? (
        <div className="card-elevated p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input name="fullname" value={form.fullname} onChange={onChange} placeholder="Your name" className="pl-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="Phone number" className="pl-11" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Bio</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="pl-11 w-full resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Skills</Label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input name="skills" value={form.skills} onChange={onChange} placeholder="React, Node.js, Python (comma separated)" className="pl-11" />
              </div>
              {form.skills && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.skills.split(',').filter(Boolean).map((s, i) => (
                    <span key={i} className="badge badge-primary">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Resume (PDF, DOC, or Image)</Label>
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary-light)] cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : 'Click to upload resume'}
                </span>
                <Input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {user?.profile?.resume && (
                <a href={user.profile.resume} target="_blank" rel="noreferrer" className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium flex items-center gap-1 mt-1">
                  <FileText className="w-3.5 h-3.5" /> Current: {user.profile.resumeOriginalName || 'View Resume'}
                </a>
              )}
            </div>

            {loading ? (
              <Button className="w-full h-12 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold" disabled>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
              </Button>
            ) : (
              <Button type="submit" className="w-full h-12 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold">
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </Button>
            )}
          </form>
        </div>
      ) : (
        <div className="card-elevated p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recruiter Dashboard</h2>
          <p className="text-gray-500 mb-6">Manage your job postings and find the best candidates.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/admin/jobs" className="card p-5 text-center group hover:border-[var(--primary)]">
              <Briefcase className="w-8 h-8 text-[var(--primary)] mx-auto mb-3" />
              <span className="font-semibold text-gray-900 group-hover:text-[var(--primary)]">Your Jobs</span>
            </Link>
            <Link to="/admin/jobs/create" className="card p-5 text-center group hover:border-[var(--primary)]">
              <Plus className="w-8 h-8 text-[var(--primary)] mx-auto mb-3" />
              <span className="font-semibold text-gray-900 group-hover:text-[var(--primary)]">Post Job</span>
            </Link>
            <Link to="/admin/companies" className="card p-5 text-center group hover:border-[var(--primary)]">
              <Building2 className="w-8 h-8 text-[var(--primary)] mx-auto mb-3" />
              <span className="font-semibold text-gray-900 group-hover:text-[var(--primary)]">Companies</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile;
