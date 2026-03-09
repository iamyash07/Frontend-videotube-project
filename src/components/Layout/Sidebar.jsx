import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiTrendingUp,
  HiClock,
  HiThumbUp,
  HiCollection,
  HiFilm,
  HiCog,
  HiX,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const mainLinks = [
    { to: "/", icon: HiHome, label: "Home" },
    { to: "/trending", icon: HiTrendingUp, label: "Trending" },
  ];

  const userLinks = [
    { to: "/history", icon: HiClock, label: "History" },
    { to: "/liked-videos", icon: HiThumbUp, label: "Liked Videos" },
    { to: "/playlists", icon: HiCollection, label: "Playlists" },
    { to: "/my-videos", icon: HiFilm, label: "My Videos" },
  ];

  const bottomLinks = [
    { to: "/settings", icon: HiCog, label: "Settings" },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${
      isActive
        ? "clay-card-no-hover font-semibold"
        : "hover:opacity-80"
    }`;

  const activeLinkStyle = { color: "var(--accent)" };
  const inactiveLinkStyle = { color: "var(--text-secondary)" };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`clay-sidebar fixed top-0 left-0 h-full w-64 z-50 pt-4 pb-6 px-3 flex flex-col transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:z-10
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden self-end clay-button-ghost !p-2 !rounded-full mb-2"
        >
          <HiX className="w-5 h-5" />
        </button>

        {/* Main Links */}
        <div className="flex flex-col gap-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={linkClasses}
              style={({ isActive }) =>
                isActive ? activeLinkStyle : inactiveLinkStyle
              }
              onClick={onClose}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        {user && <hr className="clay-divider my-2" />}

        {/* User Links (only if logged in) */}
        {user && (
          <div className="flex flex-col gap-1">
            <p
              className="text-xs font-semibold uppercase tracking-wider px-4 py-2"
              style={{ color: "var(--text-muted)" }}
            >
              Library
            </p>
            {userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClasses}
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : inactiveLinkStyle
                }
                onClick={onClose}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Bottom Links */}
        <div className="mt-auto flex flex-col gap-1">
          <hr className="clay-divider my-2" />
          {bottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
              style={({ isActive }) =>
                isActive ? activeLinkStyle : inactiveLinkStyle
              }
              onClick={onClose}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}

          {/* Footer */}
          <p
            className="text-xs text-center mt-4 px-4"
            style={{ color: "var(--text-muted)" }}
          >
            © 2025 VideoTube
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;