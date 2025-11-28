import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import { FaHeart, FaRegHeart, FaUser, FaCalendar, FaTag } from "react-icons/fa";

export default function PodcastDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const toast = useToast();
  const [podcast, setPodcast] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  
  const [upvotes, setUpvotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);

  useEffect(() => {
    fetch(`/api/podcasts/${id}`)
      .then(r => r.json())
      .then(d => { 
        setPodcast(d); 
        setComments(d.comments || []);
        setUpvotes(d.upvotes?.length || 0);
        if (user && d.upvotes?.includes(user.id)) {
          setIsUpvoted(true);
        }
      })
      .catch(()=>toast.push("Failed to load podcast"));
  }, [id, user]);

  const handleUpvote = async () => {
    if (!token) return toast.error("Please login to upvote");
    
    // Optimistic update
    const originalUpvoted = isUpvoted;
    const originalCount = upvotes;
    
    setIsUpvoted(!isUpvoted);
    setUpvotes(prev => isUpvoted ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/podcasts/${id}/upvote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Sync with server response if needed, but optimistic is usually fine
      // setIsUpvoted(data.upvoted);
    } catch (err) {
      // Revert on error
      setIsUpvoted(originalUpvoted);
      setUpvotes(originalCount);
      toast.error("Upvote failed");
    }
  };

  const postComment = async () => {
    if (!text) return;
    try {
      const res = await fetch(`/api/podcasts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Comment failed");
      setComments((c) => [data.comment, ...c]);
      setText("");
      toast.push("Comment posted");
    } catch (err) {
      toast.push(err.message || "Comment error");
    }
  };

  if (!podcast) return <div className="pt-24 p-6 text-center">Loading...</div>;

  return (
    <section className="pt-24 pb-12 px-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{podcast.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <FaUser className="text-indigo-500" />
                  <span>{podcast.createdBy?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendar className="text-indigo-500" />
                  <span>{new Date(podcast.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaTag className="text-indigo-500" />
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
                    {podcast.category}
                  </span>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden bg-black aspect-video mb-6">
                <ReactPlayer url={podcast.audioUrl} controls width="100%" height="100%" />
              </div>

              <div className="flex items-center justify-between border-t dark:border-gray-700 pt-4">
                <button 
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isUpvoted 
                      ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {isUpvoted ? <FaHeart /> : <FaRegHeart />}
                  <span className="font-semibold">{upvotes}</span>
                </button>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {podcast.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Comments */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-full flex flex-col">
              <h3 className="font-bold text-xl mb-4">Comments ({comments.length})</h3>
              
              {token ? (
                <div className="mb-6">
                  <textarea 
                    value={text} 
                    onChange={(e)=>setText(e.target.value)} 
                    placeholder="Share your thoughts..."
                    className="w-full p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                  ></textarea>
                  <button 
                    onClick={postComment} 
                    disabled={!text.trim()}
                    className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
                  <p className="text-sm text-indigo-800 dark:text-indigo-300">Please login to join the discussion</p>
                </div>
              )}

              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {comments.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet.</p>}
                {comments.map((c) => (
                  <div key={c._id || Math.random()} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-200">{c.userName || "User"}</span>
                      <span className="text-xs text-gray-400">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
