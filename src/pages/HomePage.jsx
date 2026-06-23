import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "flag-icons/css/flag-icons.min.css";
import FaqChat from "../components/FaqChat.jsx";
import { useState, useEffect } from "react";

function HomePage() {
  const { t, i18n } = useTranslation();
  const [previewTips, setPreviewTips] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tips`)
      .then((res) => res.json())
      .then((data) => setPreviewTips(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("it") ? "en" : "it";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-success">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold mb-0">🌿 Eco-Tracker</span>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleLanguage}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <span
                className={`fi fi-${i18n.language.startsWith("it") ? "it" : "gb"}`}
                style={{ fontSize: "1.4rem" }}
              />
            </button>
            <Link to="/login" className="btn btn-outline-light btn-sm">
              {t("home.login")}
            </Link>
            <Link
              to="/register"
              className="btn btn-light btn-sm text-success fw-bold"
            >
              {t("home.register")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero a piena larghezza */}
      <div
        className="text-center position-relative"
        style={{
          backgroundImage: "url('/forest.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 35, 0, 0.5)" }}
        />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div style={{ fontSize: "3.5rem" }}>🌿</div>
          <h1
            className="fw-bold text-white mt-2"
            style={{ fontSize: "2.8rem" }}
          >
            {t("home.heroTitle")}
          </h1>
          <p
            className="fs-5 mt-3 mx-auto"
            style={{ maxWidth: "600px", color: "#e8f5e9" }}
          >
            {t("home.heroSubtitle")}
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link
              to="/register"
              className="btn btn-success btn-lg"
              style={{ borderRadius: "10px" }}
            >
              {t("home.ctaRegister")}
            </Link>
            <Link
              to="/login"
              className="btn btn-light btn-lg fw-bold text-success"
              style={{ borderRadius: "10px" }}
            >
              {t("home.ctaLogin")}
            </Link>
          </div>
        </div>
      </div>

      {/* Resto della pagina su sfondo chiaro */}
      <div style={{ backgroundColor: "#f5f6f5" }}>
        {/* Features */}
        {/* Categorie monitorabili */}
        <div className="container py-5">
          <h2 className="text-center fw-bold mb-2">
            {t("home.categoriesTitle")}
          </h2>
          <p className="text-center text-muted mb-5">
            {t("home.categoriesSubtitle")}
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            {[
              { img: "/car.jpg", emoji: "🚗", label: t("activities.car") },
              { img: "/food.jpg", emoji: "🥩", label: t("activities.meat") },
              {
                img: "/energy.jpg",
                emoji: "⚡",
                label: t("activities.electricity"),
              },
              {
                img: "/flight.jpg",
                emoji: "✈️",
                label: t("activities.flight"),
              },
              {
                img: "/heating.jpg",
                emoji: "🔥",
                label: t("activities.heating"),
              },
            ].map((cat) => (
              <div
                key={cat.label}
                className="position-relative"
                style={{
                  width: "200px",
                  height: "280px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundImage: `url('${cat.img}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  className="position-absolute bottom-0 start-0 w-100 p-3"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                    color: "white",
                  }}
                >
                  <p className="fw-bold mb-0">{cat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Dashboard */}
        <div className="py-5" style={{ backgroundColor: "#fff" }}>
          <div className="container">
            <h2 className="text-center fw-bold mb-2">
              {t("home.previewTitle")}
            </h2>
            <p className="text-center text-muted mb-5">
              {t("home.previewSubtitle")}
            </p>

            <div className="row g-4 align-items-center">
              {/* Colonna sinistra — callout */}
              <div className="col-md-5">
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex gap-3 align-items-start">
                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        fontSize: "1.2rem",
                      }}
                    >
                      📊
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">
                        {t("home.callout1Title")}
                      </h6>
                      <p className="text-muted small mb-0">
                        {t("home.callout1Text")}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-start">
                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        fontSize: "1.2rem",
                      }}
                    >
                      🌍
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">
                        {t("home.callout2Title")}
                      </h6>
                      <p className="text-muted small mb-0">
                        {t("home.callout2Text")}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-start">
                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        fontSize: "1.2rem",
                      }}
                    >
                      🌿
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">
                        {t("home.callout3Title")}
                      </h6>
                      <p className="text-muted small mb-0">
                        {t("home.callout3Text")}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-start">
                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        fontSize: "1.2rem",
                      }}
                    >
                      📈
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">
                        {t("home.callout4Title")}
                      </h6>
                      <p className="text-muted small mb-0">
                        {t("home.callout4Text")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonna destra — screenshot dashboard */}
              <div className="col-md-7">
                <div
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  }}
                >
                  <img
                    src="/dashboard-preview.png"
                    alt="Dashboard preview"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Punti di forza */}
        <div className="py-5" style={{ backgroundColor: "#f5f6f5" }}>
          <div className="container">
            <h2 className="text-center fw-bold mb-2">
              {t("home.strengthsTitle")}
            </h2>
            <p className="text-center text-muted mb-5">
              {t("home.strengthsSubtitle")}
            </p>
            <div className="row g-4">
              <div className="col-md-3">
                <div
                  className="card h-100 border-0 text-center p-4"
                  style={{
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #d4edda, #f0fff4)",
                  }}
                >
                  <div style={{ fontSize: "2.5rem" }}>🆓</div>
                  <h5 className="fw-bold mt-3">{t("home.strength1Title")}</h5>
                  <p className="text-muted small">{t("home.strength1Text")}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="card h-100 border-0 text-center p-4"
                  style={{
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #dbeafe, #f0f7ff)",
                  }}
                >
                  <div style={{ fontSize: "2.5rem" }}>📊</div>
                  <h5 className="fw-bold mt-3">{t("home.strength2Title")}</h5>
                  <p className="text-muted small">{t("home.strength2Text")}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="card h-100 border-0 text-center p-4"
                  style={{
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #fef9c3, #fffde7)",
                  }}
                >
                  <div style={{ fontSize: "2.5rem" }}>🔬</div>
                  <h5 className="fw-bold mt-3">{t("home.strength3Title")}</h5>
                  <p className="text-muted small">{t("home.strength3Text")}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="card h-100 border-0 text-center p-4"
                  style={{
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #fde8e8, #fff5f5)",
                  }}
                >
                  <div style={{ fontSize: "2.5rem" }}>🌍</div>
                  <h5 className="fw-bold mt-3">{t("home.strength4Title")}</h5>
                  <p className="text-muted small">{t("home.strength4Text")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Come funziona */}
        <div className="py-5" style={{ backgroundColor: "#fff" }}>
          <div className="container">
            <h2 className="text-center fw-bold mb-5">{t("home.howTitle")}</h2>
            <div className="row g-4 text-center">
              <div className="col-md-4">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "50px", height: "50px", fontSize: "1.3rem" }}
                >
                  1
                </div>
                <h6 className="fw-bold">{t("home.step1Title")}</h6>
                <p className="text-muted small">{t("home.step1Text")}</p>
              </div>
              <div className="col-md-4">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "50px", height: "50px", fontSize: "1.3rem" }}
                >
                  2
                </div>
                <h6 className="fw-bold">{t("home.step2Title")}</h6>
                <p className="text-muted small">{t("home.step2Text")}</p>
              </div>
              <div className="col-md-4">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "50px", height: "50px", fontSize: "1.3rem" }}
                >
                  3
                </div>
                <h6 className="fw-bold">{t("home.step3Title")}</h6>
                <p className="text-muted small">{t("home.step3Text")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Green Tips preview */}
        {previewTips.length > 0 && (
          <div className="py-5" style={{ backgroundColor: "#fff" }}>
            <div className="container">
              <h2 className="text-center fw-bold mb-2">
                {t("home.tipsPreviewTitle")}
              </h2>
              <p className="text-center text-muted mb-5">
                {t("home.tipsPreviewSubtitle")}
              </p>
              <div className="row g-4">
                {previewTips.map((tip) => (
                  <div key={tip.id} className="col-md-4">
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{
                        borderRadius: "16px",
                        borderTop: "4px solid #198754",
                      }}
                    >
                      <div className="card-body">
                        <p className="fw-bold mb-1">
                          {i18n.language.startsWith("en") && tip.titleEn
                            ? tip.titleEn
                            : tip.title}
                        </p>
                        <p className="text-muted small mb-3">
                          {i18n.language.startsWith("en") && tip.descriptionEn
                            ? tip.descriptionEn
                            : tip.description}
                        </p>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor: "#f0fff4",
                            color: "#198754",
                            border: "1px solid #198754",
                          }}
                        >
                          🌿 {tip.co2SavedEstimate} kg CO₂
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link
                  to="/register"
                  className="btn btn-outline-success"
                  style={{ borderRadius: "10px" }}
                >
                  {t("home.tipsPreviewCta")}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* CTA finale */}
        <div
          className="text-center py-5"
          style={{ background: "linear-gradient(135deg, #198754, #20c997)" }}
        >
          <h2 className="fw-bold text-white">{t("home.finalCtaTitle")}</h2>
          <Link
            to="/register"
            className="btn btn-light btn-lg mt-3 fw-bold text-success"
            style={{ borderRadius: "10px" }}
          >
            {t("home.ctaRegister")}
          </Link>
        </div>

        {/* Footer */}
        <footer
          style={{ backgroundColor: "#1b4332", color: "#d4edda" }}
          className="pt-5 pb-4"
        >
          <div className="container">
            <div className="row g-4">
              <div className="col-md-4">
                <h6 className="fw-bold text-white mb-3">🌿 Eco-Tracker</h6>
                <p className="small" style={{ color: "#a8d5ba" }}>
                  {t("footer.tagline")}
                </p>
              </div>

              <div className="col-md-4">
                <h6 className="fw-bold text-white mb-3">
                  {t("footer.linksTitle")}
                </h6>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <a
                      href="https://github.com/FabioDeiana/eco-tracker-frontend"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                      style={{ color: "#a8d5ba" }}
                    >
                      {t("footer.frontendRepo")}
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="https://github.com/FabioDeiana/Ecotracker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                      style={{ color: "#a8d5ba" }}
                    >
                      {t("footer.backendRepo")}
                    </a>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/login"
                      className="text-decoration-none"
                      style={{ color: "#a8d5ba" }}
                    >
                      {t("home.login")}
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/register"
                      className="text-decoration-none"
                      style={{ color: "#a8d5ba" }}
                    >
                      {t("home.register")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-md-4">
                <h6 className="fw-bold text-white mb-3">
                  {t("footer.techTitle")}
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "React",
                    "Vite",
                    "Spring Boot",
                    "PostgreSQL",
                    "JWT",
                    "Chart.js",
                    "Bootstrap",
                    "Cloudinary",
                    "Climatiq API",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="badge"
                      style={{ backgroundColor: "#2d6a4f", color: "#d4edda" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <hr style={{ borderColor: "#2d6a4f" }} className="my-4" />

            <p className="text-center small mb-0" style={{ color: "#a8d5ba" }}>
              © {new Date().getFullYear()} Eco-Tracker & Green Planner —{" "}
              {t("footer.madeBy")}
            </p>
          </div>
        </footer>
      </div>

      <FaqChat />
    </div>
  );
}

export default HomePage;
