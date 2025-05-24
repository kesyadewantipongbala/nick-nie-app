// src\services\pelangganService.js
import axios from 'axios';

export const getPelangganList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get(`/api/customer/list`, {
    params: { search, page, limit },
  });
  return response.data;
};

export const createPelanggan = async (data) => {
  const response = await axios.post(`/api/customer/create`, data);
  return response.data;
};

export const updatePelanggan = async (id, data) => {
  const response = await axios.post(`/api/customer/update/${id}`, data);
  return response.data;
};

export const deletePelangganData = async (id) => {
  const response = await axios.post(`/api/customer/delete/${id}`);
  return response.data;
};
