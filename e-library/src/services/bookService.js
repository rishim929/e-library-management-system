import axios from "axios";

const API = "http://localhost:5000/api/books";

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