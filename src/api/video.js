import API from "./axios";

export const getAllVideos = (params = {}) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = params;
  const queryParams = new URLSearchParams();

  queryParams.append("page", page);
  queryParams.append("limit", limit);
  if (query) queryParams.append("query", query);
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortType) queryParams.append("sortType", sortType);
  if (userId) queryParams.append("userId", userId);

  return API.get(`/videos?${queryParams.toString()}`);
};

export const publishVideo = (formData) => {
  return API.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getVideoById = (videoId) => {
  return API.get(`/videos/${videoId}`);
};

export const updateVideo = (videoId, data) => {
  return API.patch(`/videos/${videoId}`, data);
};

export const deleteVideo = (videoId) => {
  return API.delete(`/videos/${videoId}`);
};

export const togglePublishStatus = (videoId) => {
  return API.patch(`/videos/${videoId}/toggle-publish-status`);
};

export const getVideoStreamUrl = (videoId) => {
  return `/api/v1/videos/${videoId}/stream`;
};