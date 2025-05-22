import axios from 'axios';

export const getPurchaseList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get(`/api/purchase/list`, {
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
