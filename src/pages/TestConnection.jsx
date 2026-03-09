import { useState } from "react";
import API from "../api/axios";

const QuickRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "Test User",
    username: "testuser",
    email: "test@test.com",
    password: "test1234",
  });
  const [avatar, setAvatar] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!avatar) {
      setResult({ status: "error", data: "Avatar file is required!" });
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

      const res = await API.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult({ status: "success", data: res.data });
    } catch (error) {
      setResult({
        status: "error",
        data: error.response?.data || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clay-card-no-hover p-6">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        🧪 Quick Register (For Testing)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="clay-input"
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="clay-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="clay-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="clay-input"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Avatar (Required)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          className="clay-input text-sm"
        />
        {avatar && (
          <p className="text-xs mt-1" style={{ color: "var(--success)" }}>
            ✅ {avatar.name} selected
          </p>
        )}
      </div>

      <button
        onClick={handleRegister}
        className="clay-button"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register Test User"}
      </button>

      {result && (
        <div
          className="mt-4 p-4 rounded-2xl overflow-auto max-h-48"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <pre
            className="text-sm whitespace-pre-wrap break-words font-mono"
            style={{
              color:
                result.status === "success"
                  ? "var(--success)"
                  : "var(--danger)",
            }}
          >
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const TestConnection = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const tests = [
    {
      name: "Health Check",
      action: async () => {
        const res = await API.get("/healthcheck");
        return res.data;
      },
    },
    {
      name: "Get Videos",
      action: async () => {
        const res = await API.get("/videos?page=1&limit=5");
        return res.data;
      },
    },
    {
      name: "Test Login",
      action: async () => {
        const res = await API.post("/users/login", {
          email: "test@test.com",
          password: "test1234",
        });
        if (res.data.data.accessToken) {
          localStorage.setItem("accessToken", res.data.data.accessToken);
        }
        return res.data;
      },
    },
    {
      name: "Get Current User",
      action: async () => {
        const res = await API.get("/users/current-user");
        return res.data;
      },
    },
  ];

  const runTest = async (test) => {
    setResults((prev) => ({
      ...prev,
      [test.name]: { status: "loading", data: null },
    }));

    try {
      const data = await test.action();
      setResults((prev) => ({
        ...prev,
        [test.name]: { status: "success", data },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [test.name]: {
          status: "error",
          data: error.response?.data || error.message,
        },
      }));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    for (const test of tests) {
      await runTest(test);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          🔌 Backend Connection Test
        </h1>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>
          Testing connection to{" "}
          <span className="font-mono font-semibold">
            http://localhost:8000
          </span>
        </p>

        {/* Run All Button */}
        <button
          onClick={runAllTests}
          className="clay-button mb-8 flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <div
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: "white",
                  borderTopColor: "transparent",
                }}
              ></div>
              Running Tests...
            </>
          ) : (
            "🚀 Run All Tests"
          )}
        </button>

        {/* Individual Tests */}
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.name} className="clay-card-no-hover p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {test.name}
                </h3>

                <div className="flex items-center gap-3">
                  {results[test.name] && (
                    <span
                      className="clay-badge"
                      style={{
                        backgroundColor:
                          results[test.name].status === "success"
                            ? "var(--success)"
                            : results[test.name].status === "error"
                            ? "var(--danger)"
                            : "var(--warning)",
                      }}
                    >
                      {results[test.name].status === "success"
                        ? "✅ PASS"
                        : results[test.name].status === "error"
                        ? "❌ FAIL"
                        : "⏳ LOADING"}
                    </span>
                  )}

                  <button
                    onClick={() => runTest(test)}
                    className="clay-button-secondary !py-2 !px-4 text-sm"
                  >
                    Run
                  </button>
                </div>
              </div>

              {results[test.name] && (
                <div
                  className="p-4 rounded-2xl overflow-auto max-h-64"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <pre
                    className="text-sm whitespace-pre-wrap break-words font-mono"
                    style={{
                      color:
                        results[test.name].status === "success"
                          ? "var(--success)"
                          : "var(--danger)",
                    }}
                  >
                    {JSON.stringify(results[test.name].data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Registration */}
        <div className="mt-8">
          <QuickRegister />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/" className="clay-button-secondary">
            ← Go to Home
          </a>
          <a href="/login" className="clay-button-secondary">
            Go to Login →
          </a>
          <a href="/register" className="clay-button-secondary">
            Go to Register →
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;