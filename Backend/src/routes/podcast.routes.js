import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.middleware.js";
import { listPodcasts, getPodcast, uploadPodcast, addComment, toggleUpvote } from "../controllers/podcast.controller.js";

const upload = multer({ dest: "/tmp/uploads" }); // temp folder - ensure exists on server

const router = express.Router();

router.get("/", listPodcasts);
router.get("/:id", getPodcast);
router.post("/", auth,upload.fields([{ name: "audio", maxCount: 1 }, { name: "cover", maxCount: 1 }]), uploadPodcast);
router.post("/:id/comments", auth, addComment);
router.post("/:id/upvote", auth, toggleUpvote);

export default router;
