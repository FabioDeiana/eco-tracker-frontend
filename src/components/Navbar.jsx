import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "flag-icons/css/flag-icons.min.css"

function Navbar({ onLogout, isAdmin }) {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link"

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("it") ? "en" : "it"
    i18n.changeLanguage(newLang)
    localStorage.setItem("language", newLang)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          🌿 Eco-Tracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActive("/dashboard")} to="/dashboard">
                {t("navbar.dashboard")}
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className={isActive("/stats")} to="/stats">
                    {t("navbar.stats")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/users")} to="/users">
                    {t("navbar.users")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/green-tips")} to="/green-tips">
                    {t("navbar.greenTips")}
                  </Link>
                </li>
              </>
            )}
            {!isAdmin && (
              <li className="nav-item">
                <Link className={isActive("/profile")} to="/profile">
                  {t("navbar.profile")}
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleLanguage}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
              title={i18n.language.startsWith("it") ? "Switch to English" : "Passa all'italiano"}
            >
              <span
                className={`fi fi-${i18n.language.startsWith("it") ? "it" : "gb"}`}
                style={{ fontSize: "1.5rem", borderRadius: "3px" }}
              />
              <span className="ms-1 text-white small">
                {i18n.language.startsWith("it") ? "IT" : "EN"}
              </span>
            </button>
            <button className="btn btn-outline-light" onClick={onLogout}>
              {t("navbar.logout")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar