import axios from "axios";

// Định nghĩa base URL của backend
const API_URL = "http://localhost:3000/api/dichvu";
const LOAI_DICH_VU_URL = "http://localhost:3000/api/loaidichvu";

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

// Lấy tất cả dịch vụ
export const getAllDichVu = async () => {
  const response = await axiosInstance.get("/danh-sach");
  return response.data;
};

// Lấy dịch vụ theo ID
export const getDichVuById = async (id: number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  return response.data;
};

// Tạo mới dịch vụ
export const createDichVu = async (data: any) => {
  const response = await axiosInstance.post("/tao", data);
  return response.data;
};

// Cập nhật dịch vụ
export const updateDichVu = async (id: number, data: any) => {
  const response = await axiosInstance.put(`/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa dịch vụ
export const deleteDichVu = async (id: number) => {
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};

// Lấy tất cả loại dịch vụ
export const getAllLoaiDichVu = async () => {
  const response = await axiosInstance.get(`${LOAI_DICH_VU_URL}/danh-sach`);
  return response.data;
};

// Tạo loại dịch vụ
export const createLoaiDichVu = async (data: any) => {
  const response = await axiosInstance.post(`${LOAI_DICH_VU_URL}/tao`, data);
  return response.data;
};

// Cập nhật loại dịch vụ
export const updateLoaiDichVu = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${LOAI_DICH_VU_URL}/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa loại dịch vụ
export const deleteLoaiDichVu = async (id: number) => {
  const response = await axiosInstance.delete(`${LOAI_DICH_VU_URL}/xoa/${id}`);
  return response.data;
};