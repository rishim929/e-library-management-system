import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/books`;
// Books
export const getBookCount = () =>
  axios.get(`${API}/books`);

// Categories
export const getCategoryCount = () =>
  axios.get(`${API}/categories`);

// Users
export const getUserCount = () =>
  axios.get(`${API}/users`);

// Premium Users
export const getPremiumUserCount = () =>
  axios.get(`${API}/premium-users`);

// Active Subscriptions
export const getSubscriptionCount = () =>
  axios.get(`${API}/subscriptions`);