import axios from "axios";

// Định nghĩa base URL của backend
const API_URL = "http://localhost:3000/api/phan-quyen";

// Lấy token từ localStorage hoặc nơi bạn lưu trữ token
const getToken = () => localStorage.getItem("accessToken") || "";

// Tạo instance axios với header mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào mỗi request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tạo mới phân quyền
export const createPhanQuyen = async (data: {
  maNhom: number;
  maChucNang: number;
}) => {
  const response = await axiosInstance.post("/gan-quyen", data);
  return response.data;
  
};

// Lấy danh sách phân quyền theo nhóm
export const getPhanQuyenByNhom = async (maNhom: number) => {
  const response = await axiosInstance.get(`/danh-sach/${maNhom}`);
  return response.data;
};

// Xóa phân quyền
export const deletePhanQuyen = async (maNhom: number, maChucNang: number) => {
  const response = await axiosInstance.delete(`/xoa-quyen/${maNhom}/${maChucNang}`);
  return response.data;
};