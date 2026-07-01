import axios from "axios";

const API = "http://localhost:5000/api/subscriptions";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSubscriptions = () =>
  axios.get(API, getConfig());

export const upgradeSubscription = () =>
  axios.post(`${API}/upgrade`, {}, getConfig());