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
      console.log(data);
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
      style={{
        backgroundColor: "#f8faf9",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <div className="container" style={{ paddingTop: "40px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h3
            style={{
              fontWeight: "800",
              color: "#1b4332",
              margin: 0,
              fontSize: "1.8rem",
            }}
          >
            {t("tips.title")}
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: showForm ? "#6c757d" : "#1b4332",
              color: "white",
              border: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "background-color 0.2s",
            }}
          >
            {showForm ? t("tips.cancel") : t("tips.newTip")}
          </button>
        </div>

        {/* Form nuovo tip */}
        {showForm && (
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
              <h6 style={{ color: "white", fontWeight: "700", margin: 0 }}>
                {t("tips.newTipTitle")}
              </h6>
            </div>
            <div style={{ padding: "24px" }}>
              {formError && (
                <div
                  style={{
                    backgroundColor: "#fde8e8",
                    border: "1px solid #f5c6cb",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "#dc3545",
                    marginBottom: "16px",
                  }}
                >
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div
                  style={{
                    backgroundColor: "#f0fff4",
                    border: "1px solid #b7e4c7",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "#1b4332",
                    marginBottom: "16px",
                  }}
                >
                  {formSuccess}
                </div>
              )}
              <form onSubmit={handleCreateTip}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      className="form-label"
                    >
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
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      className="form-label"
                    >
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
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      className="form-label"
                    >
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
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      className="form-label"
                    >
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
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      className="form-label"
                    >
                      {t("tips.co2Saved")}
                    </label>
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
                      style={{
                        borderRadius: "12px",
                        border: "1.5px solid #e9ecef",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      className="form-label"
                    >
                      {t("tips.category")}
                    </label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
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
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    backgroundColor: "#1b4332",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {formLoading ? t("tips.saving") : t("tips.save")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Filtro categoria */}
        <div style={{ marginBottom: "24px" }}>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1.5px solid #e9ecef",
              backgroundColor: "white",
              fontWeight: "600",
              color: "#1b4332",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            <option value="">{t("tips.allCategories")}</option>
            {ACTIVITY_TYPES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lista tips */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="spinner-border text-success" role="status" />
          </div>
        ) : error ? (
          <div
            style={{
              backgroundColor: "#fde8e8",
              border: "1px solid #f5c6cb",
              borderRadius: "12px",
              padding: "16px",
              color: "#dc3545",
            }}
          >
            {error}
          </div>
        ) : tips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌱</div>
            <p style={{ color: "#6c757d" }}>{t("tips.noTips")}</p>
          </div>
        ) : (
          <div className="row g-3">
            {tips.map((tip) => (
              <div key={tip.id} className="col-md-6 col-lg-4">
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                    overflow: "hidden",
                    height: "100%",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.07)";
                  }}
                >
                  <div style={{ height: "6px", backgroundColor: "#40916c" }} />
                  <div style={{ padding: "20px" }}>
                    <span
                      style={{
                        backgroundColor: "#f0fff4",
                        color: "#1b4332",
                        border: "1px solid #b7e4c7",
                        borderRadius: "6px",
                        padding: "3px 10px",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                      }}
                    >
                      {ACTIVITY_TYPES.find((a) => a.value === tip.category)
                        ?.label || tip.category}
                    </span>
                    <h6
                      style={{
                        fontWeight: "700",
                        margin: "12px 0 8px",
                        color: "#1b4332",
                      }}
                    >
                      {i18n.language.startsWith("en") && tip.titleEn
                        ? tip.titleEn
                        : tip.title}
                    </h6>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6c757d",
                        marginBottom: "16px",
                        lineHeight: 1.6,
                      }}
                    >
                      {i18n.language.startsWith("en") && tip.descriptionEn
                        ? tip.descriptionEn
                        : tip.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#f0fff4",
                          color: "#1b4332",
                          border: "1px solid #b7e4c7",
                          borderRadius: "50px",
                          padding: "4px 12px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        🌿 {t("tips.savingEstimate")}: {tip.co2SavedEstimate} kg
                        CO₂
                      </span>
                      <button
                        onClick={() => handleDeleteTip(tip.id)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #f5c6cb",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          cursor: "pointer",
                          color: "#dc3545",
                          fontSize: "0.85rem",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fde8e8")
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
