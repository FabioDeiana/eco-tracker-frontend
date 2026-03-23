import { useState, useEffect } from "react";
import apiFetch from "../api/apiFetch";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ID dell'utente di cui stiamo chiedendo conferma eliminazione
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Carichiamo tutti gli utenti
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // GET /users ritorna una Page — i dati sono nel campo "content"
        const data = await apiFetch("/users");
        setUsers(data.content);
      } catch (err) {
        setError("Errore nel caricamento degli utenti");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Elimina un utente
  const handleDelete = async (userId) => {
    setDeleteLoading(true);
    try {
      await apiFetch(`/users/${userId}`, { method: "DELETE" });
      // Rimuoviamo l'utente dalla lista locale
      setUsers(users.filter((u) => u.id !== userId));
      setDeleteConfirmId(null);
    } catch (err) {
      setError("Errore durante l'eliminazione dell'utente");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cambia il ruolo di un utente
  const handleChangeRole = async (userId, ruoloAttuale) => {
    const nuovoRuolo = ruoloAttuale === "ADMIN" ? "USER" : "ADMIN";
    try {
      const updated = await apiFetch(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nuovoRuolo }),
      });
      // Aggiorniamo il ruolo nella lista locale
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      );
    } catch (err) {
      setError("Errore durante il cambio ruolo");
    }
  };

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
    <div
      style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "3rem" }}
    >
      <div className="container">
        <h4 className="fw-bold text-success mb-4">👥 Gestione Utenti</h4>

        <div
          className="card shadow-sm border-0"
          style={{ borderRadius: "16px" }}
        >
          <div className="card-body p-0">
            {users.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "3rem" }}>👥</div>
                <p className="text-muted mt-2">Nessun utente registrato.</p>
              </div>
            ) : (
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#d4edda" }}>
                  <tr>
                    <th className="ps-4 py-3">Nome</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Ruolo</th>
                    <th className="py-3">Registrato il</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <>
                      <tr key={user.id}>
                        <td className="ps-4">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt="avatar"
                              className="rounded-circle me-2"
                              style={{
                                width: "36px",
                                height: "36px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span
                              className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center me-2"
                              style={{
                                width: "36px",
                                height: "36px",
                                fontSize: "0.9rem",
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="fw-bold">{user.name}</span>
                        </td>
                        <td className="text-muted">{user.email}</td>
                        <td>
                          <span
                            className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-success"}`}
                            style={{ borderRadius: "8px" }}
                          >
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
                              onClick={() =>
                                handleChangeRole(user.id, user.role)
                              }
                            >
                              {user.role === "ADMIN"
                                ? "⬇️ Retrocedi"
                                : "⬆️ Promuovi"}
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              style={{ borderRadius: "8px" }}
                              onClick={() => setDeleteConfirmId(user.id)}
                            >
                              🗑️ Elimina
                            </button>
                          </div>
                        </td>
                      </tr>

                      {deleteConfirmId === user.id && (
                        <tr key={`confirm-${user.id}`}>
                          <td
                            colSpan={5}
                            style={{ backgroundColor: "#fde8e8" }}
                          >
                            <div className="d-flex align-items-center justify-content-between px-2">
                              <span className="text-danger fw-bold">
                                ⚠️ Sei sicuro di voler eliminare{" "}
                                <strong>{user.name}</strong>?
                              </span>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-danger btn-sm"
                                  style={{ borderRadius: "8px" }}
                                  onClick={() => handleDelete(user.id)}
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading
                                    ? "Eliminazione..."
                                    : "Sì, elimina"}
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  style={{ borderRadius: "8px" }}
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
    </div>
  );
}

export default UsersPage;
