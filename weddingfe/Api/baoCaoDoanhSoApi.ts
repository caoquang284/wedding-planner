import axios from 'axios';

  const API_URL = 'http://localhost:3000/api/bao-cao-doanh-so'; // Cập nhật từ /api/baocaodoanhso thành /api/bao-cao-doanh-so

  const getToken = () => localStorage.getItem('accessToken') || '';

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Lấy tất cả báo cáo doanh thu
  export const getAllBaoCaoDoanhSo = async (filters: { thang?: number; nam?: number } = {}) => {
    try {
      const response = await axiosInstance.get('/danh-sach', { params: filters });
      console.log('getAllBaoCaoDoanhSo response:', response.data); // Debug
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  // Lấy báo cáo doanh thu theo ID
  export const getBaoCaoDoanhSoById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/chi-tiet/${id}`);
      console.log('getBaoCaoDoanhSoById response data:', response.data.data); // Kiểm tra kiểu dữ liệu
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  // Tạo báo cáo doanh thu mới
  export const createBaoCaoDoanhSo = async (data: { thang: number; nam: number }) => {
    try {
      const response = await axiosInstance.post('/tao', data);
      console.log('createBaoCaoDoanhSo response:', response.data); // Debug
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  // Thêm chi tiết báo cáo
  export const themChiTietBaoCao = async (
    id: number,
    data: { Ngay: string; SoLuongTiec: number; DoanhThu: number; TiLe: number }
  ) => {
    try {
      const response = await axiosInstance.post(`/them-chi-tiet/${id}`, data);
      console.log('themChiTietBaoCao response:', response.data); // Debug
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  // Lấy thống kê theo khoảng thời gian
  export const getRevenueStatsByDateRange = async (startDate: string, endDate: string) => {
    try {
      const response = await axiosInstance.get('/stats-by-date', {
        params: { startDate, endDate },
      });
      console.log('getRevenueStatsByDateRange response:', response.data); // Debug
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  };