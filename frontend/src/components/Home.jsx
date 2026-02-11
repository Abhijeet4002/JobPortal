import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Search, Briefcase, Building2, Users, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

const stats = [
  { icon: Briefcase, label: 'Active Jobs', value: '10,000+' },
  { icon: Building2, label: 'Companies', value: '2,500+' },
  { icon: Users, label: 'Job Seekers', value: '50,000+' },
  { icon: TrendingUp, label: 'Placements', value: '5,000+' },
]

const features = [
  { icon: Search, title: 'Smart Search', desc: 'Find jobs by keyword, location, company, or type with powerful filters.' },
  { icon: Shield, title: 'Verified Companies', desc: 'All companies are verified to ensure safe and legitimate opportunities.' },
  { icon: Zap, title: 'Instant Apply', desc: 'Apply to jobs with one click. Upload resume or link your profile.' },
]

const categories = ['Technology', 'Marketing', 'Design', 'Finance', 'Engineering', 'Sales', 'Healthcare', 'Education']

const Home = () => {
  const { user } = useSelector(s => s.auth);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero text-white px-6 sm:px-12 py-16 sm:py-24 mb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full"></div>
        </div>
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" /> The #1 Job Portal Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Find Your <br />Dream Job Today
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
            Connect with top companies, discover amazing opportunities, and take the next step in your career journey.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/jobs">
              <Button variant="ghost" className="h-12 px-6 text-base font-semibold rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
                <Search className="w-5 h-5 mr-2" /> Browse Jobs
              </Button>
            </Link>
            {!user && (
              <Link to="/signup">
                <Button className="h-12 px-6 text-base font-semibold rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            {user?.role === 'recruiter' && (
              <Link to="/admin/jobs/create">
                <Button className="h-12 px-6 text-base font-semibold rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
                  Post a Job <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((s, i) => (
          <div key={i} className="card-elevated text-center p-6">
            <s.icon className="w-8 h-8 text-[var(--primary)] mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose JobPortal?</h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">Everything you need to land your next opportunity or find the perfect candidate.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 stagger">
          {features.map((f, i) => (
            <div key={i} className="card-elevated p-8 text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center mx-auto mb-5 group-hover:bg-[var(--primary)] transition-colors">
                <f.icon className="w-7 h-7 text-[var(--primary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-500 mt-2">Explore opportunities across popular industries</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/jobs?q=${cat}`}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="gradient-subtle rounded-3xl p-8 sm:p-12 text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your free account today and join thousands of professionals.</p>
          <div className="flex justify-center gap-3">
            <Link to="/signup">
              <Button className="h-11 px-6 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-gray-300">
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
