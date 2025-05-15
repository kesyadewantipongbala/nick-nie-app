// services/supplierService.js
import axios from 'axios';

export const fetchSuppliers = async (search = '', page = 1, limit = 10) => {
    const response = await axios.get('/api/supplier/list', {
        params: { search, page, limit }
    });
    return response.data.data.data; // ambil hanya array supplier
};

export const getSupplierById = async (id) => {
    const response = await axios.get(`/api/supplier/detail/${id}`);
    return response.data.data; // ambil hanya array supplier
};
