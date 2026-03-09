import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function RegisterPage({ onLogin }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Log temporaneo per debug
    console.log("URL chiamata:", `${import.meta.env.VITE_API_URL}/auth/register`)
    setError("")
    setLoading(true)

    try {
      // Step 1 — registriamo l'utente
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData
      )

      // Step 2 — login automatico con le stesse credenziali
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      )

      // Step 3 — passiamo il token ad App.jsx → redirect alla dashboard
      onLogin(loginResponse.data.token)

    } catch (err) {
      setError(err.response?.data?.message || "Errore durante la registrazione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>

        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">🌿 Eco-Tracker</h2>
          <p className="text-muted">Crea il tuo account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Un solo campo name — corrisponde esattamente al DTO del backend */}
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
  )
}

export default RegisterPage