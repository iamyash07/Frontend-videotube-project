import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiUsers,
  HiFilm,
  HiEye,
  HiCalendar,
} from "react-icons/hi";
import MainLayout from "../components/Layout/MainLayout";
import VideoCard from "../components/Video/VideoCard";
import VideoSkeleton from "../components/UI/VideoSkeleton";
import Loader from "../components/UI/Loader";
import EmptyState from "../components/UI/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/ToastContainer";
import { getChannelProfile } from "../api/auth";
import { getAllVideos } from "../api/video";
import { formatViews, formatDate, getErrorMessage } from "../utils/helpers";

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  const isOwner = user?.username === username;

  // Fetch channel profile
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        const res = await getChannelProfile(username);
        setChannel(res.data.data);
      } catch (error) {
        addToast(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [username]);

  // Fetch channel videos
  useEffect(() => {
    const fetchVideos = async () => {
      if (!channel?._id) return;
      try {
        setLoadingVideos(true);
        const res = await getAllVideos({
          userId: channel._id,
          page: 1,
          limit: 20,
          sortBy: "createdAt",
          sortType: "desc",
        });
        const vids = res.data.data.docs || res.data.data.videos || res.data.data || [];
        setVideos(vids);
      } catch (error) {
        console.error("Failed to load channel videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, [channel]);

  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading channel..." />
      </MainLayout>
    );
  }

  if (!channel) {
    return (
      <MainLayout>
        <EmptyState
          icon="👤"
          title="Channel not found"
          description="The channel you're looking for doesn't exist."
          action={
            <Link to="/" className="clay-button">
              Go Home
            </Link>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Cover Image */}
        <div className="clay-card-no-hover overflow-hidden mb-6">
          <div className="h-48 sm:h-64 relative">
            {channel.coverImage ? (
              <img
                src={channel.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--accent-dark))`,
                }}
              ></div>
            )}
          </div>

          {/* Channel Info */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <img
                src={channel.avatar}
                alt={channel.username}
                className="clay-avatar w-24 h-24 sm:w-32 sm:h-32 -mt-16 sm:-mt-20 relative z-10"
              />

              {/* Info */}
              <div className="flex-1">
                <h1
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {channel.fullName}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  @{channel.username}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span
                    className="flex items-center gap-1 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <HiUsers className="w-4 h-4" />
                    {formatViews(channel.subscribersCount || 0)} subscribers
                  </span>
                  <span
                    className="flex items-center gap-1 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <HiFilm className="w-4 h-4" />
                    {channel.channelsSubscribedToCount || 0} subscribed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwner ? (
                  <Link to="/settings" className="clay-button-secondary">
                    Edit Channel
                  </Link>
                ) : (
                  user && (
                    <button
                      className={`clay-button ${
                        channel.isSubscribed
                          ? "!bg-[var(--bg-card)]"
                          : ""
                      }`}
                      style={
                        channel.isSubscribed
                          ? { color: "var(--text-primary)" }
                          : {}
                      }
                    >
                      {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("videos")}
            className={`clay-tab ${activeTab === "videos" ? "active" : ""}`}
          >
            <span className="flex items-center gap-2">
              <HiFilm className="w-4 h-4" />
              Videos
            </span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`clay-tab ${activeTab === "about" ? "active" : ""}`}
          >
            About
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "videos" && (
          <div className="animate-fade-in">
            {loadingVideos ? (
              <VideoSkeleton count={8} />
            ) : videos.length === 0 ? (
              <EmptyState
                icon="🎬"
                title="No videos yet"
                description={
                  isOwner
                    ? "You haven't uploaded any videos yet. Start sharing!"
                    : "This channel hasn't uploaded any videos yet."
                }
                action={
                  isOwner ? (
                    <Link to="/upload" className="clay-button">
                      Upload Video
                    </Link>
                  ) : null
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="animate-fade-in">
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="animate-fade-in">
            <div className="clay-card-no-hover p-8 max-w-2xl">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                About
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HiCalendar
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    Joined {formatDate(channel.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <HiEye
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {formatViews(channel.subscribersCount || 0)} subscribers
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <HiFilm
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {videos.length} videos
                  </span>
                </div>

                {channel.email && isOwner && (
                  <div className="flex items-center gap-3">
                    <span style={{ color: "var(--text-muted)" }}>📧</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {channel.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Channel;