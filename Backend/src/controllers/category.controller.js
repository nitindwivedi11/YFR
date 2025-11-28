import Category from "../models/category.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";

export async function listCategories(req, res, next) {
  try {
    const cats = await Category.find({ status: "approved" }).sort({ name: 1 });
    res.json(cats);
  } catch (err) { next(err); }
}

export async function requestCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    // If already exists and approved, return conflict
    const existing = await Category.findOne({ name });
    if (existing) {
      if (existing.status === "approved") return res.status(409).json({ message: "Category already exists" });
    }

    let imageUrl = null;
    if (req.file) {
      const imgResp = await cloudinary.uploader.upload(req.file.path);
      imageUrl = imgResp.secure_url;
      await fs.unlink(req.file.path).catch(()=>{});
    }

    const cat = await Category.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      image: imageUrl,
      createdBy: req.user._id,
      status: "pending"
    });
    console.log(cat)

    res.status(201).json(cat);
  } catch (err) { next(err); }
}
