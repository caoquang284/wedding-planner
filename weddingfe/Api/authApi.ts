import axios from "axios"; //Test

const AUTH_URL = "http://localhost:3000/api/auth";

export const login = async (tenDangNhap: string, matKhau: string) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, {
      tenDangNhap,
      matKhau,
    }, {
      headers: { "Content-Type": "application/json" }
    });
    const { accessToken, refreshToken, user } = response.data;

    // Giả sử backend trả về permissions trong user
    return { accessToken, refreshToken, user };
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "Lỗi đăng nhập");
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server");
    } else {
      throw new Error("Lỗi không xác định");
    }
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${AUTH_URL}/refresh`, { refreshToken }, {
      headers: { "Content-Type": "application/json" }
    });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Lỗi làm mới token");
  }
};