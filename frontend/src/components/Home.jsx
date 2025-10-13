import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-2">Welcome to the Job Portal</h1>
      <p className="text-gray-600 mb-6">Find your dream job or the perfect candidate!</p>
      <div className="flex gap-3">
        <Link to="/jobs" className="text-white bg-[#6A38C2] hover:bg-[#5b30a6] px-4 py-2 rounded-md">Browse Jobs</Link>
        <Link to="/browse" className="text-[#6A38C2] border border-[#6A38C2] px-4 py-2 rounded-md">Browse Companies</Link>
      </div>
    </div>
  )
}

export default Home
