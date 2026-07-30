import axios from "axios";

import { API_BASE_URL } from "../config";
const API = `${API_BASE_URL}/api/payment`;
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ================= ADMIN =================

export const getPayments = async () => {
  const res = await axios.get(API, getConfig());
  return res;
};

// ================= USER =================

export const initiatePayment = async () => {
  const res = await axios.post(
    `${API}/initiate`,
    {
      amount: 2000, // Rs. 20 in paisa
      purchase_order_id: `ORDER_${Date.now()}`,
      purchase_order_name: "Premium Membership",
    },
    getConfig()
  );

  return res;
};

export const verifyPayment = async (pidx) => {
  const res = await axios.post(
    `${API}/verify`,
    { pidx },
    getConfig()
  );

  return res;
};