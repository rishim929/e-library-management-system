import axios from "axios";

const API = "http://localhost:5000/api/reading-history";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const saveReadingHistory = (data) =>
  axios.post(API, data, getConfig());

export const getReadingHistory = () =>
  axios.get(API, getConfig());