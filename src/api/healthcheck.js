import API from "./axios";

export const healthCheck = () => {
  return API.get("/healthcheck");
};