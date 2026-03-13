import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import apiFetch from "../api/apiFetch"

function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showEditForm, setShowEditForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Stato per l'upload dell'avatar
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarError, setAvatarError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/users/me")
        setUser(data)
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

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await apiFetch("/users/me", { method: "DELETE" })
      localStorage.removeItem("token")
      navigate("/login")
    } catch (err) {
      setError("Errore durante l'eliminazione dell'account")
      setDeleteLoading(false)
    }
  }

  // Gestisce il cambio avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatarError("")
    setAvatarLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/avatar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // NON impostare Content-Type: il browser lo gestisce automaticamente per FormData
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Errore durante il caricamento dell'avatar")

      const updated = await res.json()
      setUser(updated)
    } catch (err) {
      setAvatarError("Errore nel caricamento dell'immagine")
    } finally {
      setAvatarLoading(false)
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

          <div className="card shadow-sm mb-4">
            <div className="card-body">

              <div className="text-center mb-4">

                {/* Avatar: immagine se presente, altrimenti iniziale */}
                <div className="position-relative d-inline-block mb-3">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Pulsante modifica avatar sovrapposto */}
                  <button
                    className="btn btn-sm btn-success rounded-circle position-absolute"
                    style={{ bottom: 0, right: 0, width: "26px", height: "26px", padding: 0, fontSize: "0.75rem" }}
                    onClick={() => fileInputRef.current.click()}
                    disabled={avatarLoading}
                    title="Cambia avatar"
                  >
                    {avatarLoading ? "..." : "✏️"}
                  </button>

                  {/* Input file nascosto */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </div>

                {avatarError && <div className="alert alert-danger py-1 small">{avatarError}</div>}

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
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nuova password</label>
                    <input type="password" name="password" className="form-control" placeholder="Lascia vuoto per non cambiarla" value={formData.password} onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={editLoading}>
                    {editLoading ? "Salvataggio..." : "Salva modifiche"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Conferma eliminazione */}
          {showDeleteConfirm && (
            <div className="card shadow-sm border-danger mb-4">
              <div className="card-body">
                <h6 className="fw-bold text-danger mb-2">⚠️ Sei sicuro?</h6>
                <p className="text-muted small">
                  Eliminando il tuo account perderai tutti i tuoi dati, log e attività. Questa azione è irreversibile.
                </p>
                <div className="d-flex gap-2">
                  <button className="btn btn-danger w-100" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? "Eliminazione..." : "Sì, elimina account"}
                  </button>
                  <button className="btn btn-outline-secondary w-100" onClick={() => setShowDeleteConfirm(false)}>
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