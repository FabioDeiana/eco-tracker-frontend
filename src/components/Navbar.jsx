import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "flag-icons/css/flag-icons.min.css"

function Navbar({ onLogout, isAdmin }) {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const isActive = (path) => location.pathname === path

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("it") ? "en" : "it"
    i18n.changeLanguage(newLang)
    localStorage.setItem("language", newLang)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🌿 Eco-Tracker
        </Link>

        {/* Links */}
        <div className="d-flex align-items-center gap-1">
          <Link to="/dashboard" style={{
            color: isActive("/dashboard") ? "white" : "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontWeight: isActive("/dashboard") ? "600" : "400",
            fontSize: "0.95rem",
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: isActive("/dashboard") ? "rgba(255,255,255,0.1)" : "transparent",
            transition: "all 0.2s",
          }}>
            {t("navbar.dashboard")}
          </Link>

          {isAdmin && (
            <>
              <Link to="/stats" style={{
                color: isActive("/stats") ? "white" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontWeight: isActive("/stats") ? "600" : "400",
                fontSize: "0.95rem",
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: isActive("/stats") ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>
                {t("navbar.stats")}
              </Link>
              <Link to="/users" style={{
                color: isActive("/users") ? "white" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontWeight: isActive("/users") ? "600" : "400",
                fontSize: "0.95rem",
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: isActive("/users") ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>
                {t("navbar.users")}
              </Link>
              <Link to="/green-tips" style={{
                color: isActive("/green-tips") ? "white" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontWeight: isActive("/green-tips") ? "600" : "400",
                fontSize: "0.95rem",
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: isActive("/green-tips") ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>
                {t("navbar.greenTips")}
              </Link>
            </>
          )}

          {!isAdmin && (
            <Link to="/profile" style={{
              color: isActive("/profile") ? "white" : "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontWeight: isActive("/profile") ? "600" : "400",
              fontSize: "0.95rem",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: isActive("/profile") ? "rgba(255,255,255,0.1)" : "transparent",
              transition: "all 0.2s",
            }}>
              {t("navbar.profile")}
            </Link>
          )}
        </div>

        {/* Destra — lingua + logout */}
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={toggleLanguage}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.85rem",
            }}
            title={i18n.language.startsWith("it") ? "Switch to English" : "Passa all'italiano"}
          >
            <span className={`fi fi-${i18n.language.startsWith("it") ? "it" : "gb"}`} style={{ fontSize: "1.2rem", borderRadius: "3px" }} />
          </button>

          <button
            onClick={onLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "white",
              padding: "6px 16px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            {t("navbar.logout")}
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar