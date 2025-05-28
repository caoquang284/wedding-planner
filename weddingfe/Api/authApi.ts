import axios from "axios";

const AUTH_URL = "http://localhost:3000/api/auth";

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${AUTH_URL}/login`, { username, password });
  const { token } = response.data;
  localStorage.setItem("token", token); // Lưu token vào localStorage
  return token;
};