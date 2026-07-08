import axios from "axios";

const API = "http://localhost:5000/api/users";

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