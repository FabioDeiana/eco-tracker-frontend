import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiFetch from "../api/apiFetch"

function ProfilePage() {
  const navigate = useNavigate()

  // Dati dell'utente
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Stato per il form di modifica
  const [showEditForm, setShowEditForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  // Stato per conferma eliminazione account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Carichiamo i dati dell'utente loggato
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/users/me")
        setUser(data)
        // Precompiliamo il form con i dati attuali
        setFormData({ name: data.name, email: data.email, password: "" })
      } catch (err) {
        setError("Errore nel caricamento del profilo")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Aggiorna il profilo
  const handleUpdate = async (e) => {
    e.preventDefault()
    setEditError("")
    setEditSuccess("")
    setEditLoading(true)

    try {
      const updated = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      })
      setUser(updated)
      setEditSuccess("Profilo aggiornato!")
      setShowEditForm(false)
    } catch (err) {
      setEditError(err.message || "Errore durante l'aggiornamento")
    } finally {
      setEditLoading(false)
    }
  }

  // Elimina l'account
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await apiFetch("/users/me", { method: "DELETE" })
      // Rimuoviamo il token e mandiamo al login
      localStorage.removeItem("token")
      navigate("/login")
    } catch (err) {
      setError("Errore durante l'eliminazione dell'account")
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
      <h4 className="fw-bold text-success mb-4">Il tuo Profilo</h4>

      <div className="row justify-content-center">
        <div className="col-md-6">

          {/* Card dati profilo */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">

              <div className="text-center mb-4">
                {/* Avatar con iniziale del nome */}
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-bold mb-0">{user.name}</h5>
                <p className="text-muted">{user.email}</p>
                <span className="badge bg-success">{user.role}</span>
              </div>

              <hr />

              <div className="mb-2">
                <small className="text-muted">Membro dal</small>
                <p className="mb-0">{new Date(user.createdAt).toLocaleDateString("it-IT")}</p>
              </div>

              {editSuccess && <div className="alert alert-success py-2 mt-3">{editSuccess}</div>}

              {/* Bottoni azioni */}
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => setShowEditForm(!showEditForm)}
                >
                  {showEditForm ? "Annulla" : "✏️ Modifica profilo"}
                </button>
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  🗑️ Elimina account
                </button>
              </div>

            </div>
          </div>

          {/* Form modifica profilo */}
          {showEditForm && (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Modifica profilo</h6>

                {editError && <div className="alert alert-danger py-2">{editError}</div>}

                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
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
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nuova password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Lascia vuoto per non cambiarla"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={editLoading}
                  >
                    {editLoading ? "Salvataggio..." : "Salva modifiche"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Conferma eliminazione account */}
          {showDeleteConfirm && (
            <div className="card shadow-sm border-danger mb-4">
              <div className="card-body">
                <h6 className="fw-bold text-danger mb-2">⚠️ Sei sicuro?</h6>
                <p className="text-muted small">
                  Eliminando il tuo account perderai tutti i tuoi dati, log e attività. Questa azione è irreversibile.
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Eliminazione..." : "Sì, elimina account"}
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProfilePage