import axios from "axios";

const API = "http://localhost:5000/api/users";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getUsers = () => axios.get(API, getConfig());

export const updateUser = (id, data) =>
  axios.put(`${API}/${id}`, data, getConfig());

export const deleteUser = (id) =>
  axios.delete(`${API}/${id}`, getConfig());