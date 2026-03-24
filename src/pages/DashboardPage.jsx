import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiFetch from "../api/apiFetch";

// Registriamo i componenti di Chart.js — Filler serve per il fill: true del grafico
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

const ACTIVITY_TYPES = [
  { value: "CAR", label: "🚗 Auto", unit: "km" },
  { value: "MEAT", label: "🥩 Carne", unit: "kg" },
  { value: "ELECTRICITY", label: "⚡ Elettricità", unit: "kWh" },
  { value: "FLIGHT", label: "✈️ Volo", unit: "km" },
  { value: "HEATING", label: "🔥 Riscaldamento", unit: "kWh" },
];

function DashboardPage() {
  const location = useLocation();

  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [todayActivities, setTodayActivities] = useState([]);
  const [suggestedTips, setSuggestedTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stato form aggiunta attività
  const [formData, setFormData] = useState({ type: "CAR", value: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [mediaGlobale, setMediaGlobale] = useState(0);

  // Carica i dati della dashboard
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [allLogs, todayLogs, media] = await Promise.all([
        apiFetch("/logs/me"),
        apiFetch("/logs/me/today"),
        apiFetch("/logs/stats/media"),
      ]);

      setLogs(allLogs);
      setMediaGlobale(parseFloat(media));

      const today = todayLogs.length > 0 ? todayLogs[0] : null;
      setTodayLog(today);

      if (today) {
        const activities = await apiFetch(`/logs/${today.id}/activities`);
        setTodayActivities(activities);

        // Carichiamo i tips suggeriti in base alle categorie delle attività di oggi
        await fetchSuggestedTips(activities);
      }
    } catch (err) {
      console.log("ERRORE:", err);
      setError("Errore nel caricamento dei dati");
    } finally {
      setLoading(false);
    }
  };

  // Carica i green tips in base alle attività registrate oggi
  const fetchSuggestedTips = async (activities) => {
    if (activities.length === 0) {
      setSuggestedTips([]);
      return;
    }

    try {
      // Prendiamo le categorie uniche delle attività di oggi
      const categories = [...new Set(activities.map((a) => a.type))];

      // Per ogni categoria carichiamo i tips — in parallelo
      const tipsArrays = await Promise.all(
        categories.map((cat) => apiFetch(`/tips/category?category=${cat}`)),
      );

      // Uniamo tutti i tips in un unico array
      const allTips = tipsArrays.map(tips => tips[0]).filter(Boolean);
      setSuggestedTips(allTips);
    } catch (err) {
      // Se fallisce non blocchiamo la dashboard — i tips sono opzionali
      setSuggestedTips([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Aggiunge una nuova attività — crea il log se non esiste ancora
  const handleAddActivity = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      // Se non esiste ancora il log di oggi lo creiamo
      let currentLogId = todayLog?.id;
      if (!currentLogId) {
        const newLog = await apiFetch("/logs", { method: "POST" });
        setTodayLog(newLog);
        currentLogId = newLog.id;
      }

      // Aggiungiamo l'attività al log
      const newActivity = await apiFetch(`/logs/${currentLogId}/activities`, {
        method: "POST",
        body: JSON.stringify({
          type: formData.type,
          value: parseFloat(formData.value),
        }),
      });

      // Aggiorniamo la lista attività localmente
      const updatedActivities = [...todayActivities, newActivity];
      setTodayActivities(updatedActivities);

      // Aggiorniamo il totale CO₂ localmente
      setTodayLog((prev) => ({
        ...prev,
        totalCo2: (prev?.totalCo2 || 0) + newActivity.co2Emission,
      }));

      // Aggiorniamo i tips suggeriti
      await fetchSuggestedTips(updatedActivities);

      // Resettiamo il form
      setFormData({ ...formData, value: "" });
    } catch (err) {
      setFormError(err.message || "Errore durante l'aggiunta dell'attività");
    } finally {
      setFormLoading(false);
    }
  };

  // Elimina un'attività
  const handleDeleteActivity = async (activityId, co2Emission) => {
    try {
      await apiFetch(`/logs/${todayLog.id}/activities/${activityId}`, {
        method: "DELETE",
      });

      // Aggiorniamo la lista attività localmente
      const updatedActivities = todayActivities.filter(
        (a) => a.id !== activityId,
      );
      setTodayActivities(updatedActivities);

      // Sottraiamo la CO₂ dal totale
      setTodayLog((prev) => ({
        ...prev,
        totalCo2: Math.max(0, (prev?.totalCo2 || 0) - co2Emission),
      }));

      // Aggiorniamo i tips suggeriti
      await fetchSuggestedTips(updatedActivities);
    } catch (err) {
      setError("Errore durante l'eliminazione dell'attività");
    }
  };

  // Dati per il grafico
  const ultimi7 = logs.slice(-7);
  const chartData = {
    labels: ultimi7.map((log) => log.date),
    datasets: [
      {
        label: "CO₂ (kg)",
        data: ultimi7.map((log) => log.totalCo2),
        borderColor: "#198754",
        backgroundColor: "rgba(25, 135, 84, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "kg CO₂" },
      },
    },
  };

  const co2Oggi = todayLog ? todayLog.totalCo2 : 0;

  const differenza = co2Oggi - mediaGlobale;
  const isMeglio = differenza < 0;

  const selectedType = ACTIVITY_TYPES.find((a) => a.value === formData.type);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2 text-muted">Caricamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f6f5", minHeight: "100vh" }}>
      <div className="container mt-4 mb-5 pt-3">
        <h4 className="fw-bold text-success mb-4">La tua Dashboard</h4>

        {/* Cards CO₂ */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div
              className="card shadow-sm h-100 border-0"
              style={{
                background: "linear-gradient(135deg, #d4edda, #f0fff4)",
              }}
            >
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>🌱</div>
                <p className="text-muted mb-1 mt-2">CO₂ oggi</p>
                <h2 className="fw-bold text-success">{co2Oggi.toFixed(2)}</h2>
                <p className="text-muted small">kg CO₂</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card shadow-sm h-100 border-0"
              style={{
                background: isMeglio
                  ? "linear-gradient(135deg, #d4edda, #f0fff4)"
                  : "linear-gradient(135deg, #fde8e8, #fff5f5)",
              }}
            >
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>{isMeglio ? "🌍" : "⚠️"}</div>
                <p className="text-muted mb-1 mt-2">Vs media globale</p>
                {todayActivities.length === 0 ? (
                  <>
                    <h2 className="fw-bold text-muted">—</h2>
                    <p className="text-muted small">Nessuna attività oggi</p>
                  </>
                ) : (
                  <>
                    <h2
                      className={`fw-bold ${isMeglio ? "text-success" : "text-danger"}`}
                    >
                      {isMeglio ? "" : "+"}
                      {differenza.toFixed(2)}
                    </h2>
                    <p className="small text-muted">
                      {isMeglio
                        ? "🌿 Sotto la media globale!"
                        : "⚠️ Sopra la media globale"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card shadow-sm h-100 border-0"
              style={{
                background: "linear-gradient(135deg, #dbeafe, #f0f7ff)",
              }}
            >
              <div className="card-body text-center py-4">
                <div style={{ fontSize: "2rem" }}>📋</div>
                <p className="text-muted mb-1 mt-2">Attività oggi</p>
                <h2 className="fw-bold" style={{ color: "#2563eb" }}>
                  {todayActivities.length}
                </h2>
                <p className="text-muted small">attività registrate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Colonna sinistra — form + attività + consigli */}
          <div className="col-lg-5">
            {/* Form aggiunta attività */}
            <div
              className="card shadow-sm mb-4 border-0"
              style={{ borderRadius: "16px", borderLeft: "4px solid #198754" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3">➕ Aggiungi attività</h6>
                {formError && (
                  <div className="alert alert-danger py-2">{formError}</div>
                )}
                <form onSubmit={handleAddActivity}>
                  <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      {ACTIVITY_TYPES.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Quantità ({selectedType.unit})
                    </label>
                    <input
                      type="number"
                      name="value"
                      className="form-control"
                      placeholder={`es. 10 ${selectedType.unit}`}
                      value={formData.value}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={formLoading}
                  >
                    {formLoading ? "Aggiunta..." : "Aggiungi attività"}
                  </button>
                </form>
              </div>
            </div>

            {/* Lista attività di oggi */}
            <div
              className="card shadow-sm mb-4 border-0"
              style={{ borderRadius: "16px", borderLeft: "4px solid #0d6efd" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3">📋 Attività di oggi</h6>
                {todayActivities.length === 0 ? (
                  <p className="text-muted text-center py-3">
                    Nessuna attività registrata oggi.
                  </p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {todayActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                        <div>
                          <span>
                            {ACTIVITY_TYPES.find(
                              (a) => a.value === activity.type,
                            )?.label || activity.type}
                          </span>
                          <br />
                          <small className="text-muted">
                            {activity.value}{" "}
                            {
                              ACTIVITY_TYPES.find(
                                (a) => a.value === activity.type,
                              )?.unit
                            }
                          </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-success rounded-pill">
                            {activity.co2Emission?.toFixed(2)} kg CO₂
                          </span>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              handleDeleteActivity(
                                activity.id,
                                activity.co2Emission,
                              )
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Green Tips */}
            <div
              className="card shadow-sm mb-4 border-0"
              style={{ borderRadius: "16px", borderLeft: "4px solid #20c997" }}
            >
              <div className="card-body">
                <h6 className="fw-bold mb-3">🌿 Consigli per te</h6>
                {suggestedTips.length === 0 ? (
                  <p className="text-muted text-center py-3">
                    Aggiungi attività per ricevere consigli personalizzati.
                  </p>
                ) : (
                  <div className="row g-2">
                    {suggestedTips.map((tip) => (
                      <div key={tip.id} className="col-12">
                        <div
                          className="card border-0"
                          style={{
                            backgroundColor: "#f0fff8",
                            borderRadius: "12px",
                          }}
                        >
                          <div className="card-body py-2">
                            <span className="badge bg-success mb-1">
                              {ACTIVITY_TYPES.find(
                                (a) => a.value === tip.category,
                              )?.label || tip.category}
                            </span>
                            <p className="fw-bold mb-1 small">{tip.title}</p>
                            <p className="text-muted mb-1 small">
                              {tip.description}
                            </p>
                            <small className="text-success">
                              🌿 Risparmio stimato: {tip.co2SavedEstimate} kg
                              CO₂
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonna destra — grafico */}
          <div className="col-lg-7">
            <div
              className="card shadow-sm mb-4 border-0"
              style={{ borderRadius: "16px" }}
            >
              <div className="card-body" style={{ minHeight: "600px" }}>
                <h6 className="fw-bold mb-3">
                  📈 Storico CO₂ (ultimi 7 giorni)
                </h6>
                {logs.length === 0 ? (
                  <p className="text-muted text-center py-3">
                    Nessun dato disponibile ancora.
                  </p>
                ) : (
                  <div style={{ height: "400px" }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
