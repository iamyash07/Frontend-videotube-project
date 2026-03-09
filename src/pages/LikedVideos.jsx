import { useState, useEffect } from "react";
import MainLayout from "../components/Layout/MainLayout";
import VideoCard from "../components/Video/VideoCard";
import VideoSkeleton from "../components/UI/VideoSkeleton";
import EmptyState from "../components/UI/EmptyState";
import { useToast } from "../components/UI/ToastContainer";
import { getLikedVideos } from "../api/like";
import { getErrorMessage } from "../utils/helpers";

const LikedVideos = () => {
  const { addToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const res = await getLikedVideos();
        const likedData = res.data.data || [];
        const extractedVideos = likedData.map((item) => item.video || item);
        setVideos(extractedVideos.filter(Boolean));
      } catch (error) {
        addToast(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          Liked Videos
        </h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          {videos.length} videos you've liked
        </p>
      </div>

      {loading ? (
        <VideoSkeleton count={8} />
      ) : videos.length === 0 ? (
        <EmptyState icon="❤️" title="No liked videos" description="Videos you like will appear here" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="animate-fade-in">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default LikedVideos;