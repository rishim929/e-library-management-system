import axios from "axios";

const API = "http://localhost:5000/api/notifications";

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