import axios from "axios";
const API_URL = "http://localhost:3000/api/thamSo";

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


export const getThamSo = async () => {
  const response = await axiosInstance.get(`${API_URL}/lay`);
  return response.data;
};

export const updateThamSo = async (data: any) => {
  const response = await axiosInstance.put(`${API_URL}/cap-nhat`, data);
  return response.data;
};
