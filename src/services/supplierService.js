// services/supplierService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const fetchSuppliers = async (search = '', page = 1, limit = 10) => {
  const response = await axios.get('/api/supplier/list', {
    params: { search, page, limit },
  });
  return response.data.data.data; // ambil hanya array supplier
};

export const getSupplierById = async (id) => {
  const response = await axios.get(`/api/supplier/detail/${id}`);
  return response.data.data; // ambil hanya array supplier
};

export const getSupplierList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get(`/api/supplier/list`, {
    params: { search, page, limit },
  });
  return response.data;
};

export const createSupplier = async (data) => {
  const response = await axios.post(`/api/supplier/create`, data);
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const response = await axios.post(`/api/supplier/update/${id}`, data);
  return response.data;
};

export const deleteSupplierData = async (id) => {
  const response = await axios.post(`/api/supplier/delete/${id}`);
  return response.data;
};
