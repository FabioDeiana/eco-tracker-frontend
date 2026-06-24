import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiFetch from "../api/apiFetch";

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/users/me");
        setUser(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        setError(t("profile.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    setEditLoading(true);
    try {
      const updated = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setUser(updated);
      setEditSuccess(t("profile.updateSuccess"));
      setShowEditForm(false);
    } catch (err) {
      setEditError(err.message || t("profile.updateError"));
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await apiFetch("/users/me", { method: "DELETE" });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setError(t("profile.deleteError"));
      setDeleteLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarError("");
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/me/avatar`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      if (!res.ok) throw new Error(t("profile.avatarError"));
      const updated = await res.json();
      setUser(updated);
    } catch (err) {
      setAvatarError(t("profile.avatarError"));
    } finally {
      setAvatarLoading(false);
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
          {t("profile.title")}
        </h3>

        <div className="row g-4">
          {/* Colonna sinistra — info profilo */}
          <div className="col-md-4">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                overflow: "hidden",
                marginBottom: "16px",
              }}
            >
              <div style={{ height: "80px", backgroundColor: "#1b4332" }} />
              <div
                style={{
                  padding: "0 24px 24px",
                  textAlign: "center",
                  marginTop: "-40px",
                }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#40916c",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        fontWeight: "800",
                        border: "4px solid white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={avatarLoading}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "#1b4332",
                      color: "white",
                      border: "2px solid white",
                      cursor: "pointer",
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {avatarLoading ? "..." : "✏️"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </div>

                {avatarError && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "0.8rem",
                      marginTop: "8px",
                    }}
                  >
                    {avatarError}
                  </p>
                )}

                <h5
                  style={{
                    fontWeight: "800",
                    marginTop: "12px",
                    marginBottom: "4px",
                    color: "#1b4332",
                  }}
                >
                  {user.name}
                </h5>
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                  }}
                >
                  {user.email}
                </p>
                <span
                  style={{
                    backgroundColor:
                      user.role === "ADMIN" ? "#fde8e8" : "#f0fff4",
                    color: user.role === "ADMIN" ? "#dc3545" : "#1b4332",
                    border: `1px solid ${user.role === "ADMIN" ? "#f5c6cb" : "#b7e4c7"}`,
                    borderRadius: "50px",
                    padding: "4px 12px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  {user.role}
                </span>

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid #f0f0f0",
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#6c757d",
                      marginBottom: "4px",
                    }}
                  >
                    {t("profile.memberSince")}
                  </p>
                  <p style={{ fontWeight: "700", color: "#1b4332", margin: 0 }}>
                    {new Date(user.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottoni */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: showEditForm ? "#6c757d" : "#1b4332",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                {showEditForm
                  ? t("profile.cancelEdit")
                  : t("profile.editProfile")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "transparent",
                  color: "#dc3545",
                  border: "1.5px solid #dc3545",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc3545";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#dc3545";
                }}
              >
                {t("profile.deleteAccount")}
              </button>
            </div>
          </div>

          {/* Colonna destra */}
          <div className="col-md-8">
            {editSuccess && (
              <div
                style={{
                  backgroundColor: "#f0fff4",
                  border: "1px solid #b7e4c7",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#1b4332",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                ✅ {editSuccess}
              </div>
            )}

            {/* Form modifica */}
            {showEditForm && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{ backgroundColor: "#1b4332", padding: "16px 20px" }}
                >
                  <h6 style={{ color: "white", fontWeight: "700", margin: 0 }}>
                    {t("profile.editTitle")}
                  </h6>
                </div>
                <div style={{ padding: "24px" }}>
                  {editError && (
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
                      {editError}
                    </div>
                  )}
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label
                        style={{ fontWeight: "600", fontSize: "0.9rem" }}
                        className="form-label"
                      >
                        {t("profile.name")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          borderRadius: "12px",
                          border: "1.5px solid #e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        style={{ fontWeight: "600", fontSize: "0.9rem" }}
                        className="form-label"
                      >
                        {t("profile.email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          borderRadius: "12px",
                          border: "1.5px solid #e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        style={{ fontWeight: "600", fontSize: "0.9rem" }}
                        className="form-label"
                      >
                        {t("profile.newPassword")}
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder={t("profile.passwordPlaceholder")}
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                          borderRadius: "12px",
                          border: "1.5px solid #e9ecef",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={editLoading}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1b4332",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {editLoading ? t("profile.saving") : t("profile.save")}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Conferma eliminazione */}
            {showDeleteConfirm && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{ backgroundColor: "#dc3545", padding: "16px 20px" }}
                >
                  <h6 style={{ color: "white", fontWeight: "700", margin: 0 }}>
                    {t("profile.deleteTitle")}
                  </h6>
                </div>
                <div style={{ padding: "24px" }}>
                  <p style={{ color: "#6c757d", marginBottom: "20px" }}>
                    {t("profile.deleteWarning")}
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {deleteLoading
                        ? t("profile.deleting")
                        : t("profile.confirmDelete")}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "transparent",
                        color: "#6c757d",
                        border: "1.5px solid #e9ecef",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {t("profile.cancel")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder */}
            {!showEditForm && !showDeleteConfirm && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                }}
              >
                <div style={{ height: "6px", backgroundColor: "#40916c" }} />
                <div style={{ padding: "60px 40px", textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>
                    🌿
                  </div>
                  <h5
                    style={{
                      fontWeight: "800",
                      color: "#1b4332",
                      marginBottom: "8px",
                    }}
                  >
                    {t("profile.welcome")}, {user.name.split(" ")[0]}!
                  </h5>
                  <p
                    style={{
                      color: "#6c757d",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    {t("profile.welcomeText")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
