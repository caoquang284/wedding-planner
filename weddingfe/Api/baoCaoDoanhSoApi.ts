// src/Api/baoCaoDoanhSoApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/baocaodoanhso';

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
  const response = await axiosInstance.get('/danh-sach', { params: filters });
  return response.data;
};

// Lấy báo cáo doanh thu theo ID
export const getBaoCaoDoanhSoById = async (id: number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  console.log('Response data:', response.data); // Kiểm tra cấu trúc
  return response.data;
};

// Tạo báo cáo doanh thu mới
export const createBaoCaoDoanhSo = async (data: { thang: number; nam: number }) => {
  const response = await axiosInstance.post('/tao', data);
  return response.data;
};

// Thêm chi tiết báo cáo
export const themChiTietBaoCao = async (
  id: number,
  data: { Ngay: string; SoLuongTiec: number; DoanhThu: number; TiLe: number }
) => {
  const response = await axiosInstance.post(`/them-chi-tiet/${id}`, data);
  return response.data;
};

