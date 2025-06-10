import axios from "axios";

// Định nghĩa base URL của backend cho hóa đơn
const API_URL = "http://localhost:3000/api/hoadon";

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

// Lấy tất cả hóa đơn
export const getAllHoaDon = async () => {
  const response = await axiosInstance.get("/danh-sach");
  return response.data;
};

// Lấy hóa đơn theo ID
export const getHoaDonById = async (id : number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  return response.data;
};

// Tạo mới hóa đơn
export const createHoaDon = async (data: any) => {
  const response = await axiosInstance.post("/tao", data);
  return response.data;
};

// Cập nhật hóa đơn
export const updateHoaDon = async (id: number, data: any) => {
  const response = await axiosInstance.put(`/sua/${id}`, data);
  return response.data;
};

// Xóa hóa đơn
export const deleteHoaDon = async (id: number) => {
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};