import { Link, useLocation } from "react-router-dom"

// Riceviamo onLogout come prop da AppContent
function Navbar({ onLogout }) {
  // useLocation ci dice su quale pagina siamo — serve per evidenziare il link attivo
  const location = useLocation()

  // Funzione di aiuto: restituisce "nav-link active" se siamo su quella rotta
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link"

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">

        {/* Logo / nome app — cliccabile, porta alla dashboard */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          🌿 Eco-Tracker
        </Link>

        {/* Bottone hamburger per mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links di navigazione */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className={isActive("/dashboard")} to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className={isActive("/new-log")} to="/new-log">
                Nuovo Log
              </Link>
            </li>

            <li className="nav-item">
              <Link className={isActive("/green-tips")} to="/green-tips">
                Green Tips
              </Link>
            </li>

          </ul>

          {/* Bottone logout — allineato a destra */}
          <button className="btn btn-outline-light" onClick={onLogout}>
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar