import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "flag-icons/css/flag-icons.min.css";
import FaqChat from "../components/FaqChat.jsx";
import { useState, useEffect, useRef } from "react";

// Hook per animazione fade-in al scroll
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, style = {} }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// SVG onda di transizione
function WaveDivider({ fromColor, toColor, flip = false }) {
  return (
    <div style={{ backgroundColor: toColor, marginTop: "-2px" }}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          transform: flip ? "scaleY(-1)" : "none",
          backgroundColor: fromColor,
        }}
      >
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}

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

  const btnStyle = {
    borderRadius: "50px",
    padding: "12px 28px",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#1b4332",
          padding: "0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container d-flex justify-content-between align-items-center"
          style={{ height: "64px" }}
        >
          <a
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "800",
              fontSize: "1.2rem",
              letterSpacing: "-0.3px",
            }}
          >
            🌿 Eco-Tracker
          </a>
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
            <Link
              to="/login"
              style={{
                ...btnStyle,
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "white",
                padding: "8px 20px",
                textDecoration: "none",
              }}
            >
              {t("home.login")}
            </Link>
            <Link
              to="/register"
              style={{
                ...btnStyle,
                backgroundColor: "white",
                border: "none",
                color: "#1b4332",
                padding: "8px 20px",
                textDecoration: "none",
              }}
            >
              {t("home.register")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="text-center position-relative"
        style={{
          backgroundImage: "url('/forest.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 30, 0, 0.55)" }}
        />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div style={{ fontSize: "4rem" }}>🌿</div>
          <h1
            className="fw-bold text-white mt-2"
            style={{
              fontSize: "3.5rem",
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}
          >
            {t("home.heroTitle")}
          </h1>
          <p
            className="mt-4 mx-auto"
            style={{
              maxWidth: "580px",
              color: "#c8e6c9",
              fontSize: "1.2rem",
              lineHeight: 1.7,
            }}
          >
            {t("home.heroSubtitle")}
          </p>
          <div className="d-flex justify-content-center gap-3 mt-5">
            <Link
              to="/register"
              style={{
                ...btnStyle,
                backgroundColor: "#40916c",
                border: "none",
                color: "white",
                textDecoration: "none",
                fontSize: "1.1rem",
                padding: "14px 32px",
              }}
            >
              {t("home.ctaRegister")}
            </Link>
            <Link
              to="/login"
              style={{
                ...btnStyle,
                backgroundColor: "transparent",
                border: "2px solid white",
                color: "white",
                textDecoration: "none",
                fontSize: "1.1rem",
                padding: "14px 32px",
              }}
            >
              {t("home.ctaLogin")}
            </Link>
          </div>
        </div>
      </div>

      {/* Onda hero → categorie */}
      <WaveDivider fromColor="transparent" toColor="#f8faf9" />

      {/* Categorie */}
      <div style={{ backgroundColor: "#f8faf9", paddingBottom: "80px" }}>
        <FadeSection>
          <div className="container" style={{ paddingTop: "60px" }}>
            <h2
              className="text-center fw-bold mb-2"
              style={{ fontSize: "2.2rem" }}
            >
              {t("home.categoriesTitle")}
            </h2>
            <p
              className="text-center mb-5"
              style={{ color: "#6c757d", fontSize: "1.1rem" }}
            >
              {t("home.categoriesSubtitle")}
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {[
                { img: "/car.jpg", label: t("activities.car") },
                { img: "/food.jpg", label: t("activities.meat") },
                { img: "/energy.jpg", label: t("activities.electricity") },
                { img: "/flight.jpg", label: t("activities.flight") },
                { img: "/heating.jpg", label: t("activities.heating") },
              ].map((cat) => (
                <div
                  key={cat.label}
                  style={{
                    width: "200px",
                    height: "300px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundImage: `url('${cat.img}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 32px rgba(0,0,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.15)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "20px 16px",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      color: "white",
                    }}
                  >
                    <p className="fw-bold mb-0" style={{ fontSize: "1rem" }}>
                      {cat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </div>

      {/* Onda categorie → preview dashboard (scuro) */}
      <WaveDivider fromColor="#f8faf9" toColor="#1b4332" />

      {/* Preview Dashboard — sfondo scuro */}
      <div
        style={{
          backgroundColor: "#1b4332",
          paddingTop: "20px",
          paddingBottom: "80px",
        }}
      >
        <FadeSection>
          <div className="container">
            <h2
              className="text-center fw-bold mb-2 text-white"
              style={{ fontSize: "2.2rem" }}
            >
              {t("home.previewTitle")}
            </h2>
            <p
              className="text-center mb-5"
              style={{ color: "#a8d5ba", fontSize: "1.1rem" }}
            >
              {t("home.previewSubtitle")}
            </p>
            <div className="row g-5 align-items-center">
              <div className="col-md-5">
                <div className="d-flex flex-column gap-4">
                  {[
                    {
                      icon: "📊",
                      title: t("home.callout1Title"),
                      text: t("home.callout1Text"),
                    },
                    {
                      icon: "🌍",
                      title: t("home.callout2Title"),
                      text: t("home.callout2Text"),
                    },
                    {
                      icon: "🌿",
                      title: t("home.callout3Title"),
                      text: t("home.callout3Text"),
                    },
                    {
                      icon: "📈",
                      title: t("home.callout4Title"),
                      text: t("home.callout4Text"),
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="d-flex gap-3 align-items-start"
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 text-white">
                          {item.title}
                        </h6>
                        <p className="mb-0 small" style={{ color: "#a8d5ba" }}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-7">
                <div
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
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
        </FadeSection>
      </div>

      {/* Onda preview → punti di forza */}
      <WaveDivider fromColor="#1b4332" toColor="#f8faf9" />

      {/* Punti di forza */}
      <div style={{ backgroundColor: "#f8faf9", paddingBottom: "80px" }}>
        <FadeSection>
          <div className="container" style={{ paddingTop: "60px" }}>
            <h2
              className="text-center fw-bold mb-2"
              style={{ fontSize: "2.2rem" }}
            >
              {t("home.strengthsTitle")}
            </h2>
            <p
              className="text-center mb-5"
              style={{ color: "#6c757d", fontSize: "1.1rem" }}
            >
              {t("home.strengthsSubtitle")}
            </p>
            <div className="row g-4">
              {[
                {
                  img: "/free.jpg",
                  title: t("home.strength1Title"),
                  text: t("home.strength1Text"),
                },
                {
                  img: "/categories.jpg",
                  title: t("home.strength2Title"),
                  text: t("home.strength2Text"),
                },
                {
                  img: "/science.jpg",
                  title: t("home.strength3Title"),
                  text: t("home.strength3Text"),
                },
                {
                  img: "/languages.jpg",
                  title: t("home.strength4Title"),
                  text: t("home.strength4Text"),
                },
              ].map((item) => (
                <div key={item.title} className="col-md-3">
                  <div
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      backgroundColor: "white",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 32px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div
                      style={{
                        height: "160px",
                        backgroundImage: `url('${item.img}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <h6 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
                        {item.title}
                      </h6>
                      <p className="mb-0 small" style={{ color: "#6c757d" }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </div>

      {/* Onda punti di forza → come funziona (scuro) */}
      <WaveDivider fromColor="#f8faf9" toColor="#1b4332" />

      {/* Come funziona — sfondo scuro */}
      <div
        style={{
          backgroundColor: "#1b4332",
          paddingTop: "20px",
          paddingBottom: "80px",
        }}
      >
        <FadeSection>
          <div className="container">
            <h2
              className="text-center fw-bold mb-2 text-white"
              style={{ fontSize: "2.2rem" }}
            >
              {t("home.howTitle")}
            </h2>
            <p
              className="text-center mb-5"
              style={{ color: "#a8d5ba", fontSize: "1.1rem" }}
            >
              {t("home.howSubtitle")}
            </p>
            <div className="row g-4 text-center">
              {[
                {
                  num: "01",
                  title: t("home.step1Title"),
                  text: t("home.step1Text"),
                  icon: "👤",
                },
                {
                  num: "02",
                  title: t("home.step2Title"),
                  text: t("home.step2Text"),
                  icon: "📝",
                },
                {
                  num: "03",
                  title: t("home.step3Title"),
                  text: t("home.step3Text"),
                  icon: "📈",
                },
              ].map((step, i) => (
                <div key={step.num} className="col-md-4">
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: "20px",
                      padding: "40px 30px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      height: "100%",
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
                      {step.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        color: "rgba(255,255,255,0.15)",
                        lineHeight: 1,
                        marginBottom: "12px",
                      }}
                    >
                      {step.num}
                    </div>
                    <h5 className="fw-bold text-white mb-2">{step.title}</h5>
                    <p className="mb-0 small" style={{ color: "#a8d5ba" }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </div>

      {/* Onda come funziona → green tips */}
      <WaveDivider fromColor="#1b4332" toColor="#f8faf9" />

      {/* Green Tips preview */}
      {previewTips.length > 0 && (
        <div style={{ backgroundColor: "#f8faf9", paddingBottom: "80px" }}>
          <FadeSection>
            <div className="container" style={{ paddingTop: "60px" }}>
              <h2
                className="text-center fw-bold mb-2"
                style={{ fontSize: "2.2rem" }}
              >
                {t("home.tipsPreviewTitle")}
              </h2>
              <p
                className="text-center mb-5"
                style={{ color: "#6c757d", fontSize: "1.1rem" }}
              >
                {t("home.tipsPreviewSubtitle")}
              </p>
              <div className="row g-4">
                {previewTips.map((tip) => (
                  <div key={tip.id} className="col-md-4">
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        height: "100%",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0,0,0,0.08)";
                      }}
                    >
                      <div
                        style={{ height: "8px", backgroundColor: "#40916c" }}
                      />
                      <div style={{ padding: "24px" }}>
                        <p
                          className="fw-bold mb-2"
                          style={{ fontSize: "1rem" }}
                        >
                          {i18n.language.startsWith("en") && tip.titleEn
                            ? tip.titleEn
                            : tip.title}
                        </p>
                        <p className="mb-3 small" style={{ color: "#6c757d" }}>
                          {i18n.language.startsWith("en") && tip.descriptionEn
                            ? tip.descriptionEn
                            : tip.description}
                        </p>
                        <span
                          style={{
                            backgroundColor: "#f0fff4",
                            color: "#2d6a4f",
                            border: "1px solid #b7e4c7",
                            borderRadius: "50px",
                            padding: "4px 12px",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                          }}
                        >
                          🌿 {tip.co2SavedEstimate} kg CO₂
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-5">
                <Link
                  to="/register"
                  style={{
                    ...btnStyle,
                    backgroundColor: "transparent",
                    border: "2px solid #1b4332",
                    color: "#1b4332",
                    textDecoration: "none",
                  }}
                >
                  {t("home.tipsPreviewCta")}
                </Link>
              </div>
            </div>
          </FadeSection>
        </div>
      )}

      {/* Onda green tips → CTA finale (scuro) */}
      <WaveDivider fromColor="#f8faf9" toColor="#1b4332" />

      {/* CTA finale */}
      <div
        style={{
          backgroundColor: "#1b4332",
          paddingTop: "20px",
          paddingBottom: "100px",
          textAlign: "center",
        }}
      >
        <FadeSection>
          <div className="container">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🌍</div>
            <h2
              className="fw-bold text-white mb-3"
              style={{ fontSize: "2.5rem" }}
            >
              {t("home.finalCtaTitle")}
            </h2>
            <p
              style={{
                color: "#a8d5ba",
                fontSize: "1.1rem",
                marginBottom: "40px",
              }}
            >
              {t("home.finalCtaSubtitle")}
            </p>
            <Link
              to="/register"
              style={{
                ...btnStyle,
                backgroundColor: "#40916c",
                border: "none",
                color: "white",
                textDecoration: "none",
                fontSize: "1.1rem",
                padding: "16px 40px",
              }}
            >
              {t("home.ctaRegister")}
            </Link>
          </div>
        </FadeSection>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#0d2b1e",
          color: "#d4edda",
          paddingTop: "60px",
          paddingBottom: "40px",
        }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h6
                className="fw-bold text-white mb-3"
                style={{ fontSize: "1.1rem" }}
              >
                🌿 Eco-Tracker
              </h6>
              <p
                className="small"
                style={{ color: "#a8d5ba", lineHeight: 1.7 }}
              >
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
                    style={{
                      backgroundColor: "#2d6a4f",
                      color: "#d4edda",
                      borderRadius: "6px",
                      padding: "3px 10px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <hr
            style={{
              borderColor: "#2d6a4f",
              marginTop: "40px",
              marginBottom: "24px",
            }}
          />
          <p className="text-center small mb-0" style={{ color: "#a8d5ba" }}>
            © {new Date().getFullYear()} Eco-Tracker & Green Planner —{" "}
            {t("footer.madeBy")}
          </p>
        </div>
      </footer>

      <FaqChat />
    </div>
  );
}

export default HomePage;
