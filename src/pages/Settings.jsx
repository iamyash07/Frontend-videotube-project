import { useState } from "react";
import { HiCamera, HiPhotograph } from "react-icons/hi";
import MainLayout from "../components/Layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/ToastContainer";
import { updateAccount, updateAvatar, updateCoverImage, changePassword } from "../api/auth";
import { getErrorMessage } from "../utils/helpers";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Cover
  const [uploadingCover, setUploadingCover] = useState(false);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.fullName || !profileData.email) {
      addToast("All fields are required", "warning");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateAccount(profileData);
      updateUser(res.data.data);
      addToast("Profile updated successfully!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      addToast("All fields are required", "warning");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("Passwords don't match", "warning");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast("Password must be at least 6 characters", "warning");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      addToast("Password changed successfully!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await updateAvatar(formData);
      updateUser({ avatar: res.data.data.avatar });
      addToast("Avatar updated!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle cover upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", file);
      const res = await updateCoverImage(formData);
      updateUser({ coverImage: res.data.data.coverImage });
      addToast("Cover image updated!", "success");
    } catch (error) {
      addToast(getErrorMessage(error), "error");
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </h1>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>
          Manage your account settings
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {["profile", "password", "images"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`clay-tab capitalize ${
                activeTab === tab ? "active" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="clay-card-no-hover p-8 animate-fade-in">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Profile Information
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  className="clay-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="clay-input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username || ""}
                  className="clay-input opacity-60 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Username cannot be changed
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="clay-button flex items-center gap-2"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "white",
                          borderTopColor: "transparent",
                        }}
                      ></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="clay-card-no-hover p-8 animate-fade-in">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="clay-input"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="clay-input"
                  placeholder="Enter new password (min 6 chars)"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="clay-input"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="clay-button flex items-center gap-2"
                  disabled={savingPassword}
                >
                  {savingPassword ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "white",
                          borderTopColor: "transparent",
                        }}
                      ></div>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="space-y-6 animate-fade-in">
            {/* Avatar */}
            <div className="clay-card-no-hover p-8">
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Profile Picture
              </h2>

              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={user?.avatar}
                    alt="Avatar"
                    className="clay-avatar w-24 h-24"
                  />
                  <label
                    className="absolute inset-0 rounded-full flex items-center justify-center
                      bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <div
                        className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "white",
                          borderTopColor: "transparent",
                        }}
                      ></div>
                    ) : (
                      <HiCamera className="w-8 h-8 text-white" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                </div>

                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Change Avatar
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="clay-card-no-hover p-8">
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Cover Image
              </h2>

              <label className="cursor-pointer block">
                <div className="relative group overflow-hidden rounded-2xl h-48">
                  {user?.coverImage ? (
                    <img
                      src={user.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <HiPhotograph className="w-6 h-6" />
                        <span>No cover image</span>
                      </div>
                    </div>
                  )}

                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                      transition-opacity flex items-center justify-center"
                  >
                    {uploadingCover ? (
                      <div
                        className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "white",
                          borderTopColor: "transparent",
                        }}
                      ></div>
                    ) : (
                      <div className="text-center text-white">
                        <HiPhotograph className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-semibold">Change Cover Image</p>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                Recommended: 1280x320 pixels
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Settings;
