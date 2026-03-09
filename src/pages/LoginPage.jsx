import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

// Riceviamo onLogin da App.jsx — la chiamiamo quando il login va a buon fine
function LoginPage({ onLogin }) {

  // Stato del form — un campo per email e uno per password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Stato per mostrare eventuali errori (es. credenziali errate)
  const [error, setError] = useState("")

  // Stato per disabilitare il bottone durante la chiamata API
  const [loading, setLoading] = useState(false)

  // Aggiorna il campo giusto nel formData quando l'utente scrive
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // evitiamo il refresh della pagina
    setError("")
    setLoading(true)

    try {
      // Chiamata POST al backend — endpoint di login
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      )

      // Il backend restituisce il token JWT — lo passiamo ad App.jsx
      onLogin(response.data.token)

    } catch (err) {
      // Mostriamo il messaggio di errore del backend, o uno generico
      setError(err.response?.data?.message || "Credenziali non valide")
    } finally {
      setLoading(false)
    }
  }

  return (
    // Centeriamo verticalmente il form nella pagina
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">🌿 Eco-Tracker</h2>
          <p className="text-muted">Accedi al tuo account</p>
        </div>

        {/* Messaggio di errore — visibile solo se c'è un errore */}
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* Form */}
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

          {/* Bottone — disabilitato durante il caricamento */}
          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
            disabled={loading}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>

        </form>

        {/* Link alla registrazione */}
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
  )
}

export default LoginPage