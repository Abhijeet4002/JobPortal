import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import archiver from "archiver";
import https from "https";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId, status: { $ne: 'withdrawn' } });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
    const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        if (job.closed) {
            return res.status(400).json({ message: 'Job is closed', success: false });
        }
    // Optional resume upload/link
        let resumeUrl, resumeOriginalName;
    let resumeLink = req.body?.resumeLink;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const upload = await cloudinary.uploader.upload(fileUri.content);
            resumeUrl = upload.secure_url;
            resumeOriginalName = req.file.originalname;
        }

        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            ...(resumeUrl ? { resumeUrl, resumeOriginalName } : {}),
            ...(resumeLink ? { resumeLink } : {})
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

// Download all resumes for a job as a ZIP streamed to the client
export const downloadAllResumes = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate('applications');
        if (!job) return res.status(404).json({ message: 'Job not found', success: false });

        const resumes = (job.applications || []).filter(a => a.resumeUrl);
        if (resumes.length === 0) return res.status(400).json({ message: 'No resumes to download', success: false });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="job-${jobId}-resumes.zip"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', err => res.status(500).end());
        archive.pipe(res);

        // Fetch each file and append to the archive
        for (const app of resumes) {
            await new Promise((resolve, reject) => {
                https.get(app.resumeUrl, (fileRes) => {
                    const filename = app.resumeOriginalName || `resume-${app._id}.pdf`;
                    archive.append(fileRes, { name: filename });
                    fileRes.on('end', resolve);
                    fileRes.on('error', reject);
                }).on('error', reject);
            });
        }

        archive.finalize();
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Failed to build ZIP', success: false });
    }
}

// Withdraw application by applicant (student)
export const withdrawApplication = async (req, res) => {
    try {
        const userId = req.id;
        const applicationId = req.params.id;
        const application = await Application.findOne({ _id: applicationId, applicant: userId });
        if (!application) return res.status(404).json({ message: 'Application not found', success: false });
        if (application.status === 'accepted') return res.status(400).json({ message: 'Cannot withdraw an accepted application', success: false });
        application.status = 'withdrawn';
        await application.save();
        return res.status(200).json({ message: 'Application withdrawn', success: true });
    } catch (e) {
        console.log(e);
    }
}