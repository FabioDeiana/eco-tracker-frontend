import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js"
import apiFetch from "../api/apiFetch"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function StatsPage() {
  const { t } = useTranslation()
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
        setError(t("stats.loadError"))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const co2Totale = logs.reduce((sum, log) => sum + log.totalCo2, 0)
  const co2Media = logs.length > 0 ? co2Totale / logs.length : 0
  const totaleUser = users.filter((u) => u.role === "USER").length
  const co2PerUtente = users.map((user) => {
    const userLogs = logs.filter((log) => log.user.id === user.id)
    const totalCo2 = userLogs.reduce((sum, log) => sum + log.totalCo2, 0)
    return { name: user.name, email: user.email, totalCo2, role: user.role }
  }).filter((u) => u.role === "USER")

  const utentiConLog = co2PerUtente.filter((u) => u.totalCo2 > 0)
  const piuVirtuoso = utentiConLog.length > 0
    ? utentiConLog.reduce((min, u) => u.totalCo2 < min.totalCo2 ? u : min)
    : null

  const co2PerData = logs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.totalCo2
    return acc
  }, {})
  const dateOrdinate = Object.keys(co2PerData).sort()

  const chartData = {
    labels: dateOrdinate,
    datasets: [{
      label: "CO₂ totale (kg)",
      data: dateOrdinate.map((d) => co2PerData[d].toFixed(2)),
      backgroundColor: "rgba(25, 135, 84, 0.7)",
      borderColor: "#198754",
      borderWidth: 1,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, title: { display: true, text: "kg CO₂" } } },
  }

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-success" role="status" />
    </div>
  )

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">{error}</div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "3rem" }}>
      <div className="container">
        <h4 className="fw-bold text-success mb-4">{t("stats.title")}</h4>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #d4edda, #f0fff4)" }}>
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>👥</div>
                <p className="text-muted mb-1 mt-2">{t("stats.registeredUsers")}</p>
                <h2 className="fw-bold text-success">{totaleUser}</h2>
                <p className="text-muted small">{t("stats.activeUsers")}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #dbeafe, #f0f7ff)" }}>
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>📅</div>
                <p className="text-muted mb-1 mt-2">{t("stats.totalLogs")}</p>
                <h2 className="fw-bold" style={{ color: "#2563eb" }}>{logs.length}</h2>
                <p className="text-muted small">{t("stats.trackedDays")}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #fde8e8, #fff5f5)" }}>
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>🏭</div>
                <p className="text-muted mb-1 mt-2">{t("stats.totalCo2")}</p>
                <h2 className="fw-bold text-danger">{co2Totale.toFixed(2)}</h2>
                <p className="text-muted small">{t("stats.emitted")}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #fef9c3, #fffde7)" }}>
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>📊</div>
                <p className="text-muted mb-1 mt-2">{t("stats.avgPerLog")}</p>
                <h2 className="fw-bold" style={{ color: "#ca8a04" }}>{co2Media.toFixed(2)}</h2>
                <p className="text-muted small">{t("stats.avgUnit")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">{t("stats.chartTitle")}</h6>
                {logs.length === 0 ? (
                  <p className="text-muted text-center py-3">{t("stats.noData")}</p>
                ) : (
                  <div style={{ height: "350px" }}>
                    <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #d4edda, #f0fff4)" }}>
              <div className="card-body text-center py-4">
                <h6 className="fw-bold mb-3">{t("stats.bestUser")}</h6>
                {piuVirtuoso ? (
                  <>
                    <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}>
                      {piuVirtuoso.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="fw-bold mb-0">{piuVirtuoso.name}</p>
                    <p className="text-muted small">{piuVirtuoso.email}</p>
                    <span className="badge bg-success">{piuVirtuoso.totalCo2.toFixed(2)} kg CO₂</span>
                  </>
                ) : (
                  <p className="text-muted">{t("stats.noData")}</p>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">{t("stats.ranking")}</h6>
                {co2PerUtente.filter((u) => u.totalCo2 > 0).length === 0 ? (
                  <p className="text-muted text-center">{t("stats.noData")}</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {co2PerUtente
                      .filter((u) => u.totalCo2 > 0)
                      .sort((a, b) => a.totalCo2 - b.totalCo2)
                      .map((u, index) => (
                        <li key={u.email} className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div className="d-flex align-items-center gap-2">
                            <span>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  "}</span>
                            <span className="small">{u.name}</span>
                          </div>
                          <span className="badge bg-success rounded-pill">{u.totalCo2.toFixed(2)} kg</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage