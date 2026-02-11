import React, { useEffect } from 'react'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { ArrowLeft, Download, Lock, Users } from 'lucide-react';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);

    const downloadZip = async () => {
        try {
            window.location.href = `${APPLICATION_API_END_POINT}/${params.id}/resumes.zip`;
        } catch (e) { toast.error('Download failed'); }
    }
    const closeJob = async () => {
        try {
            const res = await axios.post(`${JOB_API_END_POINT}/${params.id}/close`, {}, { withCredentials: true });
            if (res.data.success) toast.success('Job closed');
        } catch (e) { toast.error(e?.response?.data?.message || 'Failed to close'); }
    }

    return (
        <div className="animate-fade-in">
            <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--primary)] mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to jobs
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-[var(--primary)]" />
                        Applicants
                        <span className="text-lg font-normal text-gray-400">({applicants?.applications?.length || 0})</span>
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={downloadZip} variant="outline" className="rounded-xl gap-2">
                        <Download className="w-4 h-4" /> Download Resumes
                    </Button>
                    <Button onClick={closeJob} className="rounded-xl bg-red-600 hover:bg-red-700 text-white gap-2">
                        <Lock className="w-4 h-4" /> Close Job
                    </Button>
                </div>
            </div>

            <ApplicantsTable />
        </div>
    )
}

export default Applicants