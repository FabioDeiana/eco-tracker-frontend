import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

function DashboardPage() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const ACTIVITY_TYPES = [
    { value: "CAR", label: "🚗 " + t("activities.car"), unit: "km" },
    { value: "MEAT", label: "🥩 " + t("activities.meat"), unit: "kg" },
    {
      value: "ELECTRICITY",
      label: "⚡ " + t("activities.electricity"),
      unit: "kWh",
    },
    { value: "FLIGHT", label: "✈️ " + t("activities.flight"), unit: "km" },
    { value: "HEATING", label: "🔥 " + t("activities.heating"), unit: "kWh" },
  ];

  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [todayActivities, setTodayActivities] = useState([]);
  const [suggestedTips, setSuggestedTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ type: "CAR", value: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [mediaGlobale, setMediaGlobale] = useState(0);

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
        await fetchSuggestedTips(activities);
      }
    } catch (err) {
      setError(t("dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedTips = async (activities) => {
    if (activities.length === 0) {
      setSuggestedTips([]);
      return;
    }
    try {
      const categories = [...new Set(activities.map((a) => a.type))];
      const tipsArrays = await Promise.all(
        categories.map((cat) => apiFetch(`/tips/category?category=${cat}`)),
      );
      setSuggestedTips(tipsArrays.map((tips) => tips[0]).filter(Boolean));
    } catch (err) {
      setSuggestedTips([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location, i18n.language]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      let currentLogId = todayLog?.id;
      if (!currentLogId) {
        const newLog = await apiFetch("/logs", { method: "POST" });
        setTodayLog(newLog);
        currentLogId = newLog.id;
      }
      const newActivity = await apiFetch(`/logs/${currentLogId}/activities`, {
        method: "POST",
        body: JSON.stringify({
          type: formData.type,
          value: parseFloat(formData.value),
        }),
      });
      const updatedActivities = [...todayActivities, newActivity];
      setTodayActivities(updatedActivities);
      setTodayLog((prev) => ({
        ...prev,
        totalCo2: (prev?.totalCo2 || 0) + newActivity.co2Emission,
      }));
      await fetchSuggestedTips(updatedActivities);
      setFormData({ ...formData, value: "" });
    } catch (err) {
      setFormError(err.message || t("dashboard.addError"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId, co2Emission) => {
    try {
      await apiFetch(`/logs/${todayLog.id}/activities/${activityId}`, {
        method: "DELETE",
      });
      const updatedActivities = todayActivities.filter(
        (a) => a.id !== activityId,
      );
      setTodayActivities(updatedActivities);
      setTodayLog((prev) => ({
        ...prev,
        totalCo2: Math.max(0, (prev?.totalCo2 || 0) - co2Emission),
      }));
      await fetchSuggestedTips(updatedActivities);
    } catch (err) {
      setError(t("dashboard.deleteError"));
    }
  };

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
    plugins: { legend: { position: "top" } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "kg CO₂" } },
    },
  };

  const co2Oggi = todayLog ? todayLog.totalCo2 : 0;
  const differenza = co2Oggi - mediaGlobale;
  const isMeglio = differenza < 0;
  const selectedType = ACTIVITY_TYPES.find((a) => a.value === formData.type);

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2 text-muted">Caricamento...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#f8faf9",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <div className="container" style={{ paddingTop: "40px" }}>
        {/* Titolo */}
        <h3
          style={{
            fontWeight: "800",
            color: "#1b4332",
            marginBottom: "32px",
            fontSize: "1.8rem",
          }}
        >
          {t("dashboard.title")}
        </h3>

        {/* Cards CO₂ */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "6px", backgroundColor: "#40916c" }} />
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌱</div>
                <p
                  style={{
                    color: "#6c757d",
                    marginBottom: "4px",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("dashboard.co2Today")}
                </p>
                <h2
                  style={{
                    fontWeight: "800",
                    color: "#1b4332",
                    fontSize: "2.2rem",
                    margin: "0",
                  }}
                >
                  {co2Oggi.toFixed(2)}
                </h2>
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  kg CO₂
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "6px",
                  backgroundColor: isMeglio ? "#40916c" : "#dc3545",
                }}
              />
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                  {isMeglio ? "🌍" : "⚠️"}
                </div>
                <p
                  style={{
                    color: "#6c757d",
                    marginBottom: "4px",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("dashboard.vsGlobal")}
                </p>
                {todayActivities.length === 0 ? (
                  <>
                    <h2
                      style={{
                        fontWeight: "800",
                        color: "#adb5bd",
                        fontSize: "2.2rem",
                        margin: "0",
                      }}
                    >
                      —
                    </h2>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.85rem",
                        marginTop: "4px",
                      }}
                    >
                      {t("dashboard.noActivities")}
                    </p>
                  </>
                ) : (
                  <>
                    <h2
                      style={{
                        fontWeight: "800",
                        color: isMeglio ? "#1b4332" : "#dc3545",
                        fontSize: "2.2rem",
                        margin: "0",
                      }}
                    >
                      {isMeglio ? "" : "+"}
                      {differenza.toFixed(2)} kg
                    </h2>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.85rem",
                        marginTop: "4px",
                      }}
                    >
                      {isMeglio
                        ? t("dashboard.belowAverage")
                        : t("dashboard.aboveAverage")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "6px", backgroundColor: "#2563eb" }} />
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📋</div>
                <p
                  style={{
                    color: "#6c757d",
                    marginBottom: "4px",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("dashboard.activitiesCount")}
                </p>
                <h2
                  style={{
                    fontWeight: "800",
                    color: "#2563eb",
                    fontSize: "2.2rem",
                    margin: "0",
                  }}
                >
                  {todayActivities.length}
                </h2>
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {t("dashboard.activitiesRegistered")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Colonna sinistra */}
          <div className="col-lg-5">
            {/* Form aggiungi attività */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <div style={{ backgroundColor: "#1b4332", padding: "16px 20px" }}>
                <h6
                  style={{
                    color: "white",
                    fontWeight: "700",
                    margin: 0,
                    fontSize: "0.95rem",
                  }}
                >
                  ➕ {t("dashboard.addActivity")}
                </h6>
              </div>
              <div style={{ padding: "20px" }}>
                {formError && (
                  <div className="alert alert-danger py-2">{formError}</div>
                )}
                <form onSubmit={handleAddActivity}>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                    >
                      {t("dashboard.type")}
                    </label>
                    <select
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleChange}
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    >
                      {ACTIVITY_TYPES.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                    >
                      {t("dashboard.quantity")} ({selectedType.unit})
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
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#1b4332",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2d6a4f")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1b4332")
                    }
                  >
                    {formLoading
                      ? t("dashboard.adding")
                      : t("dashboard.addButton")}
                  </button>
                </form>
              </div>
            </div>

            {/* Attività di oggi */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <div style={{ backgroundColor: "#2563eb", padding: "16px 20px" }}>
                <h6
                  style={{
                    color: "white",
                    fontWeight: "700",
                    margin: 0,
                    fontSize: "0.95rem",
                  }}
                >
                  📋 {t("dashboard.todayActivities")}
                </h6>
              </div>
              <div style={{ padding: "20px" }}>
                {todayActivities.length === 0 ? (
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      padding: "20px 0",
                      margin: 0,
                    }}
                  >
                    {t("dashboard.noTodayActivities")}
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {todayActivities.map((activity) => (
                      <div
                        key={activity.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          backgroundColor: "#f8faf9",
                          borderRadius: "12px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: "600",
                              fontSize: "0.9rem",
                            }}
                          >
                            {ACTIVITY_TYPES.find(
                              (a) => a.value === activity.type,
                            )?.label || activity.type}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.8rem",
                              color: "#6c757d",
                            }}
                          >
                            {activity.value}{" "}
                            {
                              ACTIVITY_TYPES.find(
                                (a) => a.value === activity.type,
                              )?.unit
                            }
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#f0fff4",
                              color: "#1b4332",
                              border: "1px solid #b7e4c7",
                              borderRadius: "50px",
                              padding: "4px 10px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}
                          >
                            {activity.co2Emission?.toFixed(2)} kg CO₂
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteActivity(
                                activity.id,
                                activity.co2Emission,
                              )
                            }
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #f8d7da",
                              borderRadius: "8px",
                              padding: "4px 8px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              color: "#dc3545",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f8d7da")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Consigli */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div style={{ backgroundColor: "#40916c", padding: "16px 20px" }}>
                <h6
                  style={{
                    color: "white",
                    fontWeight: "700",
                    margin: 0,
                    fontSize: "0.95rem",
                  }}
                >
                  {t("dashboard.tips")}
                </h6>
              </div>
              <div style={{ padding: "20px" }}>
                {suggestedTips.length === 0 ? (
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      padding: "20px 0",
                      margin: 0,
                    }}
                  >
                    {t("dashboard.noTips")}
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {suggestedTips.map((tip) => (
                      <div
                        key={tip.id}
                        style={{
                          backgroundColor: "#f0fff4",
                          borderRadius: "12px",
                          padding: "14px 16px",
                          borderLeft: "3px solid #40916c",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: "#d4edda",
                            color: "#1b4332",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {ACTIVITY_TYPES.find((a) => a.value === tip.category)
                            ?.label || tip.category}
                        </span>
                        <p
                          style={{
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            margin: "8px 0 4px",
                          }}
                        >
                          {i18n.language.startsWith("en") && tip.titleEn
                            ? tip.titleEn
                            : tip.title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            color: "#6c757d",
                            margin: "0 0 6px",
                          }}
                        >
                          {i18n.language.startsWith("en") && tip.descriptionEn
                            ? tip.descriptionEn
                            : tip.description}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "#40916c",
                            fontWeight: "600",
                            margin: 0,
                          }}
                        >
                          🌿 {t("tips.savingEstimate")}: {tip.co2SavedEstimate}{" "}
                          kg CO₂
                        </p>
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
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div style={{ backgroundColor: "#1b4332", padding: "16px 20px" }}>
                <h6
                  style={{
                    color: "white",
                    fontWeight: "700",
                    margin: 0,
                    fontSize: "0.95rem",
                  }}
                >
                  📈 {t("dashboard.chart")}
                </h6>
              </div>
              <div style={{ padding: "24px", minHeight: "500px" }}>
                {logs.length === 0 ? (
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      padding: "40px 0",
                    }}
                  >
                    {t("dashboard.noData")}
                  </p>
                ) : (
                  <div style={{ height: "420px" }}>
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
