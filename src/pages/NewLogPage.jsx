import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiFetch from "../api/apiFetch"

// Mappa dei tipi di attività — collegano l'enum del backend a etichette e unità leggibili
const ACTIVITY_TYPES = [
  { value: "CAR",         label: "🚗 Auto",        unit: "km" },
  { value: "MEAT",        label: "🥩 Carne",        unit: "kg" },
  { value: "ELECTRICITY", label: "⚡ Elettricità",  unit: "kWh" },
  { value: "FLIGHT",      label: "✈️ Volo",         unit: "km" },
  { value: "HEATING",     label: "🔥 Riscaldamento", unit: "kWh" },
]

function NewLogPage() {
  const navigate = useNavigate()

  // Stato del form
  const [formData, setFormData] = useState({
    type: "CAR",
    value: "",
  })

  // Lista attività aggiunte in questa sessione
  const [activities, setActivities] = useState([])

  // ID del log creato — null finché non viene creato
  const [logId, setLogId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Step 1 — crea il log del giorno (se non esiste già)
  const getOrCreateLog = async () => {
    if (logId) return logId // se il log esiste già lo riusiamo

    const newLog = await apiFetch("/logs", { method: "POST" })
    setLogId(newLog.id)
    return newLog.id
  }

  // Step 2 — aggiunge un'attività al log
  const handleAddActivity = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Creiamo o recuperiamo il log del giorno
      const currentLogId = await getOrCreateLog()

      // Aggiungiamo l'attività al log
      const newActivity = await apiFetch(`/logs/${currentLogId}/activities`, {
        method: "POST",
        body: JSON.stringify({
          type: formData.type,
          value: parseFloat(formData.value), // convertiamo da stringa a numero
        }),
      })

      // Aggiungiamo l'attività alla lista locale
      setActivities([...activities, newActivity])

      // Mostriamo messaggio di successo e resettiamo il valore
      setSuccess("Attività aggiunta!")
      setFormData({ ...formData, value: "" })

    } catch (err) {
      setError(err.message || "Errore durante l'aggiunta dell'attività")
    } finally {
      setLoading(false)
    }
  }

  // Trova l'unità di misura del tipo selezionato
  const selectedType = ACTIVITY_TYPES.find((a) => a.value === formData.type)

  return (
    <div className="container mt-4">
      <h4 className="fw-bold text-success mb-4">Registra le tue attività</h4>

      <div className="row g-4">

        {/* Form aggiunta attività */}
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Nuova attività</h6>

              {error && <div className="alert alert-danger py-2">{error}</div>}
              {success && <div className="alert alert-success py-2">{success}</div>}

              <form onSubmit={handleAddActivity}>

                {/* Selezione tipo attività */}
                <div className="mb-3">
                  <label className="form-label">Tipo di attività</label>
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

                {/* Valore con unità di misura dinamica */}
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
                  disabled={loading}
                >
                  {loading ? "Aggiunta in corso..." : "Aggiungi attività"}
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Lista attività aggiunte */}
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Attività aggiunte oggi</h6>

              {activities.length === 0 ? (
                <p className="text-muted text-center py-3">
                  Nessuna attività aggiunta ancora.
                </p>
              ) : (
                <>
                  <ul className="list-group list-group-flush mb-3">
                    {activities.map((activity) => (
                      <li
                        key={activity.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {/* Troviamo l'etichetta leggibile del tipo */}
                        <span>
                          {ACTIVITY_TYPES.find((a) => a.value === activity.activityType)?.label || activity.activityType}
                        </span>
                        <span className="badge bg-success rounded-pill">
                          {activity.co2Emission?.toFixed(2)} kg CO₂
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottone per tornare alla dashboard */}
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={() => navigate("/dashboard")}
                  >
                    Vai alla Dashboard
                  </button>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default NewLogPage