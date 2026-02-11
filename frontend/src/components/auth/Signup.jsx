import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Briefcase, GraduationCap, Upload } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) {
            return toast.error('Please select a role');
        }
        if (!input.file) {
            return toast.error('Please upload a profile image');
        }
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Signup failed');
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join JobPortal and start your journey</p>
                </div>

                {/* Card */}
                <form onSubmit={submitHandler} className="card-elevated p-8 space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeEventHandler}
                                placeholder="John Doe"
                                className="pl-11"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="you@example.com"
                                className="pl-11"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone & Password row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="9876543210"
                                    className="pl-11"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Min 6 characters"
                                    className="pl-11"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">I am a</Label>
                        <RadioGroup className="grid grid-cols-2 gap-3">
                            <label
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    input.role === 'student'
                                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                                        : 'border-[var(--border-color)] hover:border-gray-300 bg-[var(--surface)]'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="hidden"
                                />
                                <GraduationCap className={`w-5 h-5 ${input.role === 'student' ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                                <span className={`font-medium ${input.role === 'student' ? 'text-[var(--primary)]' : 'text-gray-600'}`}>Student</span>
                            </label>
                            <label
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    input.role === 'recruiter'
                                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                                        : 'border-[var(--border-color)] hover:border-gray-300 bg-[var(--surface)]'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="hidden"
                                />
                                <Briefcase className={`w-5 h-5 ${input.role === 'recruiter' ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                                <span className={`font-medium ${input.role === 'recruiter' ? 'text-[var(--primary)]' : 'text-gray-600'}`}>Recruiter</span>
                            </label>
                        </RadioGroup>
                    </div>

                    {/* Profile Photo */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Profile Photo</Label>
                        <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary-light)] cursor-pointer transition-all">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                {input.file ? input.file.name : 'Click to upload profile image'}
                            </span>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    {loading ? (
                        <Button className="w-full h-12 text-base font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white" disabled>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">
                            Create Account
                        </Button>
                    )}

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-[var(--surface)] px-4 text-sm text-gray-400">or</span></div>
                    </div>

                    {/* Footer link */}
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Signup