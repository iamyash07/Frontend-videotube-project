import API from "./axios";

export const registerUser = (formData) => {
  return API.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const loginUser = (credentials) => {
  return API.post("/users/login", credentials);
};

export const logoutUser = () => {
  return API.post("/users/logout");
};

export const refreshToken = () => {
  return API.post("/users/refresh-token");
};

export const changePassword = (data) => {
  return API.post("/users/change-password", data);
};

export const getCurrentUser = () => {
  return API.get("/users/current-user");
};

export const updateAccount = (data) => {
  return API.patch("/users/update-account", data);
};

export const updateAvatar = (formData) => {
  return API.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateCoverImage = (formData) => {
  return API.patch("/users/cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getChannelProfile = (username) => {
  return API.get(`/users/c/${username}`);
};

export const getWatchHistory = () => {
  return API.get("/users/history");
};