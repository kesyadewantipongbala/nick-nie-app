import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}


export const getDashboardSummary = async ({ timeframe, year, month, date }) => {
  
  const endpoint = '/api/dashboard/summary';
  const queryParams = { timeframe };
  if (year) queryParams.year = year;
  if (month) queryParams.month = month; 
  if (date) queryParams.date = date;

  try {
    const response = await axios.get(endpoint, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error.response || error.message);
    throw error.response?.data || { success: false, message: error.message || 'Network error or API unreachable' };
  }
};
