import axios from "axios";

// Định nghĩa base URL của backend
const API_URL = "http://localhost:3000/api/monan";
const LOAI_MON_AN_URL = "http://localhost:3000/api/loaimonan";

// Lấy token từ localStorage hoặc nơi bạn lưu trữ token
const getToken = () => localStorage.getItem("token") || "";

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

// Lấy tất cả món ăn
export const getAllMonAn = async () => {
  const response = await axiosInstance.get("/danh-sach");
  return response.data;
};

// Lấy món ăn theo ID
export const getMonAnById = async (id: number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  return response.data;
};

// Tạo mới món ăn
export const createMonAn = async (data: any) => {
  const response = await axiosInstance.post("/tao", data);
  return response.data;
};

// Cập nhật món ăn
export const updateMonAn = async (id: number, data: any) => {
  const response = await axiosInstance.put(`/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa món ăn
export const deleteMonAn = async (id: number) => {
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};

// Lấy tất cả loại món ăn
export const getAllLoaiMonAn = async () => {
  const response = await axiosInstance.get(`${LOAI_MON_AN_URL}/danh-sach`);
  return response.data;
};

// Tạo loại món ăn
export const createLoaiMonAn = async (data: any) => {
  const response = await axiosInstance.post(`${LOAI_MON_AN_URL}/tao`, data);
  return response.data;
};

// Cập nhật loại món ăn
export const updateLoaiMonAn = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${LOAI_MON_AN_URL}/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa loại món ăn
export const deleteLoaiMonAn = async (id: number) => {
  const response = await axiosInstance.delete(`${LOAI_MON_AN_URL}/xoa/${id}`);
  return response.data;
};