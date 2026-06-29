import axios from "axios";

const API = "http://localhost:5000/api/dashboard";

export const getBookCount = () => axios.get(`${API}/books`);
export const getCategoryCount = () => axios.get(`${API}/categories`);