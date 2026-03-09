import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import VideoCard from "../components/Video/VideoCard";
import VideoSkeleton from "../components/UI/VideoSkeleton";
import EmptyState from "../components/UI/EmptyState";
import { getAllVideos } from "../api/video";
import { useToast } from "../components/UI/ToastContainer";
import { getErrorMessage } from "../utils/helpers";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { addToast } = useToast();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setVideos([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getAllVideos({
          query,
          page: 1,
          limit: 20,
          sortBy: "createdAt",
          sortType: "desc",
        });
        const results = res.data.data.docs || res.data.data.videos || res.data.data || [];
        setVideos(results);
      } catch (error) {
        addToast(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Search Results
        </h1>
        {query && (
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Showing results for: <span className="font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {loading ? (
        <VideoSkeleton count={12} />
      ) : videos.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No results found"
          description={
            query
              ? `We couldn't find any videos matching "${query}"`
              : "Enter a search query to find videos"
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
    </MainLayout>
  );
};

export default Search;