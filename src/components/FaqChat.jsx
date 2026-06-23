import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

function FaqChat() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [messages, setMessages] = useState([{ from: "bot", text: t("faq.welcome") }])
  const messagesEndRef = useRef(null)

  const faqs = [
    { key: "q1", question: t("faq.q1"), answer: t("faq.a1") },
    { key: "q2", question: t("faq.q2"), answer: t("faq.a2") },
    { key: "q3", question: t("faq.q3"), answer: t("faq.a3") },
    { key: "q4", question: t("faq.q4"), answer: t("faq.a4") },
    { key: "q5", question: t("faq.q5"), answer: t("faq.a5") },
    { key: "q6", question: t("faq.q6"), answer: t("faq.a6") },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

  const handleQuestionClick = (faq) => {
    setMessages((prev) => [...prev,
      { from: "user", text: faq.question },
      { from: "bot", text: faq.answer }
    ])
  }

  const handleOpen = () => {
    setOpen(!open)
    setShowTooltip(false)
  }

  return (
    <>
      {/* Tooltip */}
      {showTooltip && !open && (
        <div
          onClick={handleOpen}
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            backgroundColor: "#1b4332",
            color: "white",
            borderRadius: "12px",
            padding: "10px 16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            zIndex: 1000,
            cursor: "pointer",
            fontSize: "0.88rem",
            maxWidth: "210px",
            fontWeight: "500",
            lineHeight: 1.4,
          }}
        >
          {t("faq.tooltip")}
          <div style={{
            position: "absolute",
            bottom: "-7px",
            right: "22px",
            width: 0, height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "7px solid #1b4332",
          }} />
        </div>
      )}

      {/* Pulsante chat */}
      <button
        onClick={handleOpen}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#1b4332",
          color: "white",
          border: "none",
          fontSize: "1.4rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          zIndex: 1000,
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.1)"
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)"
        }}
        title={t("faq.title")}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Finestra chat */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "92px",
          right: "24px",
          width: "340px",
          maxHeight: "480px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            backgroundColor: "#1b4332",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <div style={{
              width: "36px", height: "36px",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem",
            }}>
              🌿
            </div>
            <div>
              <p className="mb-0 fw-bold text-white" style={{ fontSize: "0.95rem" }}>{t("faq.title")}</p>
              <p className="mb-0" style={{ fontSize: "0.75rem", color: "#a8d5ba" }}>Eco-Tracker</p>
            </div>
          </div>

          {/* Messaggi */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            maxHeight: "220px",
            backgroundColor: "#f8faf9",
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}>
                <div style={{
                  backgroundColor: msg.from === "user" ? "#1b4332" : "white",
                  color: msg.from === "user" ? "white" : "#333",
                  borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 14px",
                  maxWidth: "82%",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Domande suggerite */}
          <div style={{
            borderTop: "1px solid #e9ecef",
            padding: "12px 16px",
            maxHeight: "180px",
            overflowY: "auto",
            backgroundColor: "white",
          }}>
            <p style={{ fontSize: "0.75rem", color: "#6c757d", marginBottom: "8px", fontWeight: "600" }}>
              {t("faq.suggestedQuestions")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {faqs.map((faq) => (
                <button
                  key={faq.key}
                  onClick={() => handleQuestionClick(faq)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #d4edda",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "0.8rem",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#1b4332",
                    fontWeight: "500",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0fff4"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FaqChat