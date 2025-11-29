import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";

export default function CategoryCard() {
  const [podcast, setPodcast] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const audioRef = useRef(null);

  // apply token once
  useEffect(() => {
    const token = localStorage.getItem("yfr_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, []);

  // Read upvotes safely
  const readUpvotes = (p) => {
    if (!p) return 0;
    return p.upvotes ?? p.upvoteCount ?? 0;
  };

  // Read cover safely
  const readCover = (p) => p?.coverImage ?? p?.coverUrl ?? p?.cover ?? "";

  // 🔥 Fetch Podcast (using your backend route)
  const fetchPodcast = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/podcasts/get",
        { id }    // backend wants id in body
      );
      console.log(res)
      const doc = res.data;
      doc.upvotes=doc.upvotes.length
      setPodcast(doc);
      setComments(Array.isArray(doc.comments) ? doc.comments : []);
    } catch (err) {
      console.error("fetchPodcast:", err);
      setError(err.response?.data?.message || err.message || "Failed to load podcast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcast();
  }, [id]);

  // 🔥 Add Comment (your backend: POST /get/comments)
const handleAddComment = async () => {
  const text = newComment.trim();
  if (!text) return;

  setPosting(true);
  setError(null);

  const tempId = "tmp-" + Date.now();
  const tempComment = {
    _id: tempId,
    text,
    user: { name: "You" },
    createdAt: new Date().toISOString(),
    pending: true,
  };

  setComments((prev) => [tempComment, ...prev]);
  setNewComment("");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/podcasts/get/comments",
      { id, text }
    );

    // REAL COMMENT FROM BACKEND
    const { comment, comments: updatedComments } = res.data;

    // replace full list (ensures populated user + valid date)
    setComments(updatedComments);

  } catch (err) {
    console.error("addComment:", err);
    setComments((prev) => prev.filter((c) => c._id !== tempId));
    setNewComment(text);
    setError("Failed to post comment");
  } finally {
    setPosting(false);
  }
};

  // 🔥 Toggle Upvote (your backend: POST /get/upvote)
  const handleToggleUpvote = async () => {
  if (voting || !podcast) return;

  setVoting(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/podcasts/get/upvote",
      { id }
    );

    setPodcast((prev) => ({
      ...prev,
      upvotes: res.data.upvotes,   // set EXACT count from backend
    }));
  } catch (err) {
    console.error(err);
    setError("Failed to upvote");
  } finally {
    setVoting(false);
  }
};
  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error && !podcast) return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  if (!podcast) return <div className="p-4">Podcast not found</div>;

  const upvoteCount = readUpvotes(podcast);
  const cover = readCover(podcast);
  const title = podcast.title ?? podcast.name ?? "Untitled";
  const description = podcast.description ?? podcast.summary ?? "";

  return (

    
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg max-w-sm w-full">
    
    {/* Cover */}
    {cover ? (
      <img src={cover} alt={title} className="w-full h-48 object-cover rounded-md" />
    ) : (
      <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
        No cover
      </div>
    )}

    <h3 className="text-lg font-semibold mt-3">{title}</h3>
    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>

    {/* Audio */}
    {podcast.audioUrl && (
      <audio ref={audioRef} src={podcast.audioUrl} controls className="mt-3 w-full" />
    )}

    {/* Actions */}
    <div className="flex items-center justify-between mt-3">
      <button
        onClick={handleToggleUpvote}
        disabled={voting}
        className="flex items-center gap-2 text-indigo-600 hover:opacity-80"
      >
        <ThumbsUp size={18} />
        <span>{upvoteCount}</span>
      </button>

      <div className="flex items-center gap-2 text-gray-600">
        <MessageCircle size={16} />
        <span>{comments.length} comments</span>
      </div>
    </div>

    {/* Comments */}
    <div className="mt-4">
      <div className="text-sm font-semibold mb-2">Comments</div>

      {comments.length === 0 ? (
        <div className="text-sm text-gray-500">No comments yet.</div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-auto pr-2">
          {comments.map((c, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${c.pending ? "opacity-70 bg-gray-50" : "bg-gray-100"}`}
            >
              <div className="text-xs font-semibold text-gray-700">
                {c.user?.name || "Anonymous"}
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-800 mt-1">{c.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-md p-2 mt-3 text-sm"
        rows={2}
        placeholder="Write a comment..."
        disabled={posting}
      />

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleAddComment}
          disabled={posting}
          className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post"}
        </button>

        {error && <div className="text-xs text-red-500">{error}</div>}
      </div>
    </div>
  </div>
</div>

  );
}
