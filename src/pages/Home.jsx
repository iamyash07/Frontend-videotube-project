import { useState, useEffect } from "react";
import MainLayout from "../components/Layout/MainLayout";
import VideoCard from "../components/Video/VideoCard";
import VideoSkeleton from "../components/UI/VideoSkeleton";
import EmptyState from "../components/UI/EmptyState";
import { getAllVideos } from "../api/video";
import { useToast } from "../components/UI/ToastContainer";
import { getErrorMessage } from "../utils/helpers";

const CATEGORIES = ["All", "Music", "Gaming", "Education", "Tech", "Vlogs", "Sports", "News"];

const Home = () => {
  const { addToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchVideos = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = {
        page: pageNum,
        limit: 12,
        sortBy: "createdAt",
        sortType: "desc",
      };

      if (activeCategory !== "All") {
        params.query = activeCategory;
      }

      const res = await getAllVideos(params);
      const newVideos = res.data.data.docs || res.data.data.videos || res.data.data || [];

      if (reset || pageNum === 1) {
        setVideos(newVideos);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
      }

      setHasMore(newVideos.length === 12);
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchVideos(1, true);
  }, [activeCategory]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  return (
    <MainLayout>
      {/* Category Chips */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`clay-chip whitespace-nowrap ${
              activeCategory === cat ? "active" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {loading ? (
        <VideoSkeleton count={12} />
      ) : videos.length === 0 ? (
        <EmptyState
          icon="📺"
          title="No videos found"
          description="There are no videos to display right now. Be the first to upload!"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="animate-fade-in">
                <VideoCard video={video} />
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="clay-button-secondary"
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: "var(--accent)",
                        borderTopColor: "transparent",
                      }}
                    ></div>
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Home;