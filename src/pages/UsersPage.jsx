import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import apiFetch from "../api/apiFetch"

function UsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiFetch("/users")
        setUsers(data.content)
      } catch (err) {
        setError(t("users.loadError"))
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleDelete = async (userId) => {
    setDeleteLoading(true)
    try {
      await apiFetch(`/users/${userId}`, { method: "DELETE" })
      setUsers(users.filter((u) => u.id !== userId))
      setDeleteConfirmId(null)
    } catch (err) {
      setError(t("users.deleteError"))
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleChangeRole = async (userId, ruoloAttuale) => {
    const nuovoRuolo = ruoloAttuale === "ADMIN" ? "USER" : "ADMIN"
    try {
      const updated = await apiFetch(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nuovoRuolo }),
      })
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)))
    } catch (err) {
      setError(t("users.roleError"))
    }
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
        <h4 className="fw-bold text-success mb-4">{t("users.title")}</h4>

        <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
          <div className="card-body p-0">
            {users.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "3rem" }}>👥</div>
                <p className="text-muted mt-2">{t("users.noUsers")}</p>
              </div>
            ) : (
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#d4edda" }}>
                  <tr>
                    <th className="ps-4 py-3">{t("users.name")}</th>
                    <th className="py-3">{t("users.email")}</th>
                    <th className="py-3">{t("users.role")}</th>
                    <th className="py-3">{t("users.registeredOn")}</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <>
                      <tr key={user.id}>
                        <td className="ps-4">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" className="rounded-circle me-2"
                              style={{ width: "36px", height: "36px", objectFit: "cover" }} />
                          ) : (
                            <span className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center me-2"
                              style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}>
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="fw-bold">{user.name}</span>
                        </td>
                        <td className="text-muted">{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-success"}`}
                            style={{ borderRadius: "8px" }}>
                            {user.role}
                          </span>
                        </td>
                        <td className="text-muted">
                          {new Date(user.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className={`btn btn-sm ${user.role === "ADMIN" ? "btn-outline-warning" : "btn-outline-success"}`}
                              style={{ borderRadius: "8px" }}
                              onClick={() => handleChangeRole(user.id, user.role)}
                            >
                              {user.role === "ADMIN" ? t("users.demote") : t("users.promote")}
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              style={{ borderRadius: "8px" }}
                              onClick={() => setDeleteConfirmId(user.id)}
                            >
                              🗑️ {t("users.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {deleteConfirmId === user.id && (
                        <tr key={`confirm-${user.id}`}>
                          <td colSpan={5} style={{ backgroundColor: "#fde8e8" }}>
                            <div className="d-flex align-items-center justify-content-between px-2">
                              <span className="text-danger fw-bold">
                                {t("users.confirmDelete")} <strong>{user.name}</strong>?
                              </span>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-danger btn-sm"
                                  style={{ borderRadius: "8px" }}
                                  onClick={() => handleDelete(user.id)}
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? t("users.deleting") : t("users.confirmYes")}
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  style={{ borderRadius: "8px" }}
                                  onClick={() => setDeleteConfirmId(null)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersPage