import axios from "axios";

const API = "http://localhost:5000/api/payments";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getPayments = () =>
  axios.get(API, getConfig());