import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      localStorage.setItem("ai-compass-auth", "true");
      navigate("/dashboard");
    } else {
      setError("用户名或密码错误");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white shadow-xl shadow-blue-500/30 mb-4">
            智
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">智览 AI-Compass</h1>
          <p className="mt-1 text-sm text-gray-500">AI 基础设施量化观测平台</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">登录系统</h2>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1.5">用户名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              autoComplete="username"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">密码</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-400">
              "&#x2716; "{error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] transition-all">
            登 录
          </button>

          {/* Hint */}
          <p className="mt-4 text-center text-xs text-gray-600">
            默认账号: admin / admin
          </p>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-700">
          AI-Compass v1.0.0 &middot; &copy; 2026
        </p>
      </div>
    </div>
  );
}