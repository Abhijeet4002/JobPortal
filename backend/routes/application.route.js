import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, downloadAllResumes, withdrawApplication } from "../controllers/application.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, singleUpload, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/:id/resumes.zip").get(isAuthenticated, downloadAllResumes);
router.route("/:id/withdraw").post(isAuthenticated, withdrawApplication);
 

export default router;
