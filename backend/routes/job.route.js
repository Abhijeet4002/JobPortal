import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, closeJob, reopenJob } from "../controllers/job.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, singleUpload, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/:id/close").post(isAuthenticated, closeJob);
router.route("/:id/reopen").post(isAuthenticated, reopenJob);

export default router;
