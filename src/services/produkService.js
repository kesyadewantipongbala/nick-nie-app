// src\services\produkService.js
import axios from 'axios';

export const getProdukList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get(`/api/produk/list`, {
    params: { search, page, limit },
  });
  return response.data;
};

export const createProduk = async (data) => {
  const response = await axios.post(`/api/produk/create`, data);
  return response.data;
};

export const updateProduk = async (id, data) => {
  const response = await axios.post(`/api/produk/update/${id}`, data);
  return response.data;
};

export const getProdukDetail = async (id) => {
  const response = await axios.get(`/api/produk/detail/${id}`);
  return response.data;
};


export const deleteData = async (id) => {
  const response = await axios.post(`/api/produk/delete/${id}`);
  return response.data;
};
