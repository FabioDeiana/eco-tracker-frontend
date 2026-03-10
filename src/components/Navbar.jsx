import { Link, useLocation } from "react-router-dom"

// Riceviamo onLogout e isAdmin da App.jsx
function Navbar({ onLogout, isAdmin }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link"

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
                Dashboard
              </Link>
            </li>

            {/* Link visibili solo all'ADMIN */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className={isActive("/users")} to="/users">
                    Utenti
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/green-tips")} to="/green-tips">
                    Green Tips
                  </Link>
                </li>
              </>
            )}

            {/* Link visibili solo allo USER */}
            {!isAdmin && (
              <li className="nav-item">
                <Link className={isActive("/profile")} to="/profile">
                  Profilo
                </Link>
              </li>
            )}

          </ul>

          <button className="btn btn-outline-light" onClick={onLogout}>
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar