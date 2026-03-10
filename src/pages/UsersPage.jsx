import { useState, useEffect } from "react"
import apiFetch from "../api/apiFetch"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ID dell'utente di cui stiamo chiedendo conferma eliminazione
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Carichiamo tutti gli utenti
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // GET /users ritorna una Page — i dati sono nel campo "content"
        const data = await apiFetch("/users")
        setUsers(data.content)
      } catch (err) {
        setError("Errore nel caricamento degli utenti")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Elimina un utente
  const handleDelete = async (userId) => {
    setDeleteLoading(true)
    try {
      await apiFetch(`/users/${userId}`, { method: "DELETE" })
      // Rimuoviamo l'utente dalla lista locale
      setUsers(users.filter((u) => u.id !== userId))
      setDeleteConfirmId(null)
    } catch (err) {
      setError("Errore durante l'eliminazione dell'utente")
    } finally {
      setDeleteLoading(false)
    }
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
      <h4 className="fw-bold text-success mb-4">Gestione Utenti</h4>

      <div className="card shadow-sm">
        <div className="card-body">

          {users.length === 0 ? (
            <p className="text-muted text-center py-3">Nessun utente registrato.</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ruolo</th>
                  <th>Registrato il</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <>
                    <tr key={user.id}>
                      <td>
                        {/* Avatar con iniziale */}
                        <span
                          className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center me-2"
                          style={{ width: "32px", height: "32px", fontSize: "0.9rem" }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-success"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString("it-IT")}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setDeleteConfirmId(user.id)}
                        >
                          🗑️ Elimina
                        </button>
                      </td>
                    </tr>

                    {/* Riga di conferma eliminazione — appare sotto l'utente selezionato */}
                    {deleteConfirmId === user.id && (
                      <tr key={`confirm-${user.id}`} className="table-danger">
                        <td colSpan={5}>
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="text-danger fw-bold">
                              ⚠️ Sei sicuro di voler eliminare <strong>{user.name}</strong>?
                            </span>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(user.id)}
                                disabled={deleteLoading}
                              >
                                {deleteLoading ? "Eliminazione..." : "Sì, elimina"}
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                Annulla
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
  )
}

export default UsersPage