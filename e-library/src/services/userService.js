import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/user`;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ================= ADMIN =================

export const getUsers = () =>
  axios.get(API, getConfig());

export const updateUser = (id, data) =>
  axios.put(`${API}/${id}`, data, getConfig());

export const deleteUser = (id) =>
  axios.delete(`${API}/${id}`, getConfig());

// ================= USER =================

export const getMyProfile = () =>
  axios.get(`${API}/me`, getConfig());

export const updateMyProfile = (data) =>
  axios.put(`${API}/me`, data, getConfig());