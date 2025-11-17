import { Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import HomePage from "./features/shop/HomePage";

export default function App() {
  console.log("dirender");
  
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage/>}/>
    </Routes>
  );
}
