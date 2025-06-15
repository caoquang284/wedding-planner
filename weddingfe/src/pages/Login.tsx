import { useState } from "react";
import { login } from "../../Api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/contexts/AuthContext"; 

function Login() {
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken, user } = await login(tenDangNhap, matKhau);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user); // Cập nhật user vào context
      navigate("/admin"); // Chuyển hướng đến trang quản lý
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Đăng nhập thất bại!";
      alert(errorMessage);
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tên đăng nhập</label>
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              className="py-2 px-3 mt-1 w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;