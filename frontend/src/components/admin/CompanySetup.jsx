import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, Image } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: null
        })
    }, [singleCompany]);

    const Field = ({ icon: Icon, label, children }) => (
        <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Icon className="w-4 h-4 text-gray-400" /> {label}
            </label>
            {children}
        </div>
    );

    return (
        <div className="animate-fade-in max-w-xl mx-auto">
            <Link to="/admin/companies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--primary)] mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to companies
            </Link>

            <div className="card-elevated overflow-hidden">
                <div className="gradient-hero p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            {singleCompany.logo ? (
                                <img src={singleCompany.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                                <Building2 className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Company Setup</h1>
                            <p className="text-white/70 text-sm">Update your company information</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler} className="p-6 space-y-4">
                    <Field icon={Building2} label="Company Name">
                        <Input type="text" name="name" value={input.name} onChange={changeEventHandler} className="rounded-xl" />
                    </Field>

                    <Field icon={FileText} label="Description">
                        <Textarea
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            placeholder="Describe the company (mission, products, culture, benefits, etc.)"
                            className="rounded-xl resize-none h-28"
                        />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field icon={Globe} label="Website">
                            <Input type="text" name="website" value={input.website} onChange={changeEventHandler} placeholder="https://example.com" className="rounded-xl" />
                        </Field>
                        <Field icon={MapPin} label="Location">
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} placeholder="e.g. New York, NY" className="rounded-xl" />
                        </Field>
                    </div>

                    <Field icon={Image} label="Logo">
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-[var(--primary)] cursor-pointer transition-all">
                            <Image className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                                {input.file ? input.file.name : 'Upload company logo'}
                            </span>
                            <input type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
                        </label>
                    </Field>

                    <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold mt-2">
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Update Company'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CompanySetup
