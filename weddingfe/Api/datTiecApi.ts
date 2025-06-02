import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dat-tiec';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor để gắn token vào header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tạo đặt tiệc
export const createDatTiec = async (data: {
  tenChuRe: string;
  tenCoDau: string;
  dienThoai: string;
  ngayDaiTiec: string;
  maCa: number;
  maSanh: number;
  maThucDon: number;
  soLuongBan: number;
  soBanDuTru: number;
  tienDatCoc?: number;
  dichVus?: { maDichVu: number; soLuong: number; donGiaThoiDiemDat: number }[];
}) => {
  const response = await axiosInstance.post('/tao', data);
  return response.data;
};

// Lấy danh sách đặt tiệc
export const getAllDatTiec = async (filters: {
  ngayDaiTiec?: string;
  maCa?: number;
  maSanh?: number;
  tenChuRe?: string;
  tenCoDau?: string;
  dienThoai?: string;
} = {}) => {
  const response = await axiosInstance.get('/danh-sach', { params: filters });
  return response.data;
};

// Lấy chi tiết đặt tiệc
export const getDatTiecById = async (id: number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  return response.data;
};

// Cập nhật đặt tiệc
export const updateDatTiec = async (
  id: number,
  data: {
    tenChuRe: string;
    tenCoDau: string;
    dienThoai: string;
    ngayDaiTiec: string;
    maCa: number;
    maSanh: number;
    maThucDon: number;
    soLuongBan: number;
    soBanDuTru: number;
    dichVus?: { maDichVu: number; soLuong: number; donGiaThoiDiemDat: number }[];
  }
) => {
  const response = await axiosInstance.put(`/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa đặt tiệc
export const deleteDatTiec = async (id: number) => {
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};

// Thêm món ăn vào thực đơn của đặt tiệc
export const themMonAn = async (id: number, maMonAn: number) => {
  const response = await axiosInstance.post(`/them-mon-an/${id}`, { maMonAn });
  return response.data;
};

// Xóa món ăn khỏi thực đơn của đặt tiệc
export const xoaMonAn = async (id: number, maMonAn: number) => {
  const response = await axiosInstance.delete(`/xoa-mon-an/${id}/${maMonAn}`);
  return response.data;
};

// Thêm dịch vụ vào đặt tiệc
export const themDichVu = async (
  id: number,
  data: { maDichVu: number; soLuong: number; donGiaThoiDiemDat: number }
) => {
  const response = await axiosInstance.post(`/them-dich-vu/${id}`, data);
  return response.data;
};

// Xóa dịch vụ khỏi đặt tiệc
export const xoaDichVu = async (id: number, maDichVu: number) => {
  const response = await axiosInstance.delete(`/xoa-dich-vu/${id}/${maDichVu}`);
  return response.data;
};