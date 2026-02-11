import prisma from "../utils/db.js";
import { addId } from "../utils/format.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, companyName } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Resolve company: use companyId if provided, otherwise find/create by companyName
        let resolvedCompanyId = companyId;
        if (!resolvedCompanyId && companyName) {
            let company = await prisma.company.findFirst({
                where: { name: { equals: companyName, mode: 'insensitive' } }
            });
            if (!company) {
                // Upload company logo if provided
                let logoUrl = null;
                if (req.file) {
                    const fileUri = getDataUri(req.file);
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'auto' });
                    logoUrl = cloudResponse.secure_url;
                }
                company = await prisma.company.create({
                    data: { name: companyName, userId, ...(logoUrl ? { logo: logoUrl } : {}) }
                });
            } else if (req.file) {
                // Company exists but user uploaded a new logo — update it
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'auto' });
                await prisma.company.update({ where: { id: company.id }, data: { logo: cloudResponse.secure_url } });
            }
            resolvedCompanyId = company.id;
        }

        if (!resolvedCompanyId) {
            return res.status(400).json({ message: "Company name is required.", success: false });
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                requirements: JSON.stringify(requirements.split(",").map(s => s.trim())),
                salary: Number(salary),
                location,
                jobType,
                experienceLevel: Number(experience),
                position: Number(position),
                companyId: resolvedCompanyId,
                createdById: userId
            }
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job: addId(job),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const companyName = req.query.company || "";
        const location = req.query.location || "";
        const jobType = req.query.jobType || "";
        const includeClosed = req.query.includeClosed === 'true';

        const where = {
            AND: [
                keyword ? {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { description: { contains: keyword, mode: 'insensitive' } },
                    ]
                } : {},
                includeClosed ? {} : { closed: { not: true } },
                location ? { location: { contains: location, mode: 'insensitive' } } : {},
                jobType ? { jobType: { equals: jobType, mode: 'insensitive' } } : {},
                companyName ? { company: { name: { contains: companyName, mode: 'insensitive' } } } : {},
            ]
        };

        const jobs = await prisma.job.findMany({
            where,
            include: { company: true },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            jobs: jobs.map(j => addId(j)),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                applications: {
                    include: {
                        applicant: {
                            select: { id: true, fullname: true, email: true }
                        }
                    }
                }
            }
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        return res.status(200).json({ job: addId(job), success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await prisma.job.findMany({
            where: { createdById: adminId },
            include: { company: true },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({
            jobs: jobs.map(j => addId(j)),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const closeJob = async (req, res) => {
    try {
        const adminId = req.id;
        const jobId = req.params.id;
        const job = await prisma.job.findFirst({ where: { id: jobId, createdById: adminId } });
        if (!job) return res.status(404).json({ message: 'Job not found', success: false });
        await prisma.job.update({ where: { id: jobId }, data: { closed: true } });
        return res.status(200).json({ message: 'Job closed', success: true });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const reopenJob = async (req, res) => {
    try {
        const adminId = req.id;
        const jobId = req.params.id;
        const job = await prisma.job.findFirst({ where: { id: jobId, createdById: adminId } });
        if (!job) return res.status(404).json({ message: 'Job not found', success: false });
        await prisma.job.update({ where: { id: jobId }, data: { closed: false } });
        return res.status(200).json({ message: 'Job reopened', success: true });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}