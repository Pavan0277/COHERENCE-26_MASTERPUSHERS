import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1/auth"
});

export const registerUser = (data: {
  fullName: string;
  email: string;
  password: string;
}) => API.post("/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/login", data);

export const logoutUser = () => {
  const token = localStorage.getItem("accessToken");
  return API.get("/logout", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
