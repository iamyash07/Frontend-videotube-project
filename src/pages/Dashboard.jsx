import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiFilm,
  HiEye,
  HiThumbUp,
  HiUsers,
  HiPlus,
} from "react-icons/hi";
import MainLayout from "../components/Layout/MainLayout";
import Loader from "../components/UI/Loader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/ToastContainer";
import { getAllVideos } from "../api/video";
import { getChannelProfile } from "../api/auth";
import { formatViews, timeAgo, getErrorMessage } from "../utils/helpers";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="clay-card-no-hover p-6">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    subscribers: 0,
  });
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch channel profile for subscriber count
        const channelRes = await getChannelProfile(user.username);
        const channel = channelRes.data.data;

        // Fetch user's videos
        const videosRes = await getAllVideos({
          userId: user._id,
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          sortType: "desc",
        });

        const videos =
          videosRes.data.data.docs ||
          videosRes.data.data.videos ||
          videosRes.data.data ||
          [];

        // Calculate stats
        const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
        const totalLikes = videos.reduce(
          (sum, v) => sum + (v.likesCount || 0),
          0
        );

        setStats({
          totalVideos: videos.length,
          totalViews,
          totalLikes,
          subscribers: channel.subscribersCount || 0,
        });

        setRecentVideos(videos.slice(0, 5));
      } catch (error) {
        addToast(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <Loader text="Loading dashboard..." />
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
              Dashboard
            </h1>
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>
              Welcome back, {user?.fullName}!
            </p>
          </div>

          <Link to="/upload" className="clay-button flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Upload
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={HiFilm}
            label="Total Videos"
            value={stats.totalVideos}
            color="var(--accent)"
          />
          <StatCard
            icon={HiEye}
            label="Total Views"
            value={formatViews(stats.totalViews)}
            color="#3b82f6"
          />
          <StatCard
            icon={HiThumbUp}
            label="Total Likes"
            value={formatViews(stats.totalLikes)}
            color="#ef4444"
          />
          <StatCard
            icon={HiUsers}
            label="Subscribers"
            value={formatViews(stats.subscribers)}
            color="#f59e0b"
          />
        </div>

        {/* Recent Videos */}
        <div className="clay-card-no-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Recent Videos
            </h2>
            <Link
              to="/my-videos"
              className="text-sm font-semibold hover:underline"
              style={{ color: "var(--accent)" }}
            >
              View All →
            </Link>
          </div>

          {recentVideos.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                No videos uploaded yet
              </p>
              <Link to="/upload" className="clay-button">
                Upload Your First Video
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="text-left text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <th className="pb-4 font-semibold">Video</th>
                    <th className="pb-4 font-semibold hidden sm:table-cell">
                      Views
                    </th>
                    <th className="pb-4 font-semibold hidden md:table-cell">
                      Likes
                    </th>
                    <th className="pb-4 font-semibold hidden lg:table-cell">
                      Date
                    </th>
                    <th className="pb-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--bg-secondary)" }}>
                  {recentVideos.map((video) => (
                    <tr key={video._id} className="group">
                      <td className="py-4 pr-4">
                        <Link
                          to={`/video/${video._id}`}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded-xl flex-shrink-0"
                          />
                          <span
                            className="font-medium text-sm line-clamp-2 group-hover:underline"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {video.title}
                          </span>
                        </Link>
                      </td>
                      <td
                        className="py-4 text-sm hidden sm:table-cell"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {formatViews(video.views)}
                      </td>
                      <td
                        className="py-4 text-sm hidden md:table-cell"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {formatViews(video.likesCount || 0)}
                      </td>
                      <td
                        className="py-4 text-sm hidden lg:table-cell"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {timeAgo(video.createdAt)}
                      </td>
                      <td className="py-4">
                        <span
                          className="clay-badge"
                          style={{
                            backgroundColor: video.isPublished
                              ? "var(--success)"
                              : "var(--warning)",
                          }}
                        >
                          {video.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;