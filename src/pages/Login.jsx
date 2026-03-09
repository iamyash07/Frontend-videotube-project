import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import AuthLayout from "../components/Layout/AuthLayout";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/UI/ToastContainer.jsx";
import { getErrorMessage } from "../utils/helpers";

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      addToast("Welcome back!", "success");
      navigate("/");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your VideoTube account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <HiMail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            name="email"
            placeholder="Email or Username"
            value={formData.email}
            onChange={handleChange}
            className="clay-input !pl-12"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <HiLockClosed
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="clay-input !pl-12 !pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          >
            {showPassword ? (
              <HiEyeOff className="w-5 h-5" />
            ) : (
              <HiEye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="clay-button w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "white", borderTopColor: "transparent" }}
            ></div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center mt-6" style={{ color: "var(--text-muted)" }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;