import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage({ onLogin }) {
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
      // Step 1 — registriamo l'utente
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
        throw new Error(regData.message || "Errore durante la registrazione");
      }

      // Step 2 — login automatico con le stesse credenziali
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
        throw new Error(loginData.message || "Errore nel login");

      // Step 3 — passiamo il token ad App.jsx
      onLogin(loginData.token);
    } catch (err) {
      setError(err.message || "Errore durante la registrazione");
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
      {/* Overlay scuro semi-trasparente */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 40, 0, 0.50)" }}
      />

      {/* Card registrazione */}
      <div
        className="card shadow-lg p-4 position-relative"
        style={{
          width: "100%",
          maxWidth: "420px",
          zIndex: 1,
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(6px)"
        }}
      >
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }}>🌿</div>
          <h2 className="fw-bold text-success">Eco-Tracker</h2>
          <p className="text-muted">Crea il tuo account</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome completo</label>
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
            <label className="form-label">Email</label>
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
            <label className="form-label">Password</label>
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
            {loading ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Hai già un account?{" "}
            <Link to="/login" className="text-success fw-bold">
              Accedi
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
