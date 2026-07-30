import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/reading-history`;
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const saveReadingHistory = (data) =>
  axios.post(API, data, getConfig());

export const getReadingHistory = () =>
  axios.get(API, getConfig());