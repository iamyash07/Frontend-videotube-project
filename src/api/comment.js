import API from "./axios";

export const getVideoComments = (videoId, params = {}) => {
  const { page = 1, limit = 10 } = params;
  return API.get(`/comments/${videoId}/comments?page=${page}&limit=${limit}`);
};

export const addComment = (videoId, content) => {
  return API.post(`/comments/${videoId}/comments`, { content });
};

export const updateComment = (commentId, content) => {
  return API.patch(`/comments/${commentId}`, { content });
};

export const deleteComment = (commentId) => {
  return API.delete(`/comments/${commentId}`);
};