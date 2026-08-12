import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/notifications`;
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotifications = () =>
  axios.get(API, getConfig());

export const getUnreadCount = () =>
  axios.get(`${API}/count`, getConfig());

export const markAllAsRead = () =>
  axios.put(`${API}/read-all`, {}, getConfig());