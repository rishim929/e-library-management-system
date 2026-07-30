import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/books`;
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