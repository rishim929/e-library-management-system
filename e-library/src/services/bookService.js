import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/books`;

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getBooks = () => axios.get(API, getConfig());

export const addBook = (data) =>
  axios.post(API, data, getConfig());

export const updateBook = (id, data) =>
  axios.put(`${API}/${id}`, data, getConfig());

export const deleteBook = (id) =>
  axios.delete(`${API}/${id}`, getConfig());