import prisma from "../utils/db.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import archiver from "archiver";
import https from "https";
import { addId, formatUser } from "../utils/format.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }
        // Check for existing non-withdrawn application
        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId,
                applicantId: userId,
                status: { not: 'withdrawn' }
            }
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        if (job.closed) {
            return res.status(400).json({ message: 'Job is closed', success: false });
        }

        let resumeUrl, resumeOriginalName;
        let resumeLink = req.body?.resumeLink;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const upload = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: 'auto'
            });
            resumeUrl = upload.secure_url;
            resumeOriginalName = req.file.originalname;
        }

        await prisma.application.create({
            data: {
                jobId,
                applicantId: userId,
                ...(resumeUrl ? { resumeUrl, resumeOriginalName } : {}),
                ...(resumeLink ? { resumeLink } : {})
            }
        });

        // No need to push to job.applications — Prisma manages the relation via foreign key
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await prisma.application.findMany({
            where: { applicantId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    include: { company: true }
                }
            }
        });

        return res.status(200).json({
            application: applications.map(app => addId(app)),
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                applications: {
                    orderBy: { createdAt: 'desc' },
                    include: { applicant: true }
                }
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        // Format: add _id to job and applications, formatUser for applicants (profile nesting)
        const formatted = {
            ...job,
            _id: job.id,
            applications: (job.applications || []).map(app => ({
                ...app,
                _id: app.id,
                applicant: app.applicant ? formatUser(app.applicant) : null
            }))
        };

        return res.status(200).json({
            job: formatted,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        const application = await prisma.application.findUnique({ where: { id: applicationId } });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        await prisma.application.update({
            where: { id: applicationId },
            data: { status: status.toLowerCase() }
        });

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const downloadAllResumes = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { applications: true }
        });
        if (!job) return res.status(404).json({ message: 'Job not found', success: false });

        const resumes = (job.applications || []).filter(a => a.resumeUrl);
        if (resumes.length === 0) return res.status(400).json({ message: 'No resumes to download', success: false });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="job-${jobId}-resumes.zip"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', err => res.status(500).end());
        archive.pipe(res);

        for (const app of resumes) {
            await new Promise((resolve, reject) => {
                https.get(app.resumeUrl, (fileRes) => {
                    const filename = app.resumeOriginalName || `resume-${app.id}.pdf`;
                    archive.append(fileRes, { name: filename });
                    fileRes.on('end', resolve);
                    fileRes.on('error', reject);
                }).on('error', reject);
            });
        }

        archive.finalize();
    } catch (e) {
        console.log(e);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to build ZIP', success: false });
        }
    }
}

export const withdrawApplication = async (req, res) => {
    try {
        const userId = req.id;
        const applicationId = req.params.id;
        const application = await prisma.application.findFirst({
            where: { id: applicationId, applicantId: userId }
        });
        if (!application) return res.status(404).json({ message: 'Application not found', success: false });
        if (application.status === 'accepted') return res.status(400).json({ message: 'Cannot withdraw an accepted application', success: false });
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: 'withdrawn' }
        });
        return res.status(200).json({ message: 'Application withdrawn', success: true });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}