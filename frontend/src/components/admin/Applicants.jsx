import React, { useEffect } from 'react'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);

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
        <div>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-between my-5'>
                    <h1 className='font-bold text-xl'>Applicants {applicants?.applications?.length || 0}</h1>
                    <div className='flex gap-2'>
                        <Button onClick={downloadZip} variant='outline'>Download Resumes (ZIP)</Button>
                        <Button onClick={closeJob}>Close Job</Button>
                    </div>
                </div>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants