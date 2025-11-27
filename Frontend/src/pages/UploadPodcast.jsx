import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

export default function UploadPodcast() {
  const { token } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    // if (!audioFile) return console.log("file is required")
    // setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", desc);
    fd.append("category", category);
    fd.append("audio", audioFile);
    if (cover) fd.append("cover", cover);
    console.log(fd)

    try {
      const res = await fetch("/api/podcasts", {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        body: fd,
      });
      console.log(res)
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      toast.push("Podcast uploaded — pending admin approval");
      setTitle(""); setDesc(""); setCategory(""); setAudioFile(null); setCover(null);
    } catch (err) {
      console.log(err)
      // toast.push(err.message || "Upload error");
    } finally { setLoading(false); }
  };

  return (
    <section className="pt-24 pb-12 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Upload Podcast</h1>
        <form onSubmit={submit} className="space-y-4">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-3 border rounded bg-transparent" />
          <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Short description" className="w-full p-3 border rounded bg-transparent" />
          <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category (name or id)" className="w-full p-3 border rounded bg-transparent" />
          <div>
            <label className="block mb-1">Audio file (mp3)</label>
            <input type="file" accept="audio/*" onChange={(e)=>setAudioFile(e.target.files[0])}/>
          </div>
          <div>
            <label className="block mb-1">Cover image (optional)</label>
            <input type="file" accept="image/*" onChange={(e)=>setCover(e.target.files[0])}/>
          </div>
          <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? "Uploading..." : "Upload Podcast"}</button>
        </form>
      </div>
    </section>
  );
}
