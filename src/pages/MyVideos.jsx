import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiPencil,
  HiTrash,
  HiEye,
  HiEyeOff,
  HiPlus,
  HiThumbUp,
} from "react-icons/hi";
import MainLayout from "../components/Layout/MainLayout";
import Loader from "../components/UI/Loader";
import EmptyState from "../components/UI/EmptyState";
import ConfirmModal from "../components/UI/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/ToastContainer";
import { getAllVideos, deleteVideo, togglePublishStatus } from "../api/video";
import { formatViews, timeAgo, formatDuration, getErrorMessage } from "../utils/helpers";

const MyVideos = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await getAllVideos({
          userId: user._id,
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          sortType: "desc",
        });
        const vids = res.data.data.docs || res.data.data.videos || res.data.data || [];
        setVideos(vids);
      } catch (error) {
        addToast(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMyVideos();
  }, [user]);

  const handleTogglePublish = async (videoId) => {
    try {
      await togglePublishStatus(videoId);
      setVideos(
        videos.map((v) =>
          v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
        )
      );
      addToast("Publish status updated!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVideo(deleteTargetId);
      setVideos(videos.filter((v) => v._id !== deleteTargetId));
      addToast("Video deleted!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading your videos..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              My Videos
            </h1>
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>
              {videos.length} videos uploaded
            </p>
          </div>

          <Link to="/upload" className="clay-button flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Upload New
          </Link>
        </div>

        {/* Videos */}
        {videos.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="No videos yet"
            description="Start sharing your content with the world!"
            action={
              <Link to="/upload" className="clay-button">
                Upload Your First Video
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="clay-card-no-hover p-4 flex flex-col sm:flex-row gap-4 animate-fade-in"
              >
                {/* Thumbnail */}
                <Link
                  to={`/video/${video._id}`}
                  className="flex-shrink-0 w-full sm:w-64 aspect-video rounded-2xl overflow-hidden relative group"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {video.duration && (
                    <span
                      className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
                    >
                      {formatDuration(video.duration)}
                    </span>
                  )}

                  {/* Unpublished overlay */}
                  {!video.isPublished && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    >
                      <span className="clay-badge !bg-yellow-500">Draft</span>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/video/${video._id}`}>
                    <h3
                      className="font-semibold text-lg mb-1 hover:underline line-clamp-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {video.title}
                    </h3>
                  </Link>

                  {video.description && (
                    <p
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {video.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <span
                      className="flex items-center gap-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <HiEye className="w-4 h-4" />
                      {formatViews(video.views)} views
                    </span>
                    <span
                      className="flex items-center gap-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <HiThumbUp className="w-4 h-4" />
                      {formatViews(video.likesCount || 0)} likes
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {timeAgo(video.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/video/${video._id}/edit`}
                      className="clay-button-secondary !py-2 !px-4 text-sm flex items-center gap-1"
                    >
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleTogglePublish(video._id)}
                      className="clay-button-secondary !py-2 !px-4 text-sm flex items-center gap-1"
                    >
                      {video.isPublished ? (
                        <>
                          <HiEyeOff className="w-4 h-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <HiEye className="w-4 h-4" />
                          Publish
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setDeleteTargetId(video._id);
                        setShowDeleteModal(true);
                      }}
                      className="clay-button-danger !py-2 !px-4 text-sm flex items-center gap-1"
                    >
                      <HiTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Video?"
        message="This action cannot be undone. Your video will be permanently deleted."
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
      />
    </MainLayout>
  );
};

export default MyVideos;