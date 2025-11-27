import dotenv from "dotenv";
dotenv.config();   // IMPORTANT

import cloudinary from "cloudinary";

console.log("cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("key:", process.env.CLOUDINARY_API_KEY);
console.log("secret:", process.env.CLOUDINARY_API_SECRET);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true
});

export default cloudinary.v2;
