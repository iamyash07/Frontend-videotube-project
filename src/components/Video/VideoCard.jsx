import { Link } from "react-router-dom";
import { formatViews, timeAgo, formatDuration } from "../../utils/helpers.js";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="block group">
      <div className="clay-card overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-t-3xl">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Duration Badge */}
          {video.duration && (
            <span
              className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
            >
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Owner Avatar */}
            <Link
              to={`/channel/${video.owner?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0"
            >
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="clay-avatar w-10 h-10"
              />
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-sm leading-snug mb-1 line-clamp-2"
                style={{ color: "var(--text-primary)" }}
              >
                {video.title}
              </h3>
              <Link
                to={`/channel/${video.owner?.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                {video.owner?.fullName}
              </Link>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {formatViews(video.views)} views • {timeAgo(video.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;