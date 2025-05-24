// src\services\transactionService.js
import axios from 'axios';

export const getTransactionList = async ({ search = '', page = 1, limit = 10 }) => {
  const response = await axios.get(`/api/transaction/list`, {
    params: { search, page, limit },
  });
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await axios.post(`/api/transaction/create`, data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await axios.post(`/api/transaction/update/${id}`, data);
  return response.data;
};

export const deleteTransactionData = async (id) => {
  const response = await axios.post(`/api/transaction/delete/${id}`);
  return response.data;
};

export const getTransactionDetail = async (id) => {
  const response = await axios.get(`/api/transaction/${id}`);
  return response.data;
}
