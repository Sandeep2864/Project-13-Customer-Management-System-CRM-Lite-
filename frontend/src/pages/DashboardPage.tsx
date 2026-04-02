import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="glass p-8 rounded-xl text-center space-y-4">
        <h1 className="text-2xl text-white">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;