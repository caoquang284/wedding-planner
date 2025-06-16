import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000/api/dat-tiec';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor request: Gắn token vào header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || ''; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: Xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Redirect về login
      return Promise.reject(new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'));
    }
    const message = (error.response?.data as { error?: string })?.error || 'Đã xảy ra lỗi';
    return Promise.reject(new Error(message));
  }
);

interface DichVu {
  maDichVu: number;
  soLuong: number;
  donGiaThoiDiemDat: number;
}

interface DatTiecData {
  tenChuRe: string;
  tenCoDau: string;
  dienThoai: string; // 10 chữ số
  ngayDaiTiec: string; // YYYY-MM-DD
  maCa: number;
  maSanh: number;
  maThucDon: number;
  soLuongBan: number;
  soBanDuTru: number;
  tienDatCoc: number;
  dichVus?: DichVu[];
}

// Tạo đặt tiệc
export const createDatTiec = async (data: DatTiecData) => {
  try {
    const response = await axiosInstance.post('/dat-tiec', data);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Lấy danh sách đặt tiệc
export const getAllDatTiec = async (filters: {
  ngayDaiTiec?: string;
  maCa?: number;
  maSanh?: number;
  tenChuRe?: string;
  tenCoDau?: string;
  dienThoai?: string;
  daHuy?: boolean;
} = {}) => {
  try {
    const response = await axiosInstance.get('/danh-sach', { params: filters });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Lấy chi tiết đặt tiệc
export const getDatTiecById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/chi-tiet/${id}`);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Cập nhật đặt tiệc
export const updateDatTiec = async (id: number, data: DatTiecData) => {
  try {
    const response = await axiosInstance.put(`/cap-nhat/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Xóa đặt tiệc
export const deleteDatTiec = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/xoa/${id}`);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const cancelDatTiec = async (id: number) => {
  try {
    const response = await axiosInstance.put(`/huy/${id}`);
    return response.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

