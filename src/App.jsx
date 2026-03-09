import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/UI/ToastContainer";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPage from "./pages/VideoPage";
import Upload from "./pages/Upload";
import EditVideo from "./pages/EditVideo";
import Search from "./pages/Search";
import Channel from "./pages/Channel";
import Settings from "./pages/Settings";
import History from "./pages/History";
import LikedVideos from "./pages/LikedVideos";
import MyVideos from "./pages/MyVideos";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TestConnection from "./pages/TestConnection";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Test Route - Remove in production */}
              <Route path="/test" element={<TestConnection />} />

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/video/:videoId" element={<VideoPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/channel/:username" element={<Channel />} />
              <Route path="/trending" element={<Home />} />

              {/* Protected Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:videoId/edit"
                element={
                  <ProtectedRoute>
                    <EditVideo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/liked-videos"
                element={
                  <ProtectedRoute>
                    <LikedVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-videos"
                element={
                  <ProtectedRoute>
                    <MyVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;