
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HiThumbUp,
  HiShare,
  HiDotsVertical,
  HiPencil,
  HiTrash,
  HiEye,
  HiCalendar,
} from "react-icons/hi";
import MainLayout from "../components/Layout/MainLayout";
import Loader from "../components/UI/Loader";
import ConfirmModal from "../components/UI/ConfirmModal";
import VideoCard from "../components/Video/VideoCard";
import VideoPlayer from "../components/Video/VideoPlayer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/ToastContainer";
import {
  getVideoById,
  getAllVideos,
  deleteVideo,
  getVideoStreamUrl,
} from "../api/video";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../api/comment";
import { toggleVideoLike, toggleCommentLike } from "../api/like";
import {
  formatViews,
  timeAgo,
  formatDate,
  getErrorMessage,
} from "../utils/helpers";

const VideoPage = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [editingCommentText, setEditingCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await getVideoById(videoId);
        setVideo(res.data.data);
        // Debug: Check what the thumbnail structure actually looks like
        console.log("Video Data:", res.data.data); 
      } catch (error) {
        addToast(getErrorMessage(error), "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const res = await getVideoComments(videoId, { page: 1, limit: 50 });
        setComments(
          res.data.data.docs ||
          res.data.data.comments ||
          res.data.data ||
          []
        );
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    if (user) fetchComments();
  }, [videoId, user]);

  // Fetch related videos
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await getAllVideos({ page: 1, limit: 8 });
        const videos =
          res.data.data.docs ||
          res.data.data.videos ||
          res.data.data ||
          [];
        setRelatedVideos(videos.filter((v) => v._id !== videoId));
      } catch (error) {
        console.error("Failed to load related videos:", error);
      }
    };
    fetchRelated();
  }, [videoId]);

  // Like video
  const handleLikeVideo = async () => {
    if (!user) {
      addToast("Please login to like videos", "warning");
      return;
    }
    try {
      await toggleVideoLike(videoId);
      setVideo((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.isLiked
          ? prev.likesCount - 1
          : prev.likesCount + 1,
      }));
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    }
  };

  // Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast("Link copied to clipboard!", "success");
  };

  // Delete video
  const handleDeleteVideo = async () => {
    try {
      await deleteVideo(videoId);
      addToast("Video deleted successfully", "success");
      navigate("/");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await addComment(videoId, newComment);
      setComments([res.data.data, ...comments]);
      setNewComment("");
      addToast("Comment added!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      await updateComment(commentId, editingCommentText);
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? { ...c, content: editingCommentText }
            : c
        )
      );
      setEditingCommentId(null);
      addToast("Comment updated!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    }
  };

  // Delete comment
  const handleDeleteComment = async () => {
    try {
      await deleteComment(deleteTargetId);
      setComments(comments.filter((c) => c._id !== deleteTargetId));
      addToast("Comment deleted!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  // Like comment
  const handleLikeComment = async (commentId) => {
    if (!user) {
      addToast("Please login to like comments", "warning");
      return;
    }
    try {
      await toggleCommentLike(commentId);
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked
                ? (c.likesCount || 1) - 1
                : (c.likesCount || 0) + 1,
            }
            : c
        )
      );
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading video..." />
      </MainLayout>
    );
  }

  if (!video) return null;

  const isOwner = user?._id === video.owner?._id;

  // --- FIX: Safely extract thumbnail string ---
  const thumbnailPoster = 
    video.thumbnail?.url || 
    video.thumbnail?.secure_url || 
    (typeof video.thumbnail === 'string' ? video.thumbnail : "");

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="clay-card-no-hover overflow-hidden">
            <VideoPlayer
              src={getVideoStreamUrl(videoId)}
              poster={thumbnailPoster} /* <--- Updated to use safe variable */
              title={video.title}
              onEnded={() => console.log("Video ended")}
            />
          </div>

          {/* Video Info */}
          <div className="clay-card-no-hover p-6">
            <h1
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {video.title}
            </h1>

            {/* Stats & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div
                className="flex items-center gap-4 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="flex items-center gap-1">
                  <HiEye className="w-4 h-4" />
                  {formatViews(video.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <HiCalendar className="w-4 h-4" />
                  {formatDate(video.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={handleLikeVideo}
                  className={`clay-button-secondary !py-2 !px-4 flex items-center gap-2 ${video.isLiked
                      ? "!bg-[var(--accent)] !text-white"
                      : ""
                    }`}
                >
                  <HiThumbUp className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {formatViews(video.likesCount || 0)}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="clay-button-secondary !py-2 !px-4 flex items-center gap-2"
                >
                  <HiShare className="w-5 h-5" />
                </button>

                {/* Owner Options */}
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowOptionsMenu(!showOptionsMenu)
                      }
                      className="clay-button-secondary !p-2 !rounded-full"
                    >
                      <HiDotsVertical className="w-5 h-5" />
                    </button>

                    {showOptionsMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowOptionsMenu(false)}
                        />
                        <div className="clay-dropdown absolute right-0 top-12 w-48 z-50">
                          <Link
                            to={`/video/${videoId}/edit`}
                            className="clay-dropdown-item flex items-center gap-3"
                            onClick={() => setShowOptionsMenu(false)}
                          >
                            <HiPencil className="w-5 h-5" />
                            Edit Video
                          </Link>
                          <button
                            onClick={() => {
                              setDeleteType("video");
                              setDeleteTargetId(videoId);
                              setShowDeleteModal(true);
                              setShowOptionsMenu(false);
                            }}
                            className="clay-dropdown-item flex items-center gap-3 w-full text-left"
                            style={{ color: "var(--danger)" }}
                          >
                            <HiTrash className="w-5 h-5" />
                            Delete Video
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <hr className="clay-divider" />

            {/* Channel Info */}
            <div className="flex items-start justify-between gap-4">
              <Link
                to={`/channel/${video.owner?.username}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <img
                  src={video.owner?.avatar}
                  alt={video.owner?.username}
                  className="clay-avatar w-12 h-12"
                />
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {video.owner?.fullName}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    @{video.owner?.username}
                  </p>
                </div>
              </Link>

              {!isOwner && user && (
                <button className="clay-button !py-2 !px-6">
                  Subscribe
                </button>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <>
                <hr className="clay-divider" />
                <p
                  className="whitespace-pre-wrap"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {video.description}
                </p>
              </>
            )}
          </div>

          {/* Comments Section */}
          <div className="clay-card-no-hover p-6">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              {comments.length} Comments
            </h2>

            {/* Add Comment */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="clay-avatar w-10 h-10 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="clay-input"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setNewComment("")}
                        className="clay-button-secondary !py-2 !px-4 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="clay-button !py-2 !px-4 text-sm"
                        disabled={
                          submittingComment || !newComment.trim()
                        }
                      >
                        {submittingComment ? "Posting..." : "Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p style={{ color: "var(--text-muted)" }}>
                  <Link
                    to="/login"
                    className="font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    Sign in
                  </Link>{" "}
                  to comment
                </p>
              </div>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="clay-skeleton w-10 h-10 !rounded-full" />
                    <div className="flex-1">
                      <div className="clay-skeleton h-3 w-1/4 mb-2" />
                      <div className="clay-skeleton h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p
                className="text-center py-8"
                style={{ color: "var(--text-muted)" }}
              >
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-3 animate-fade-in"
                  >
                    <Link to={`/channel/${comment.owner?.username}`}>
                      <img
                        src={comment.owner?.avatar}
                        alt={comment.owner?.username}
                        className="clay-avatar w-10 h-10 flex-shrink-0"
                      />
                    </Link>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          to={`/channel/${comment.owner?.username}`}
                          className="font-semibold text-sm hover:underline"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {comment.owner?.fullName}
                        </Link>
                        <span
                          className="text-xs"
                          style={{
                            color: "var(--text-muted)",
                          }}
                        >
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div>
                          <input
                            type="text"
                            value={editingCommentText}
                            onChange={(e) =>
                              setEditingCommentText(
                                e.target.value
                              )
                            }
                            className="clay-input mb-2"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setEditingCommentId(null)
                              }
                              className="clay-button-secondary !py-1 !px-3 text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateComment(
                                  comment._id
                                )
                              }
                              className="clay-button !py-1 !px-3 text-sm"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p
                            style={{
                              color: "var(--text-secondary)",
                            }}
                          >
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() =>
                                handleLikeComment(
                                  comment._id
                                )
                              }
                              className={`flex items-center gap-1 text-sm ${comment.isLiked
                                  ? "font-semibold"
                                  : ""
                                }`}
                              style={{
                                color: comment.isLiked
                                  ? "var(--accent)"
                                  : "var(--text-muted)",
                              }}
                            >
                              <HiThumbUp className="w-4 h-4" />
                              {comment.likesCount || 0}
                            </button>

                            {user?._id ===
                              comment.owner?._id && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(
                                        comment._id
                                      );
                                      setEditingCommentText(
                                        comment.content
                                      );
                                    }}
                                    className="text-sm"
                                    style={{
                                      color: "var(--text-muted)",
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteType(
                                        "comment"
                                      );
                                      setDeleteTargetId(
                                        comment._id
                                      );
                                      setShowDeleteModal(
                                        true
                                      );
                                    }}
                                    className="text-sm"
                                    style={{
                                      color: "var(--danger)",
                                    }}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <h3
            className="text-lg font-bold px-2"
            style={{ color: "var(--text-primary)" }}
          >
            Related Videos
          </h3>
          {relatedVideos.map((v) => (
            <div key={v._id} className="animate-fade-in">
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title={
          deleteType === "video"
            ? "Delete Video?"
            : "Delete Comment?"
        }
        message={
          deleteType === "video"
            ? "This action cannot be undone. Your video will be permanently deleted."
            : "Are you sure you want to delete this comment?"
        }
        confirmText="Delete"
        danger
        onConfirm={
          deleteType === "video"
            ? handleDeleteVideo
            : handleDeleteComment
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
      />
    </MainLayout>
  );
};

export default VideoPage;