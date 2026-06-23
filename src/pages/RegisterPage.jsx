import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function RegisterPage({ onLogin }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const regRes = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!regRes.ok) {
        const regData = await regRes.json();
        throw new Error(regData.message || t("register.error"));
      }

      const loginRes = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );
      const loginData = await loginRes.json();
      if (!loginRes.ok)
        throw new Error(loginData.message || t("register.error"));

      onLogin(loginData.token);
    } catch (err) {
      setError(err.message || t("register.error"));
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
          <h2 className="fw-bold text-success">{t("register.title")}</h2>
          <p className="text-muted">{t("register.subtitle")}</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t("register.name")}</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Mario Rossi"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("register.email")}</label>
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
            <label className="form-label">{t("register.password")}</label>
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
            {loading ? t("register.loading") : t("register.submit")}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            {t("register.hasAccount")}{" "}
            <Link to="/login" className="text-success fw-bold">
              {t("register.login")}
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
