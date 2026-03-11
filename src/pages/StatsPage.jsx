import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import apiFetch from "../api/apiFetch"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function StatsPage() {
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, logsData] = await Promise.all([
          apiFetch("/users"),
          apiFetch("/logs/all"),
        ])
        setUsers(usersData.content)
        setLogs(logsData)
      } catch (err) {
        setError("Errore nel caricamento delle statistiche")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- Calcolo statistiche ---

  // CO₂ totale emessa da tutti gli utenti
  const co2Totale = logs.reduce((sum, log) => sum + log.totalCo2, 0)

  // Media CO₂ per log
  const co2Media = logs.length > 0 ? co2Totale / logs.length : 0

  // Numero utenti USER (escludiamo gli ADMIN)
  const totaleUser = users.filter((u) => u.role === "USER").length

  // CO₂ per utente — sommiamo i log per ogni utente
  const co2PerUtente = users.map((user) => {
    const userLogs = logs.filter((log) => log.user.id === user.id)
    const totalCo2 = userLogs.reduce((sum, log) => sum + log.totalCo2, 0)
    return { name: user.name, email: user.email, totalCo2, role: user.role }
  }).filter((u) => u.role === "USER") // mostriamo solo gli USER

  // Utente più virtuoso — meno CO₂ con almeno un log
  const utentiConLog = co2PerUtente.filter((u) => u.totalCo2 > 0)
  const piuVirtuoso = utentiConLog.length > 0
    ? utentiConLog.reduce((min, u) => u.totalCo2 < min.totalCo2 ? u : min)
    : null

  // CO₂ per data — sommiamo tutti i log per giorno
  const co2PerData = logs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.totalCo2
    return acc
  }, {})

  const dateOrdinate = Object.keys(co2PerData).sort()

  const chartData = {
    labels: dateOrdinate,
    datasets: [
      {
        label: "CO₂ totale (kg)",
        data: dateOrdinate.map((d) => co2PerData[d].toFixed(2)),
        backgroundColor: "rgba(25, 135, 84, 0.7)",
        borderColor: "#198754",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "kg CO₂" },
      },
    },
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2 text-muted">Caricamento...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h4 className="fw-bold text-success mb-4">📊 Statistiche Globali</h4>

      {/* Cards statistiche */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Utenti registrati</p>
              <h2 className="fw-bold text-success">{totaleUser}</h2>
              <p className="text-muted small">utenti attivi</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Log totali</p>
              <h2 className="fw-bold text-success">{logs.length}</h2>
              <p className="text-muted small">giorni tracciati</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">CO₂ totale</p>
              <h2 className="fw-bold text-success">{co2Totale.toFixed(2)}</h2>
              <p className="text-muted small">kg emessi</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Media per log</p>
              <h2 className="fw-bold text-success">{co2Media.toFixed(2)}</h2>
              <p className="text-muted small">kg CO₂ / giorno</p>
            </div>
          </div>
        </div>

      </div>

      <div className="row g-4">

        {/* Grafico CO₂ per data */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">CO₂ emessa per giorno (tutti gli utenti)</h6>
              {logs.length === 0 ? (
                <p className="text-muted text-center py-3">Nessun dato disponibile.</p>
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Colonna destra */}
        <div className="col-lg-4">

          {/* Utente più virtuoso */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h6 className="fw-bold mb-3">🌿 Utente più virtuoso</h6>
              {piuVirtuoso ? (
                <>
                  <div
                    className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                  >
                    {piuVirtuoso.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="fw-bold mb-0">{piuVirtuoso.name}</p>
                  <p className="text-muted small">{piuVirtuoso.email}</p>
                  <span className="badge bg-success">
                    {piuVirtuoso.totalCo2.toFixed(2)} kg CO₂
                  </span>
                </>
              ) : (
                <p className="text-muted">Nessun dato disponibile.</p>
              )}
            </div>
          </div>

          {/* CO₂ per utente */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">CO₂ per utente</h6>
              {co2PerUtente.length === 0 ? (
                <p className="text-muted text-center">Nessun dato.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {co2PerUtente
                    .sort((a, b) => a.totalCo2 - b.totalCo2) // dal più virtuoso al meno
                    .map((u, index) => (
                      <li key={u.email} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <div className="d-flex align-items-center gap-2">
                          {/* Medaglia per i primi 3 */}
                          <span>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  "}</span>
                          <span className="small">{u.name}</span>
                        </div>
                        <span className="badge bg-success rounded-pill">
                          {u.totalCo2.toFixed(2)} kg
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default StatsPage