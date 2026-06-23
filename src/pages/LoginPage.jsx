import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LoginPage({ onLogin }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("login.error"));
      onLogin(data.token);
    } catch (err) {
      setError(err.message || t("login.error"));
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/forest.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 40, 0, 0.50)" }}
      />
      <Link
        to="/"
        className="position-absolute text-white text-decoration-none small"
        style={{ top: "20px", left: "20px", zIndex: 2 }}
      >
        ← {t("login.backHome")}
      </Link>
      <div
        className="card shadow-lg p-4 position-relative"
        style={{
          width: "100%",
          maxWidth: "420px",
          zIndex: 1,
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }}>🌿</div>
          <h2 className="fw-bold text-success">{t("login.title")}</h2>
          <p className="text-muted">{t("login.subtitle")}</p>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t("login.email")}</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="tua@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("login.password")}</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
            disabled={loading}
            style={{ borderRadius: "8px" }}
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">
            {t("login.noAccount")}{" "}
            <Link to="/register" className="text-success fw-bold">
              {t("login.register")}
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
