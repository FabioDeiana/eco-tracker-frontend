import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom"
import { useState } from "react"

import Navbar from "./components/Navbar.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import NewLogPage from "./pages/NewLogPage.jsx"
import GreenTipPage from "./pages/GreenTipPage.jsx"

// AppContent sta DENTRO BrowserRouter così può usare useNavigate
function AppContent() {
  // Leggiamo il token dal localStorage — se c'è, l'utente è già loggato
  const [token, setToken] = useState(localStorage.getItem("token"))
  const navigate = useNavigate()

  // Chiamata quando il login va a buon fine — salviamo il token e andiamo alla dashboard
  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    navigate("/dashboard")
  }

  // Chiamata quando l'utente clicca logout — puliamo il token e torniamo al login
  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
    navigate("/login")
  }

  return (
    <>
      {/* La Navbar è sempre visibile, le passiamo la funzione di logout */}
      <Navbar onLogout={handleLogout} />

      <Routes>
        {/* Rotta di default → login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pagine pubbliche */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />

        {/* Pagine protette — se non c'è token si torna al login */}
        <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/new-log" element={token ? <NewLogPage /> : <Navigate to="/login" />} />
        <Route path="/green-tips" element={token ? <GreenTipPage /> : <Navigate to="/login" />} />

        {/* Qualsiasi rotta sconosciuta → login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App