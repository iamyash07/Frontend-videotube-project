import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiSearch,
  HiMenu,
  HiPlus,
  HiUser,
  HiLogout,
  HiCog,
  HiX,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../UI/ThemeToggle.jsx";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="clay-navbar sticky top-0 z-40 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="clay-button-ghost !p-2 !rounded-full"
          >
            <HiMenu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "var(--accent)" }}
            >
              ▶
            </div>
            <span
              className="text-xl font-bold hidden sm:block"
              style={{ color: "var(--text-primary)" }}
            >
              VideoTube
            </span>
          </Link>
        </div>

        {/* Center: Search Bar (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl items-center"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="clay-input !pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              <HiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden clay-button-ghost !p-2 !rounded-full"
          >
            {showMobileSearch ? (
              <HiX className="w-5 h-5" />
            ) : (
              <HiSearch className="w-5 h-5" />
            )}
          </button>

          <ThemeToggle />

          {user ? (
            <>
              {/* Upload Button */}
              <Link
                to="/upload"
                className="clay-button !py-2 !px-4 flex items-center gap-2 text-sm"
              >
                <HiPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Upload</span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="clay-avatar w-10 h-10"
                  />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="clay-dropdown absolute right-0 top-14 w-64 z-50 animate-scale-in">
                      {/* User Info */}
                      <div className="p-4 flex items-center gap-3 border-b border-white/10">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="clay-avatar w-10 h-10"
                        />
                        <div>
                          <p
                            className="font-semibold text-sm"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {user.fullName}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            @{user.username}
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to={`/channel/${user.username}`}
                        className="clay-dropdown-item flex items-center gap-3"
                        onClick={() => setShowDropdown(false)}
                      >
                        <HiUser className="w-5 h-5" />
                        Your Channel
                      </Link>

                      <Link
                        to="/dashboard"
                        className="clay-dropdown-item flex items-center gap-3"
                        onClick={() => setShowDropdown(false)}
                      >
                        <HiCog className="w-5 h-5" />
                        Dashboard
                      </Link>

                      <Link
                        to="/settings"
                        className="clay-dropdown-item flex items-center gap-3"
                        onClick={() => setShowDropdown(false)}
                      >
                        <HiCog className="w-5 h-5" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="clay-dropdown-item flex items-center gap-3 w-full text-left"
                        style={{ color: "var(--danger)" }}
                      >
                        <HiLogout className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="clay-button !py-2 !px-6 text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <form
          onSubmit={handleSearch}
          className="md:hidden mt-3 animate-fade-in"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="clay-input !pr-12"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl"
              style={{ color: "var(--accent)" }}
            >
              <HiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}
    </nav>
  );
};

export default Navbar;