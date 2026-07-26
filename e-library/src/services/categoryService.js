import axios from "axios";

const API = "http://localhost:5000/api/categories";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCategories = () => axios.get(API);

export const addCategory = (data) =>
  axios.post(API, data, getConfig());

export const updateCategory = (id, data) =>
  axios.put(`${API}/${id}`, data, getConfig());

export const deleteCategory = (id) =>
  axios.delete(`${API}/${id}`, getConfig());