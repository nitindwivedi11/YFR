
import podcast from "../models/podcast.js";
import Podcast from "../models/podcast.js";

import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";

export async function listPodcasts(req, res, next) {
  try {
 const cats = await podcast.find()
    res.json(cats);
  } catch (err) { next(err); }
}

export async function getPodcast(req, res, next) {
  try {
    console.log(req.json)
    console.log("wer are here")

    const p = await Podcast.findById(req.body.id).populate("createdBy", "name email").populate("comments.user", "name");
    
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

    // Upload audio to Cloudinary as "video" resource type
    const audioResp = await cloudinary.uploader.upload(audio.path, { resource_type: "video" });
    let coverResp = null;
    
    if (cover) coverResp = await cloudinary.uploader.upload(cover.path); 

    // cleanup temporary files
    await fs.unlink(audio.path).catch(()=>{});
    if (cover) await fs.unlink(cover.path).catch(()=>{});
    console.log("just uploading")
    console.log(req.user)
    const podcast = await Podcast.create({
      title,
      description,
      category: category || "Business", // Default to Business if empty
      audioUrl: audioResp.secure_url,
      coverImage: coverResp?.secure_url || null,
      createdBy: req.user._id,
      approved: false
    });
    console.log("done")

    res.status(201).json(podcast);
  } catch (err) { next(err); }
}
export async function addComment(req, res, next) {
  try {
    const { id, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    // find podcast
    const p = await Podcast.findById(id).populate("comments.user", "name");
    if (!p) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Create comment object
    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    // Add comment to beginning
    p.comments.unshift(comment);

    // Save
    await p.save();

    // Re-populate to get the user name
    await p.populate("comments.user", "name");

    // Newest comment is the first
    const created = p.comments[0];

    return res.json({
      success: true,
      comment: created,             // return the created comment
      comments: p.comments,         // full updated list
      count: p.comments.length,     // number of comments
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
}
export async function toggleUpvote(req, res, next) {
  try {
    console.log("asdf")
    const {id}=req.body
    const p = await Podcast.findById(id);
    if (!p) return res.status(404).json({ message: "Podcast not found" });
    const userId = req.user._id.toString();
    const idx = p.upvotes.findIndex(id => id.toString() === userId);
    console.log("asdfasdf")
    if (idx >= 0) {
      p.upvotes.splice(idx, 1);
      await p.save();
      return res.json({ 
  upvoted: false,
  upvotes: p.upvotes.length 
});
    } else {
      p.upvotes.push(req.user._id);
      await p.save();
      return res.json({ 
  upvoted: true,
  upvotes: p.upvotes.length 
});
    }
  } catch (err) { 
    console.log(err)
    next(err); }
}
