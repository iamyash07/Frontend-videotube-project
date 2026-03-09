const VideoSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="clay-card-no-hover overflow-hidden">
          {/* Thumbnail */}
          <div className="clay-skeleton h-44 w-full !rounded-b-none"></div>
          {/* Info */}
          <div className="p-4">
            <div className="flex gap-3">
              <div className="clay-skeleton w-10 h-10 !rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="clay-skeleton h-4 w-full mb-2"></div>
                <div className="clay-skeleton h-3 w-2/3 mb-2"></div>
                <div className="clay-skeleton h-3 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;