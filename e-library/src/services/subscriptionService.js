import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/books`;
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSubscriptions = () =>
  axios.get(API, getConfig());

export const upgradeSubscription = () =>
  axios.post(`${API}/upgrade`, {}, getConfig());