import axios from "axios";

// Định nghĩa base URL của backend
const API_URL = "http://localhost:3000/api/thucdon";

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

// CRUD Thực đơn
export const getAllThucDon = async () => {
  const response = await axiosInstance.get("/danh-sach");
  return response.data;
};

export const getThucDonById = async (id: number) => {
  const response = await axiosInstance.get(`/chi-tiet/${id}`);
  return response.data;
};

  export const createThucDon = async (data: {
    tenThucDon: string;
    donGiaThoiDiemDat: number;
    donGiaHienTai: number;
    ghiChu?: string;
    coverImg?: string;
    monAnIds: number[];
  }) => {
    const response = await axiosInstance.post("/tao", data);
    return response.data;
  };

export const updateThucDon = async (id: number, data: {
  tenThucDon: string;
  donGiaThoiDiemDat: number;
  donGiaHienTai: number;
  ghiChu?: string;
  coverImg?: string;
  monAnIds: number[];
}) => {
  const response = await axiosInstance.put(`/cap-nhat/${id}`, data);
  return response.data;
};

export const deleteThucDon = async (id: number) => {
  console.log("deleteThucDon", id);
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};

// Quản lý món ăn trong thực đơn
export const addMonAnToThucDon = async (
  thucDonId: number, 
  data: {
    maMonAn: number;
    donGiaThoiDiemDat: number;
  }
) => {
  const response = await axiosInstance.post(`/${thucDonId}/them-mon-an`, data);
  return response.data;
};

export const removeMonAnFromThucDon = async (
  thucDonId: number, 
  maMonAn: number
) => {
  const response = await axiosInstance.delete(`/${thucDonId}/xoa-mon-an/${maMonAn}`);
  return response.data;
};

export const updateMonAnInThucDon = async (
  thucDonId: number, 
  maMonAn: number, 
  data: {
    donGiaThoiDiemDat: number;
  }
) => {
  const response = await axiosInstance.put(`/${thucDonId}/cap-nhat-mon-an/${maMonAn}`, data);
  return response.data;
};