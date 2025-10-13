import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const companyName = req.query.company || "";
        const location = req.query.location || "";
        const jobType = req.query.jobType || "";
        const includeClosed = req.query.includeClosed === 'true';

        const textQuery = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const baseFilters = includeClosed ? {} : { closed: { $ne: true } };

        let jobs = await Job.find({ ...textQuery, ...baseFilters }).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        // Additional in-memory filters using populated company
        if (companyName) {
            jobs = jobs.filter(j => j.company?.name?.toLowerCase().includes(companyName.toLowerCase()));
        }
        if (location) {
            jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(location.toLowerCase()));
        }
        if (jobType) {
            jobs = jobs.filter(j => (j.jobType || '').toLowerCase() === jobType.toLowerCase());
        }
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            populate: { path: "applicant", select: "_id fullname email" }
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const closeJob = async (req, res) => {
    try {
        const adminId = req.id;
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, created_by: adminId });
        if (!job) return res.status(404).json({ message: 'Job not found', success: false });
        job.closed = true;
        await job.save();
        return res.status(200).json({ message: 'Job closed', success: true });
    } catch (e) {
        console.log(e);
    }
}

export const reopenJob = async (req, res) => {
    try {
        const adminId = req.id;
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, created_by: adminId });
        if (!job) return res.status(404).json({ message: 'Job not found', success: false });
        job.closed = false;
        await job.save();
        return res.status(200).json({ message: 'Job reopened', success: true });
    } catch (e) {
        console.log(e);
    }
}