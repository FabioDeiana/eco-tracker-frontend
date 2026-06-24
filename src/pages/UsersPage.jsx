import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiFetch from "../api/apiFetch";

function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiFetch("/users");
        setUsers(data.content);
      } catch (err) {
        setError(t("users.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setDeleteLoading(true);
    try {
      await apiFetch(`/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== userId));
      setDeleteConfirmId(null);
    } catch (err) {
      setError(t("users.deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangeRole = async (userId, ruoloAttuale) => {
    const nuovoRuolo = ruoloAttuale === "ADMIN" ? "USER" : "ADMIN";
    try {
      const updated = await apiFetch(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nuovoRuolo }),
      });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      );
    } catch (err) {
      setError(t("users.roleError"));
    }
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
          {t("users.title")}
        </h3>

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
              👥 {t("users.title")}
            </h6>
          </div>

          {users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>👥</div>
              <p style={{ color: "#6c757d" }}>{t("users.noUsers")}</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8faf9" }}>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "#1b4332",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("users.name")}
                    </th>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "#1b4332",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("users.email")}
                    </th>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "#1b4332",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("users.role")}
                    </th>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "#1b4332",
                        fontSize: "0.85rem",
                      }}
                    >
                      {t("users.registeredOn")}
                    </th>
                    <th style={{ padding: "14px 20px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <>
                      <tr
                        key={user.id}
                        style={{ borderTop: "1px solid #f0f0f0" }}
                      >
                        <td style={{ padding: "16px 20px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt="avatar"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  backgroundColor: "#1b4332",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "700",
                                  fontSize: "1rem",
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span
                              style={{ fontWeight: "700", color: "#1b4332" }}
                            >
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#6c757d",
                            fontSize: "0.9rem",
                          }}
                        >
                          {user.email}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              backgroundColor:
                                user.role === "ADMIN" ? "#fde8e8" : "#f0fff4",
                              color:
                                user.role === "ADMIN" ? "#dc3545" : "#1b4332",
                              border: `1px solid ${user.role === "ADMIN" ? "#f5c6cb" : "#b7e4c7"}`,
                              borderRadius: "50px",
                              padding: "4px 12px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            color: "#6c757d",
                            fontSize: "0.9rem",
                          }}
                        >
                          {new Date(user.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() =>
                                handleChangeRole(user.id, user.role)
                              }
                              style={{
                                padding: "6px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.82rem",
                                fontWeight: "600",
                                backgroundColor: "transparent",
                                border: `1.5px solid ${user.role === "ADMIN" ? "#ca8a04" : "#40916c"}`,
                                color:
                                  user.role === "ADMIN" ? "#ca8a04" : "#40916c",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  user.role === "ADMIN" ? "#fef9c3" : "#f0fff4";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                            >
                              {user.role === "ADMIN"
                                ? t("users.demote")
                                : t("users.promote")}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(user.id)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.82rem",
                                fontWeight: "600",
                                backgroundColor: "transparent",
                                border: "1.5px solid #dc3545",
                                color: "#dc3545",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#fde8e8")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              🗑️ {t("users.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {deleteConfirmId === user.id && (
                        <tr key={`confirm-${user.id}`}>
                          <td
                            colSpan={5}
                            style={{
                              backgroundColor: "#fde8e8",
                              padding: "16px 20px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{ color: "#dc3545", fontWeight: "600" }}
                              >
                                {t("users.confirmDelete")}{" "}
                                <strong>{user.name}</strong>?
                              </span>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  disabled={deleteLoading}
                                  style={{
                                    padding: "6px 16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    fontWeight: "600",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {deleteLoading
                                    ? t("users.deleting")
                                    : t("users.confirmYes")}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  style={{
                                    padding: "6px 16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                    color: "#6c757d",
                                    border: "1.5px solid #e9ecef",
                                    fontWeight: "600",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {t("users.cancel")}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
