import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import { useLocation } from "react-router-dom"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import apiFetch from "../api/apiFetch"

// Registriamo i componenti di Chart.js che useremo
// Senza questa registrazione il grafico non funziona
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Media globale CO₂ pro capite al giorno in kg (fonte: Our World in Data)
const MEDIA_GLOBALE_KG = 13.0

function DashboardPage() {
  const location = useLocation()
  // Lista di tutti i log storici dell'utente
  const [logs, setLogs] = useState([])

  // Log di oggi (array perché l'endpoint ritorna una lista)
  const [todayLog, setTodayLog] = useState(null)

  // Attività di oggi
  const [todayActivities, setTodayActivities] = useState([])

  // Stato di caricamento e errore
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // useEffect — viene eseguito una volta quando la pagina si carica
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData eseguita!")
      try {
        // Carichiamo tutti i log storici e il log di oggi in parallelo
        const [allLogs, todayLogs] = await Promise.all([
          apiFetch("/logs/me"),
          apiFetch("/logs/me/today"),
        ])

        setLogs(allLogs)

        // today è il primo elemento dell'array (se esiste)
        const today = todayLogs.length > 0 ? todayLogs[0] : null
        setTodayLog(today)

        // Se esiste il log di oggi, carichiamo anche le sue attività
        if (today) {
          const activities = await apiFetch(`/logs/${today.id}/activities`)
          setTodayActivities(activities)
        }

      } catch (err) {
        console.log("Errore fetchData:", err)
        setError("Errore nel caricamento dei dati")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location])

  // Prepariamo i dati per il grafico — ultimi 7 log
  const ultimi7 = logs.slice(-7)
  const chartData = {
    labels: ultimi7.map((log) => log.date),
    datasets: [
      {
        label: "CO₂ (kg)",
        data: ultimi7.map((log) => log.totalCo2),
        borderColor: "#198754",
        backgroundColor: "rgba(25, 135, 84, 0.1)",
        tension: 0.4, // rende la linea curva
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "kg CO₂" },
      },
    },
  }

  // CO₂ di oggi — 0 se non c'è ancora un log
  const co2Oggi = todayLog ? todayLog.totalCo2 : 0

  // Confronto con la media globale in percentuale
  const differenza = co2Oggi - MEDIA_GLOBALE_KG
  const isMeglio = differenza < 0

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
      <h4 className="fw-bold text-success mb-4">La tua Dashboard</h4>

      {/* Riga cards in cima */}
      <div className="row g-3 mb-4">

        {/* Card CO₂ oggi */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">CO₂ oggi</p>
              <h2 className="fw-bold text-success">{co2Oggi.toFixed(2)}</h2>
              <p className="text-muted">kg CO₂</p>
            </div>
          </div>
        </div>

        {/* Card confronto media globale */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Vs media globale</p>
              <h2 className={`fw-bold ${isMeglio ? "text-success" : "text-danger"}`}>
                {isMeglio ? "" : "+"}{differenza.toFixed(2)}
              </h2>
              <p className="text-muted">
                {isMeglio ? "🌿 Sotto la media!" : "⚠️ Sopra la media"}
              </p>
            </div>
          </div>
        </div>

        {/* Card attività oggi */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Attività oggi</p>
              <h2 className="fw-bold text-success">{todayActivities.length}</h2>
              <p className="text-muted">attività registrate</p>
            </div>
          </div>
        </div>

      </div>

      {/* Grafico storico */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Storico CO₂ (ultimi 7 giorni)</h6>
          {logs.length === 0 ? (
            <p className="text-muted text-center py-3">
              Nessun dato disponibile — inizia registrando le tue attività!
            </p>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Attività di oggi */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Attività di oggi</h6>
          {todayActivities.length === 0 ? (
            <p className="text-muted text-center py-3">
              Nessuna attività registrata oggi.
            </p>
          ) : (
            <ul className="list-group list-group-flush">
              {todayActivities.map((activity) => (
                <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{activity.activityType}</span>
                  <span className="badge bg-success rounded-pill">
                    {activity.co2Emission?.toFixed(2)} kg CO₂
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  )
}

export default DashboardPage