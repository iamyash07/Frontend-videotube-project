import API from "./axios";

export const toggleVideoLike = (videoId) => {
  return API.post(`/likes/toggle/v/${videoId}`);
};

export const toggleCommentLike = (commentId) => {
  return API.post(`/likes/toggle/c/${commentId}`);
};

export const toggleTweetLike = (tweetId) => {
  return API.post(`/likes/toggle/t/${tweetId}`);
};

export const getLikedVideos = () => {
  return API.get("/likes/videos");
};