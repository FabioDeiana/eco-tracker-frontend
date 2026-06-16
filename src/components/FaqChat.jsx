import { useState } from "react";
import { useTranslation } from "react-i18next";

function FaqChat() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: t("faq.welcome") },
  ]);

  const faqs = [
    { key: "q1", question: t("faq.q1"), answer: t("faq.a1") },
    { key: "q2", question: t("faq.q2"), answer: t("faq.a2") },
    { key: "q3", question: t("faq.q3"), answer: t("faq.a3") },
    { key: "q4", question: t("faq.q4"), answer: t("faq.a4") },
    { key: "q5", question: t("faq.q5"), answer: t("faq.a5") },
    { key: "q6", question: t("faq.q6"), answer: t("faq.a6") },
  ];

  const handleQuestionClick = (faq) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.question },
      { from: "bot", text: faq.answer },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#198754",
          color: "white",
          border: "none",
          fontSize: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 1000,
          cursor: "pointer",
        }}
        title={t("faq.title")}
      >
        {open ? "✖️" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "320px",
            maxHeight: "450px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div className="bg-success text-white p-3 fw-bold">
            🌿 {t("faq.title")}
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              maxHeight: "260px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 d-flex ${msg.from === "user" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  style={{
                    backgroundColor:
                      msg.from === "user" ? "#198754" : "#f0fff4",
                    color: msg.from === "user" ? "white" : "#333",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    maxWidth: "80%",
                    fontSize: "0.85rem",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              padding: "10px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            <p className="text-muted small mb-2">
              {t("faq.suggestedQuestions")}
            </p>
            <div className="d-flex flex-column gap-1">
              {faqs.map((faq) => (
                <button
                  key={faq.key}
                  className="btn btn-outline-success btn-sm text-start"
                  style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                  onClick={() => handleQuestionClick(faq)}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FaqChat;
