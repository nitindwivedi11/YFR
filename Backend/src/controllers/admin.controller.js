import Podcast from "../models/podcast.js";
import Category from "../models/category.js";

export async function listPendingPodcasts(req, res, next) {
  try {
    const pending = await Podcast.find({ approved: false }).populate("createdBy", "name email");
    res.json(pending);
  } catch (err) { next(err); }
}

export async function approvePodcast(req, res, next) {
  try {
    const p = await Podcast.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    p.approved = true;
    await p.save();
    res.json({ ok: true, podcast: p });
  } catch (err) { next(err); }
}

export async function listPendingCategories(req, res, next) {
  try {
    const pending = await Category.find({ status: "pending" }).populate("createdBy", "name email");
    res.json(pending);
  } catch (err) { next(err); }
}

export async function approveCategory(req, res, next) {
  try {
    const c = await Category.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });
    c.status = "approved";
    await c.save();
    res.json({ ok: true, category: c });
  } catch (err) { next(err); }
}
