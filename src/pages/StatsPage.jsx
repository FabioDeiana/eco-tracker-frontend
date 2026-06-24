import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiFetch from "../api/apiFetch";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function StatsPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, logsData] = await Promise.all([
          apiFetch("/users"),
          apiFetch("/logs/all"),
        ]);
        setUsers(usersData.content);
        setLogs(logsData);
      } catch (err) {
        setError(t("stats.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const co2Totale = logs.reduce((sum, log) => sum + log.totalCo2, 0);
  const co2Media = logs.length > 0 ? co2Totale / logs.length : 0;
  const totaleUser = users.filter((u) => u.role === "USER").length;
  const co2PerUtente = users
    .map((user) => {
      const userLogs = logs.filter((log) => log.user.id === user.id);
      const totalCo2 = userLogs.reduce((sum, log) => sum + log.totalCo2, 0);
      return { name: user.name, email: user.email, totalCo2, role: user.role };
    })
    .filter((u) => u.role === "USER");

  const utentiConLog = co2PerUtente.filter((u) => u.totalCo2 > 0);
  const piuVirtuoso =
    utentiConLog.length > 0
      ? utentiConLog.reduce((min, u) => (u.totalCo2 < min.totalCo2 ? u : min))
      : null;

  const co2PerData = logs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.totalCo2;
    return acc;
  }, {});
  const dateOrdinate = Object.keys(co2PerData).sort();

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
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "kg CO₂" } },
    },
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status" />
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
        <h3
          style={{
            fontWeight: "800",
            color: "#1b4332",
            marginBottom: "32px",
            fontSize: "1.8rem",
          }}
        >
          {t("stats.title")}
        </h3>

        {/* Cards statistiche */}
        <div className="row g-3 mb-4">
          {[
            {
              icon: "👥",
              label: t("stats.registeredUsers"),
              value: totaleUser,
              sub: t("stats.activeUsers"),
              color: "#40916c",
            },
            {
              icon: "📅",
              label: t("stats.totalLogs"),
              value: logs.length,
              sub: t("stats.trackedDays"),
              color: "#2563eb",
            },
            {
              icon: "🏭",
              label: t("stats.totalCo2"),
              value: co2Totale.toFixed(2),
              sub: t("stats.emitted"),
              color: "#dc3545",
            },
            {
              icon: "📊",
              label: t("stats.avgPerLog"),
              value: co2Media.toFixed(2),
              sub: t("stats.avgUnit"),
              color: "#ca8a04",
            },
          ].map((card) => (
            <div key={card.label} className="col-md-3">
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                }}
              >
                <div style={{ height: "6px", backgroundColor: card.color }} />
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                    {card.icon}
                  </div>
                  <p
                    style={{
                      color: "#6c757d",
                      marginBottom: "4px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {card.label}
                  </p>
                  <h2
                    style={{
                      fontWeight: "800",
                      color: card.color,
                      fontSize: "2.2rem",
                      margin: "0",
                    }}
                  >
                    {card.value}
                  </h2>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                      marginTop: "4px",
                    }}
                  >
                    {card.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Grafico */}
          <div className="col-lg-8">
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
                  {t("stats.chartTitle")}
                </h6>
              </div>
              <div style={{ padding: "24px" }}>
                {logs.length === 0 ? (
                  <p
                    style={{
                      color: "#6c757d",
                      textAlign: "center",
                      padding: "40px 0",
                    }}
                  >
                    {t("stats.noData")}
                  </p>
                ) : (
                  <div style={{ height: "350px" }}>
                    <Bar
                      data={chartData}
                      options={{ ...chartOptions, maintainAspectRatio: false }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonna destra */}
          <div className="col-lg-4">
            {/* Utente più virtuoso */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
                marginBottom: "24px",
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
                  {t("stats.bestUser")}
                </h6>
              </div>
              <div style={{ padding: "24px", textAlign: "center" }}>
                {piuVirtuoso ? (
                  <>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "#1b4332",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.6rem",
                        fontWeight: "800",
                        margin: "0 auto 12px",
                      }}
                    >
                      {piuVirtuoso.name.charAt(0).toUpperCase()}
                    </div>
                    <p
                      style={{
                        fontWeight: "800",
                        color: "#1b4332",
                        marginBottom: "4px",
                      }}
                    >
                      {piuVirtuoso.name}
                    </p>
                    <p
                      style={{
                        color: "#6c757d",
                        fontSize: "0.85rem",
                        marginBottom: "12px",
                      }}
                    >
                      {piuVirtuoso.email}
                    </p>
                    <span
                      style={{
                        backgroundColor: "#f0fff4",
                        color: "#1b4332",
                        border: "1px solid #b7e4c7",
                        borderRadius: "50px",
                        padding: "6px 14px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      🌿 {piuVirtuoso.totalCo2.toFixed(2)} kg CO₂
                    </span>
                  </>
                ) : (
                  <p style={{ color: "#6c757d", padding: "20px 0" }}>
                    {t("stats.noData")}
                  </p>
                )}
              </div>
            </div>

            {/* Classifica */}
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
                  {t("stats.ranking")}
                </h6>
              </div>
              <div style={{ padding: "20px" }}>
                {co2PerUtente.filter((u) => u.totalCo2 > 0).length === 0 ? (
                  <p style={{ color: "#6c757d", textAlign: "center" }}>
                    {t("stats.noData")}
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {co2PerUtente
                      .filter((u) => u.totalCo2 > 0)
                      .sort((a, b) => a.totalCo2 - b.totalCo2)
                      .map((u, index) => (
                        <div
                          key={u.email}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 14px",
                            backgroundColor: "#f8faf9",
                            borderRadius: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>
                              {index === 0
                                ? "🥇"
                                : index === 1
                                  ? "🥈"
                                  : index === 2
                                    ? "🥉"
                                    : "  "}
                            </span>
                            <span
                              style={{
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                color: "#1b4332",
                              }}
                            >
                              {u.name}
                            </span>
                          </div>
                          <span
                            style={{
                              backgroundColor: "#f0fff4",
                              color: "#1b4332",
                              border: "1px solid #b7e4c7",
                              borderRadius: "50px",
                              padding: "3px 10px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}
                          >
                            {u.totalCo2.toFixed(2)} kg
                          </span>
                        </div>
                      ))}
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

export default StatsPage;
