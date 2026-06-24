import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

function LoginPage({ onLogin }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || t("login.error"))
      onLogin(data.token)
    } catch (err) {
      setError(err.message || t("login.error"))
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/forest.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 27, 18, 0.6)" }} />

      <Link to="/" style={{
        position: "absolute", top: "24px", left: "24px",
        color: "rgba(255,255,255,0.8)", textDecoration: "none",
        fontSize: "0.9rem", fontWeight: "500", zIndex: 2,
        display: "flex", alignItems: "center", gap: "6px",
        transition: "color 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.color = "white"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
      >
        ← {t("login.backHome")}
      </Link>

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "420px",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        margin: "24px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "8px" }}>🌿</div>
          <h2 style={{ fontWeight: "800", color: "#1b4332", marginBottom: "6px" }}>{t("login.title")}</h2>
          <p style={{ color: "#6c757d", margin: 0 }}>{t("login.subtitle")}</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#fde8e8", border: "1px solid #f5c6cb",
            borderRadius: "12px", padding: "12px 16px",
            color: "#dc3545", marginBottom: "20px", fontSize: "0.9rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#1b4332", display: "block", marginBottom: "6px" }}>
              {t("login.email")}
            </label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="tua@email.com"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e9ecef", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#1b4332"}
              onBlur={e => e.target.style.borderColor = "#e9ecef"}
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#1b4332", display: "block", marginBottom: "6px" }}>
              {t("login.password")}
            </label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} required placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #e9ecef", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#1b4332"}
              onBlur={e => e.target.style.borderColor = "#e9ecef"}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", backgroundColor: "#1b4332", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "1rem", cursor: "pointer", transition: "background-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2d6a4f"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1b4332"}
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", marginBottom: 0, fontSize: "0.9rem", color: "#6c757d" }}>
          {t("login.noAccount")}{" "}
          <Link to="/register" style={{ color: "#1b4332", fontWeight: "700", textDecoration: "none" }}>
            {t("login.register")}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage