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
      setUser(user);
      navigate("/admin");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Đăng nhập thất bại!";
      alert(errorMessage);
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-animated-gradient overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl float-1 top-10 left-10"></div>
        <div className="absolute w-80 h-80 bg-pink-300 opacity-30 rounded-full blur-2xl float-2 bottom-20 right-10"></div>
        <div className="absolute w-60 h-60 bg-blue-300 opacity-30 rounded-full blur-2xl animate-bounce top-1/2 left-1/3"></div>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Tên đăng nhập"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition duration-300"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
