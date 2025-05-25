// src/services/purchaseService.js
import axios from 'axios';

export const getPurchaseList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get(`/api/purchase/list`, { // Pastikan base URL (misal /api) sudah di-handle oleh Axios config
    params: { search, page, limit },
  });
  return response.data;
};

export const createPurchase = async (data) => {
  const response = await axios.post(`/api/purchase/create`, data);
  return response.data;
};

export const updatePurchase = async (id, data) => {
  const response = await axios.post(`/api/purchase/update/${id}`, data);
  return response.data;
};

export const deletePurchaseData = async (id) => {
  const response = await axios.post(`/api/purchase/delete/${id}`);
  return response.data;
};

// Fungsi BARU untuk mengambil detail pembelian beserta item-itemnya
export const getPurchaseDetailWithItems = async (id) => {
  // Pastikan endpoint ini sesuai dengan rute backend Anda yang memanggil PurchaseController.getWithItems
  // Contoh endpoint: /api/purchase/detail/:id atau /api/purchase/:id?include=items
  const response = await axios.get(`/api/purchase/${id}`); 
  return response.data; // response.data akan berisi { success: true, message: "...", data: { purchase_details_with_items }}
};