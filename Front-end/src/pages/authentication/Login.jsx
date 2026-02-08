import { useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/send-code", { phone });
      alert("Access code sent via SMS! Please check your phone.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send access code");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { phone, accessCode });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title"> LOGIN</h2>
        <p className="login-subtitle">
          {" "}
          Please enter your phone number to receive an access code.{" "}
        </p>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSendCode} className="login-form">
          <div className="form-row">
            <label className="login-label">
              Phone Number:
              <input
                className="form-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>
            <div className="form-btn-acction">
              <button
                type="submit"
                className="button button-sendphone"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Access Code"}
              </button>
              </div>
          </div>
        </form>

        <form onSubmit={handleLogin}>
          <label className="login-label">
            Access Code:
            <input
              type="text"
              className="form-input"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
            />
          </label>
          <div className="form-btn-acction">
            <button
              type="submit"
              className="button button-primary"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
