import React, { useEffect, useRef, useState } from "react";
import axios, { Axios } from "axios";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";

/**
 * Uses your backend:
 * GET  /api/podcasts/:id         -> returns podcast doc (with .comments populated)
 * POST /api/podcasts/:id/comments -> body { text } -> returns created comment object
 * POST /api/podcasts/:id/upvote   -> toggles upvote for current user -> returns updated podcast or updated upvote count
 *
 * Expects comment.user.name to be populated (per your getPodcast).
 */

// const API = process.env.REACT_APP_API_BASE
//   ? `${process.env.REACT_APP_API_BASE.replace(/\/$/, "")}/api/podcasts`
//   : "http://localhost:5000/api/podcasts";

export default function CategoryCard() {
  const [podcast, setPodcast] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const {id}=useParams()

  const audioRef = useRef(null);

  // apply auth header once per mount (axios default)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, []);

  // helper to read upvote count defensively
  const readUpvotes = (p) => {
    if (!p) return 0;
    return p.upvotes ?? p.upvoteCount ?? p.likes ?? (p.stats && p.stats.up) ?? 0;
  };

  // helper to read cover url defensively
  const readCover = (p) => p?.coverImage ?? p?.coverUrl ?? p?.cover ?? "";

  // fetch podcast (full doc with comments)
  const fetchPodcast = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(id)
      const res = await axios.post(`http://localhost:5000/api/podcasts/get`,{id});
      const doc = res.data;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // post comment (optimistic)
  const handleAddComment = async () => {
    const text = (newComment || "").trim();
    if (!text) return;
    setPosting(true);
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const tempComment = {
      _id: tempId,
      id: tempId,
      text,
      user: { _id: "me", name: "You" },
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setComments((p) => [tempComment, ...p]);
    setNewComment("");

    try {
      const res = await axios.post(`${id}/comments`, { text });
      const created = res.data;
      // replace temp with created if server returns object
      setComments((p) => p.map((c) => (c._id === tempId ? created : c)));
      // Optionally refresh podcast stats from server (if comment affects anything)
      // await fetchPodcast();
    } catch (err) {
      console.error("addComment:", err);
      // rollback: remove temp
      setComments((p) => p.filter((c) => c._id !== tempId));
      setNewComment(text); // restore so user can retry
      setError(err.response?.data?.message || err.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  // toggle upvote (optimistic)
  const handleToggleUpvote = async () => {
    if (voting || !podcast) return;
    setVoting(true);
    setError(null);

    const prevPodcast = { ...podcast };
    // optimistic increment (if backend toggles, we don't know state; here we just increment visually)
    const optimisticUp = readUpvotes(podcast) + 1;

    setPodcast((p) => ({ ...p, upvotes: optimisticUp }));

    try {
      const res = await axios.post(`${API}/${id}/upvote`);
      // backend may return full podcast doc or an object with upvotes
      const data = res.data;
      if (data && (data.upvotes || data.upvoteCount || data.stats || data.title)) {
        // looks like full/partial podcast doc
        // prefer full doc if present
        const updatedDoc = data.title ? data : podcast;
        setPodcast((prev) => ({ ...prev, ...updatedDoc }));
      } else if (typeof data.upvotes === "number" || typeof data.up === "number") {
        setPodcast((prev) => ({ ...prev, upvotes: data.upvotes ?? data.up }));
      } else {
        // fallback: refresh whole podcast
        await fetchPodcast();
      }
    } catch (err) {
      console.error("toggleUpvote:", err);
      setError(err.response?.data?.message || err.message || "Failed to upvote");
      // rollback
      setPodcast(prevPodcast);
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg max-w-sm w-full">
      {/* Cover */}
      {cover ? (
        <img src={cover} alt={title} className="w-full h-48 object-cover rounded-md" />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">No cover</div>
      )}

      <h3 className="text-lg font-semibold mt-3">{title}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>

      {/* Audio */}
      {podcast.audioUrl ? (
        <audio ref={audioRef} src={podcast.audioUrl} controls className="mt-3 w-full" />
      ) : null}

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

      {/* Comments (all) */}
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">Comments</div>

        {comments.length === 0 ? (
          <div className="text-sm text-gray-500">No comments yet.</div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-auto pr-2">
            {comments.map((c) => {
              const author = c.user?.name ?? c.user?.email ?? "Anonymous";
              return (
                <div
                  key={c._id ?? c.id}
                  className={`p-2 rounded-md ${c.pending ? "opacity-70 bg-gray-50" : "bg-gray-100"}`}
                >
                  <div className="text-xs font-semibold text-gray-700">
                    {author}
                    <span className="ml-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-800 mt-1">{c.text}</div>
                </div>
              );
            })}
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
  );
}
