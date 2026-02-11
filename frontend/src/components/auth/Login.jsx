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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, Briefcase, GraduationCap } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) {
            return toast.error('Please select a role');
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Login failed');
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
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 mt-2">Sign in to continue to JobPortal</p>
                </div>

                {/* Card */}
                <form onSubmit={submitHandler} className="card-elevated p-8 space-y-5">
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

                    {/* Password */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className="pl-11"
                                required
                            />
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

                    {/* Submit */}
                    {loading ? (
                        <Button className="w-full h-12 text-base font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white" disabled>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">
                            Sign In
                        </Button>
                    )}

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-[var(--surface)] px-4 text-sm text-gray-400">or</span></div>
                    </div>

                    {/* Footer link */}
                    <p className="text-center text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">Create account</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login