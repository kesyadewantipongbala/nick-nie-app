// services/akunService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const login = async (data) => {
  const response = await axios.post('/api/user/login', data);
  return response.data;
};

export const getAkunList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get('/api/user/list', {
    params: { search, page, limit },
  });
  return response.data;
};

export const getAkunById = async (id) => {
  const response = await axios.get(`/api/user/detail/${id}`);
  return response.data.data; // ambil hanya array supplier
};

export const createAkun = async (data) => {
  const response = await axios.post(`/api/user/create`, data);
  return response.data;
};

// export const resetPassword = async (id, data) => {
//   const response = await axios.post(`/api/user/reset-password/${id}`);
//   return response.data;
// };

export const resetPassword = async (id, passwordData) => {
  // Perbaiki path agar konsisten: tambahkan /api/ dan gunakan /user/ (singular)
  const response = await axios.post(`/api/user/set-password/${id}`, passwordData);
  return response.data;
};

export const deleteAkunData = async (id) => {
  const response = await axios.post(`/api/user/delete/${id}`);
  return response.data;
};
