import axios from 'axios';
import Cookies from 'js-cookie';

// Mengambil token dari cookies saat service diinisialisasi
const token = Cookies.get('token');

// Mengatur header Authorization default untuk semua request Axios jika token ada
// Ini sebaiknya dilakukan di konfigurasi Axios global (misalnya di main.js atau file setup Axios terpisah)
// agar tidak diulang di setiap service. Namun, untuk contoh ini, kita letakkan di sini.
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  // Hapus header default jika token tidak ada (misalnya setelah logout)
  // delete axios.defaults.headers.common['Authorization'];
  // Atau, biarkan interceptor yang menangani jika ada.
  console.warn('Token tidak ditemukan di cookies. Request API mungkin gagal jika memerlukan autentikasi.');
}

/**
 * Mengambil data ringkasan dashboard dari API.
 * @param {object} params - Parameter untuk API.
 * @param {'Harian'|'Mingguan'|'Bulanan'|'Tahunan'} params.timeframe - Periode waktu.
 * @param {string} params.contextDate - Tanggal acuan (YYYY-MM-DD).
 * @returns {Promise<object>} Data respons dari API.
 */
export const getDashboardSummary = async ({ timeframe, contextDate }) => {
  
  const endpoint = '/api/dashboard/summary';

  const queryParams = { timeframe, contextDate };

  console.log('[dashboardService] Mengirim permintaan ke API dengan parameter:', queryParams);

  try {
    const response = await axios.get(endpoint, { params: queryParams });
    return response.data; 
  } catch (error) {
    console.error('Error fetching dashboard summary:', error.response ? error.response.data : error.message);
    throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error or API unreachable',
        data: null
    };
  }
};
