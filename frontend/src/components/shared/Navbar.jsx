import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Briefcase, Building2, Plus, Menu, X, Sun, Moon } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useTheme } from '@/hooks/useTheme'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { dark, toggle: toggleTheme } = useTheme();

    const isActive = (path) => location.pathname === path;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                try { localStorage.removeItem('persist:root'); } catch {}
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            dispatch(setUser(null));
            try { localStorage.removeItem('persist:root'); } catch {}
            navigate("/");
            toast.error(error?.response?.data?.message || 'Logout failed, cleared local session');
        }
    }

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            onClick={() => setMobileOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(to)
                    ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            {children}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 bg-[var(--nav-bg)] backdrop-blur-lg border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Job<span className="text-[var(--primary)]">Portal</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <NavLink to="/admin/companies">Companies</NavLink>
                                <NavLink to="/admin/jobs">Jobs</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/jobs">Jobs</NavLink>
                                <NavLink to="/browse">Browse</NavLink>
                            </>
                        )}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="outline" className="rounded-lg border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 font-medium">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--primary-light)] transition-all">
                                        <Avatar className="w-9 h-9 ring-2 ring-gray-100">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        </Avatar>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-0 rounded-xl border border-[var(--border-color)] shadow-xl bg-[var(--surface)]" align="end">
                                    {/* Profile header */}
                                    <div className="p-4 border-b border-[var(--border-color)]">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-11 h-11">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{user?.fullname}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        {user?.profile?.bio && (
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{user.profile.bio}</p>
                                        )}
                                    </div>
                                    {/* Menu items */}
                                    <div className="p-2">
                                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <User2 className="w-4 h-4 text-gray-400" />
                                            View Profile
                                        </Link>
                                        {user.role === 'recruiter' && (
                                            <>
                                                <Link to="/admin/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    Your Jobs
                                                </Link>
                                                <Link to="/admin/jobs/create" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <Plus className="w-4 h-4 text-gray-400" />
                                                    Post Job
                                                </Link>
                                                <Link to="/admin/companies" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <Building2 className="w-4 h-4 text-gray-400" />
                                                    Companies
                                                </Link>
                                            </>
                                        )}
                                        {user.role === 'student' && (
                                            <Link to="/applied" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                My Applications
                                            </Link>
                                        )}
                                    </div>
                                    {/* Logout */}
                                    <div className="p-2 border-t border-[var(--border-color)]">
                                        <button
                                            onClick={logoutHandler}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-[var(--primary-light)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Mobile toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-gray-100 animate-fade-in">
                        <nav className="flex flex-col gap-1">
                            {user && user.role === 'recruiter' ? (
                                <>
                                    <NavLink to="/admin/companies">Companies</NavLink>
                                    <NavLink to="/admin/jobs">Jobs</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/">Home</NavLink>
                                    <NavLink to="/jobs">Jobs</NavLink>
                                    <NavLink to="/browse">Browse</NavLink>
                                </>
                            )}
                            {!user && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className="w-full rounded-lg">Sign In</Button>
                                    </Link>
                                    <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                                        <Button className="w-full rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar