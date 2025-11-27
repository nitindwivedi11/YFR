import Podcast from "../models/podcast.js";
import Category from "../models/category.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";

export async function listPodcasts(req, res, next) {
  try {
    const q = req.query.q || "";
    const category = req.query.category;
    const filter = { approved: true };
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    const podcasts = await Podcast.find(filter).populate("createdBy", "name email").limit(50).sort({ createdAt: -1 });
    res.json(podcasts);
  } catch (err) { next(err); }
}

export async function getPodcast(req, res, next) {
  try {
    const p = await Podcast.findById(req.params.id).populate("createdBy", "name email").populate("comments.user", "name");
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) { next(err); }
}

export async function uploadPodcast(req, res, next) {
  try {
    const { title, description, category } = req.body;
    const audio = req.files?.audio?.[0];
    const cover = req.files?.cover?.[0];

    if (!audio) return res.status(400).json({ message: "Audio file required" });

    let categoryId = null;
    if (category) {
      const catDoc = await Category.findOne({ name: category });
      if (!catDoc) return res.status(400).json({ message: "Invalid category" });
      categoryId = catDoc._id;
    }

    // Upload audio to Cloudinary as "video" resource type
    const audioResp = await cloudinary.uploader.upload(audio.path, { resource_type: "video" });
    let coverResp = null;
    console.log(audioResp)
    if (cover) coverResp = await cloudinary.uploader.upload(cover.path); 

    // cleanup temporary files
    await fs.unlink(audio.path).catch(()=>{});
    if (cover) await fs.unlink(cover.path).catch(()=>{});

    const podcast = await Podcast.create({
      title,
      description,
      category: categoryId,
      audioUrl: audioResp.secure_url,
      coverImage: coverResp?.secure_url || null,
      createdBy: req.user._id,
      approved: false
    });

    res.status(201).json(podcast);
  } catch (err) { next(err); }
}

export async function addComment(req, res, next) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });
    const p = await Podcast.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Podcast not found" });
    const comment = { user: req.user._id, userName: req.user.name, text };
    p.comments.unshift(comment);
    await p.save();
    res.json({ success: true, comment });
  } catch (err) { next(err); }
}

export async function toggleUpvote(req, res, next) {
  try {
    const p = await Podcast.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Podcast not found" });
    const userId = req.user._id.toString();
    const idx = p.upvotes.findIndex(id => id.toString() === userId);
    if (idx >= 0) {
      p.upvotes.splice(idx, 1);
      await p.save();
      return res.json({ upvoted: false });
    } else {
      p.upvotes.push(req.user._id);
      await p.save();
      return res.json({ upvoted: true });
    }
  } catch (err) { next(err); }
}
