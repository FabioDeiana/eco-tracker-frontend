import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiFetch from "../api/apiFetch";

function GreenTipPage() {
  const { t, i18n } = useTranslation();

  const ACTIVITY_TYPES = [
    { value: "CAR", label: "🚗 " + t("activities.car") },
    { value: "MEAT", label: "🥩 " + t("activities.meat") },
    { value: "ELECTRICITY", label: "⚡ " + t("activities.electricity") },
    { value: "FLIGHT", label: "✈️ " + t("activities.flight") },
    { value: "HEATING", label: "🔥 " + t("activities.heating") },
  ];

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    titleEn: "",
    descriptionEn: "",
    category: "CAR",
    co2SavedEstimate: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchTips = async (category = "") => {
    setLoading(true);
    setError("");
    try {
      const endpoint = category
        ? `/tips/category?category=${category}`
        : "/tips";
      const data = await apiFetch(endpoint);
      console.log(data)
      setTips(data);
    } catch (err) {
      setError(t("tips.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchTips(category);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateTip = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);
    try {
      const newTip = await apiFetch("/tips", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          co2SavedEstimate: parseFloat(formData.co2SavedEstimate),
        }),
      });
      setTips([...tips, newTip]);
      setFormSuccess(t("tips.addSuccess"));
      setFormData({
        title: "",
        description: "",
        titleEn: "",
        descriptionEn: "",
        category: "CAR",
        co2SavedEstimate: "",
      });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || t("tips.addError"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTip = async (tipId) => {
    try {
      await apiFetch(`/tips/${tipId}`, { method: "DELETE" });
      setTips(tips.filter((t) => t.id !== tipId));
    } catch (err) {
      setError(t("tips.deleteError"));
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "3rem" }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-success mb-0">{t("tips.title")}</h4>
          <button
            className="btn btn-success"
            style={{ borderRadius: "10px" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? t("tips.cancel") : t("tips.newTip")}
          </button>
        </div>

        {showForm && (
          <div
            className="card shadow-sm border-0 mb-4"
            style={{ borderRadius: "16px", borderLeft: "4px solid #198754" }}
          >
            <div className="card-body">
              <h6 className="fw-bold mb-3">{t("tips.newTipTitle")}</h6>
              {formError && (
                <div className="alert alert-danger py-2">{formError}</div>
              )}
              {formSuccess && (
                <div className="alert alert-success py-2">{formSuccess}</div>
              )}
              <form onSubmit={handleCreateTip}>
                <div className="mb-3">
                  <label className="form-label">
                    {t("tips.titleField")} (IT)
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="es. Usa i mezzi pubblici"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    {t("tips.description")} (IT)
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    placeholder="Descrivi il consiglio..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    {t("tips.titleField")} (EN)
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    className="form-control"
                    placeholder="e.g. Use public transport"
                    value={formData.titleEn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    {t("tips.description")} (EN)
                  </label>
                  <textarea
                    name="descriptionEn"
                    className="form-control"
                    placeholder="Describe the tip in English..."
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">{t("tips.co2Saved")}</label>
                  <input
                    type="number"
                    name="co2SavedEstimate"
                    className="form-control"
                    placeholder="es. 2.5"
                    value={formData.co2SavedEstimate}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">{t("tips.category")}</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {ACTIVITY_TYPES.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={formLoading}
                  style={{ borderRadius: "10px" }}
                >
                  {formLoading ? t("tips.saving") : t("tips.save")}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mb-4">
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ borderRadius: "10px" }}
          >
            <option value="">{t("tips.allCategories")}</option>
            {ACTIVITY_TYPES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-success" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : tips.length === 0 ? (
          <div className="text-center mt-5">
            <div style={{ fontSize: "3rem" }}>🌱</div>
            <p className="text-muted mt-2">{t("tips.noTips")}</p>
          </div>
        ) : (
          <div className="row g-3">
            {tips.map((tip) => (
              <div key={tip.id} className="col-md-6 col-lg-4">
                <div
                  className="card shadow-sm h-100 border-0"
                  style={{
                    borderRadius: "16px",
                    borderTop: "4px solid #198754",
                  }}
                >
                  <div className="card-body">
                    <span className="badge bg-success mb-2">
                      {ACTIVITY_TYPES.find((a) => a.value === tip.category)
                        ?.label || tip.category}
                    </span>
                    <h6 className="fw-bold">
                      {i18n.language.startsWith("en") && tip.titleEn
                        ? tip.titleEn
                        : tip.title}
                    </h6>
                    <p className="text-muted small mb-3">
                      {i18n.language.startsWith("en") && tip.descriptionEn
                        ? tip.descriptionEn
                        : tip.description}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: "#f0fff4",
                          color: "#198754",
                          border: "1px solid #198754",
                        }}
                      >
                        🌿 {t("tips.savingEstimate")}: {tip.co2SavedEstimate} kg
                        CO₂
                      </span>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: "8px" }}
                        onClick={() => handleDeleteTip(tip.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GreenTipPage;
