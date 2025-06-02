import axios from "axios";

// Định nghĩa base URL của backend
const CA_URL = "http://localhost:3000/api/ca";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token") || "";

// Tạo instance axios với header mặc định
const axiosInstance = axios.create({
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

// Lấy tất cả ca
export const getAllCa = async () => {
  const response = await axiosInstance.get(`${CA_URL}/danh-sach`);
  return response.data;
};

// Lấy ca theo ID
export const getCaById = async (id: number) => {
  const response = await axiosInstance.get(`${CA_URL}/chi-tiet/${id}`);
  return response.data;
};

// Tạo mới ca
export const createCa = async (data: any) => {
  const response = await axiosInstance.post(`${CA_URL}/tao`, data);
  return response.data;
};

// Cập nhật ca
export const updateCa = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${CA_URL}/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa ca
export const deleteCa = async (id: number) => {
  const response = await axiosInstance.delete(`${CA_URL}/xoa/${id}`);
  return response.data;
};