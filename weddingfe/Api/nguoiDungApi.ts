import axios from "axios";

// Định nghĩa base URL của backend
const API_URL = "http://localhost:3000/api/nguoi-dung";

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

// Định nghĩa interface
interface User {
  MaNguoiDung: number;
  TenDangNhap: string;
  TenNguoiDung: string;
  MaNhom: number;
  TenNhom?: string;
}

interface CreateUserData {
  tenDangNhap: string;
  matKhau: string;
  tenNguoiDung: string;
  maNhom: number;
}

interface UpdateUserData {
  tenNguoiDung?: string;
  maNhom?: number;
}

// Tạo mới người dùng
export const createNguoiDung = async (data: CreateUserData) => {
  const response = await axiosInstance.post("/tao", data);
  return response.data;
};

// Đăng nhập
export const login = async (data: { tenDangNhap: string; matKhau: string }) => {
  const response = await axiosInstance.post("/dang-nhap", data);
  return response.data;
};

// Lấy thông tin người dùng hiện tại
export const getNguoiDung = async () => {
  const response = await axiosInstance.get("/thong-tin");
  return response.data;
};

// Lấy tất cả người dùng
export const getAllNguoiDung = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/danh-sach");
  return response.data.map((user: any) => ({
    MaNguoiDung: user.MaNguoiDung,
    TenDangNhap: user.TenDangNhap,
    TenNguoiDung: user.TenNguoiDung,
    MaNhom: user.MaNhom,
    TenNhom: user.TenNhom || "Chưa có nhóm",
  }));
};

// Cập nhật người dùng
export const updateNguoiDung = async (data: UpdateUserData) => {
  const response = await axiosInstance.put("/cap-nhat", data);
  return response.data;
};

// Xóa người dùng
export const deleteNguoiDung = async (id: number) => {
  const response = await axiosInstance.delete(`/xoa/${id}`);
  return response.data;
};

// Lấy danh sách chức năng của người dùng
export const getChucNang = async () => {
  const response = await axiosInstance.get("/chuc-nang");
  return response.data;
};

// Làm mới token
export const refreshToken = async (data: { refreshToken: string }) => {
  const response = await axiosInstance.post("/refresh", data); 
  return response.data;
};

// Lấy tất cả chức năng
export const getAllChucNang = async () => {
  const response = await axiosInstance.get("/chuc-nang-danh-sach"); 
  return response.data;
};

// Đăng xuất
export const logout = async (data: { refreshToken: string }) => {
  const response = await axiosInstance.post("/dang-xuat", data);
  return response.data;
};