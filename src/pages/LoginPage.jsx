import { useState } from "react";
import { Link } from "react-router-dom";

// Riceviamo onLogin da App.jsx — la chiamiamo quando il login va a buon fine
function LoginPage({ onLogin }) {
  // Stato del form — un campo per email e uno per password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Stato per mostrare eventuali errori (es. credenziali errate)
  const [error, setError] = useState("");

  // Stato per disabilitare il bottone durante la chiamata API
  const [loading, setLoading] = useState(false);

  // Aggiorna il campo giusto nel formData quando l'utente scrive
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // evitiamo il refresh della pagina
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenziali non valide");
      onLogin(data.token);
    } catch (err) {
      setError(err.message || "Credenziali non valide");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/forest.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        //opacity: 0.9,
      }}
    >
      {/* Overlay scuro semi-trasparente */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 40, 0, 0.50)" }}
      />

      {/* Card login — z-index per stare sopra l'overlay */}
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
          <h2 className="fw-bold text-success">Eco-Tracker</h2>
          <p className="text-muted">Accedi al tuo account</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Non hai un account?{" "}
            <Link to="/register" className="text-success fw-bold">
              Registrati
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
