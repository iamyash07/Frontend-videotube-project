import { useState, useEffect } from "react";
import MainLayout from "../components/Layout/MainLayout";
import VideoCard from "../components/Video/VideoCard";
import VideoSkeleton from "../components/UI/VideoSkeleton";
import EmptyState from "../components/UI/EmptyState";
import { useToast } from "../components/UI/ToastContainer";
import { getWatchHistory } from "../api/auth";
import { getErrorMessage } from "../utils/helpers";

const History = () => {
  const { addToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getWatchHistory();
        setVideos(res.data.data || []);
      } catch (error) {
        addToast(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Watch History
        </h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Videos you've watched recently
        </p>
      </div>

      {loading ? (
        <VideoSkeleton count={8} />
      ) : videos.length === 0 ? (
        <EmptyState
          icon="🕐"
          title="No watch history"
          description="Videos you watch will appear here"
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
    </MainLayout>
  );
};

export default History;