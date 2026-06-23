import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { isAdmin } from "./utils/auth";

import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import GreenTipPage from "./pages/GreenTipPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import HomePage from "./pages/HomePage.jsx"

// AppContent sta DENTRO BrowserRouter così può usare useNavigate
function AppContent() {
  // Leggiamo il token dal localStorage — se c'è, l'utente è già loggato
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Chiamata quando il login va a buon fine — salviamo il token e andiamo alla dashboard
  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/dashboard");
  };

  // Chiamata quando l'utente clicca logout — puliamo il token e torniamo al login
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  // controlliamo se l'utente è admin
  const admin = token ? isAdmin() : false;

  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/"

  return (
    <>
      {/* Navbar — nascosta su login e register */}
      {!isAuthPage && <Navbar onLogout={handleLogout} isAdmin={admin} />}

      <Routes>
        {/* Rotte pubbliche */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<RegisterPage onLogin={handleLogin} />}
        />

        {/* Rotte comuni a USER e ADMIN */}
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" />}
        />

        {/* Rotta solo USER */}
        <Route
          path="/profile"
          element={
            token && !admin ? <ProfilePage /> : <Navigate to="/dashboard" />
          }
        />

        {/* Rotte solo ADMIN */}
        <Route
          path="/stats"
          element={
            token && admin ? <StatsPage /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/green-tips"
          element={
            token && admin ? <GreenTipPage /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/users"
          element={
            token && admin ? <UsersPage /> : <Navigate to="/dashboard" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
