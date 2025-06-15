import axios from "axios";

// Định nghĩa base URL của backend
const SANH_URL = "http://localhost:3000/api/sanh";
const LOAI_SANH_URL = "http://localhost:3000/api/loaisanh";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("accessToken") || "";

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

// Lấy tất cả sảnh
export const getAllSanh = async () => {
  const response = await axiosInstance.get(`${SANH_URL}/danh-sach`);
  return response.data;
};

// Lấy sảnh theo ID
export const getSanhById = async (id: number) => {
  const response = await axiosInstance.get(`${SANH_URL}/chi-tiet/${id}`);
  return response.data;
};

// Tạo mới sảnh
export const createSanh = async (data: any) => {
  const response = await axiosInstance.post(`${SANH_URL}/tao`, data);
  return response.data;
};

// Cập nhật sảnh
export const updateSanh = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${SANH_URL}/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa sảnh
export const deleteSanh = async (id: number) => {
  const response = await axiosInstance.delete(`${SANH_URL}/xoa/${id}`);
  return response.data;
};

// Lấy tất cả loại sảnh
export const getAllLoaiSanh = async () => {
  const response = await axiosInstance.get(`${LOAI_SANH_URL}/danh-sach`);
  return response.data;
};

// Lấy loại sảnh theo ID
export const getLoaiSanhById = async (id: number) => {
  const response = await axiosInstance.get(`${LOAI_SANH_URL}/chi-tiet/${id}`);
  return response.data;
};

// Tạo loại sảnh
export const createLoaiSanh = async (data: any) => {
  const response = await axiosInstance.post(`${LOAI_SANH_URL}/tao`, data);
  return response.data;
};

// Cập nhật loại sảnh
export const updateLoaiSanh = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${LOAI_SANH_URL}/cap-nhat/${id}`, data);
  return response.data;
};

// Xóa loại sảnh
export const deleteLoaiSanh = async (id: number) => {
  const response = await axiosInstance.delete(`${LOAI_SANH_URL}/xoa/${id}`);
  return response.data;
};
export const getDonGiaBanToiThieu = async (maLoaiSanh: number) => {
  const response = await axiosInstance.get(
    `${SANH_URL}/don-gia-ban-toi-thieu/${maLoaiSanh}`
  );
  return response.data;
};