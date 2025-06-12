import axios from "axios";

// Định nghĩa base URL của backend
const API_URL = "http://localhost:3000/api/nhom-nguoi-dung";

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

// Tạo mới nhóm người dùng
export const createNhomNguoiDung = async (data: {
  tenNhom: string;
}) => {
  const response = await axiosInstance.post("/tao", data);
  return response.data;
};

// Lấy tất cả nhóm người dùng
export const getAllNhomNguoiDung = async () => {
  const response = await axiosInstance.get("/danh-sach");
  return response.data;
};

// Lấy nhóm người dùng theo ID
export const getNhomNguoiDungById = async (id: number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  return response.data;
};

// Cập nhật nhóm người dùng
export const updateNhomNguoiDung = async (id: number, data: {
  tenNhom: string;
}) => {
  const response = await axiosInstance.put(`/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa nhóm người dùng
export const deleteNhomNguoiDung = async (id: number) => {
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};