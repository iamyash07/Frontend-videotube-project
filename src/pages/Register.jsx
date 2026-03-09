import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiCamera,
  HiPhotograph,
} from "react-icons/hi";
import AuthLayout from "../components/Layout/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/ToastContainer";
import { getErrorMessage } from "../utils/helpers";

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      addToast("Please fill in all fields", "warning");
      return;
    }
    if (!avatar) {
      addToast("Avatar is required", "warning");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      await register(data);
      addToast("Account created! Please sign in.", "success");
      navigate("/login");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join VideoTube today">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-2">
          <label className="cursor-pointer relative group">
            <div
              className="clay-avatar w-20 h-20 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <HiCamera
                  className="w-8 h-8"
                  style={{ color: "var(--text-muted)" }}
                />
              )}
            </div>
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <HiCamera className="w-6 h-6 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Upload avatar *
          </p>
        </div>

        {/* Cover Image Upload */}
        <label className="cursor-pointer block">
          <div
            className="clay-input !p-0 overflow-hidden h-24 flex items-center justify-center relative"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                <HiPhotograph className="w-5 h-5" />
                <span className="text-sm">Cover image (optional)</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </label>

        {/* Full Name */}
        <div className="relative">
          <HiUser
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="clay-input !pl-12"
          />
        </div>

        {/* Username */}
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            @
          </span>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            className="clay-input !pl-12"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <HiMail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
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
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center mt-6" style={{ color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;