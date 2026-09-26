import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import { ASK_AI_CHAT } from "../../../Context/constants";
import {
  BsSendFill,
  FaUserAlt,
  BsRobot,
  FaRegCopy,
  FaUserDoctor,
  FaStethoscope,
  AiFillDelete,
} from "../../ReactICON/index";

const AI = ({ setOpenComponent, userType }) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [chatArray, setChatArray] = useState([]);
  const [update, setUpdate] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRole, setSelectedRole] = useState(
    userType === "Doctor" ? "Doctor" : "Patient"
  );

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (userType === "Doctor" || userType === "Patient") {
      setSelectedRole(userType);
    }
  }, [userType]);

  useEffect(() => {
    try {
      const AI_ASK_HISTORY = JSON.parse(
        localStorage.getItem("AI_ASK_HISTORY") || "[]"
      );
      setChatArray(AI_ASK_HISTORY);
    } catch (e) {
      setChatArray([]);
    }
  }, [update]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatArray, loader]);

  const CALLING_AI = async () => {
    if (!prompt || !prompt.trim() || loader) return;
    const currentPrompt = prompt.trim();
    try {
      setLoader(true);
      setErrorMsg("");
      setPrompt("");
      const response = await ASK_AI_CHAT(currentPrompt, selectedRole);
      if (response) {
        setUpdate((prev) => prev + 1);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setErrorMsg(error.message);
      notifyError(error.message || "Failed to communicate with AI");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      CALLING_AI();
    }
  };

  const copyResponse = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    notifySuccess("Copied successfully");
  };

  const clearHistory = () => {
    localStorage.removeItem("AI_ASK_HISTORY");
    setChatArray([]);
    setUpdate((prev) => prev + 1);
    notifySuccess("Chat history cleared");
  };

  const roleDescriptions = {
    Patient:
      "Patient Mode: Empathetic, simple language, home-care guidance, red flags, & consulting doctor.",
    Doctor:
      "Doctor Mode: Clinical depth, differential diagnosis, pharmacology, contraindications, & medical guidelines.",
    General:
      "General Mode: Balanced, comprehensive medical reference and educational health explanations.",
  };

  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">CONSULTATION</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">TRUSTMED GEMINI AI</a>
          </li>
        </ol>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <h4 className="card-title mb-1 d-flex align-items-center gap-2">
                  <span className="text-primary me-2">
                    <BsRobot />
                  </span>
                  TrustMed AI Medical Assistant (Gemini)
                </h4>
                <p className="mb-0 text-muted fs-13">
                  {roleDescriptions[selectedRole]}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                <span className="me-2 text-muted fs-13 fw-semibold">
                  Consultation Mode:
                </span>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedRole === "Patient"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedRole("Patient")}
                  >
                    <FaUserAlt className="me-1" /> Patient
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedRole === "Doctor"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedRole("Doctor")}
                  >
                    <FaUserDoctor className="me-1" /> Doctor
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedRole === "General"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedRole("General")}
                  >
                    <FaStethoscope className="me-1" /> General
                  </button>
                </div>

                {chatArray?.length > 0 && (
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    title="Clear Chat History"
                    onClick={clearHistory}
                  >
                    <AiFillDelete />
                  </button>
                )}
              </div>
            </div>

            <div className="card-body">
              {/* Chat Message Box */}
              <div
                style={{
                  height: "26rem",
                  width: "100%",
                  marginBottom: "1.2rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  overflowY: "auto",
                  padding: "1rem",
                  background: "#f8fafc",
                }}
              >
                {chatArray && chatArray.length > 0 ? (
                  chatArray.map((chat, index) => (
                    <div key={index} className="mb-4">
                      {/* USER PROMPT (Right Aligned) */}
                      <div className="d-flex justify-content-end align-items-start mb-3">
                        <div
                          style={{
                            maxWidth: "75%",
                            backgroundColor: "#3b82f6",
                            color: "#ffffff",
                            padding: "12px 16px",
                            borderRadius: "16px 16px 2px 16px",
                            boxShadow: "0 2px 6px rgba(59, 130, 246, 0.15)",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1 gap-3">
                            <span
                              style={{
                                fontSize: "10px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                opacity: 0.85,
                              }}
                            >
                              You ({chat?.role || "User"})
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                opacity: 0.75,
                                cursor: "pointer",
                              }}
                              onClick={() => copyResponse(chat?.prompt)}
                              title="Copy prompt"
                            >
                              <FaRegCopy />
                            </span>
                          </div>
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                          >
                            {chat?.prompt}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              opacity: 0.7,
                              marginTop: "4px",
                              textAlign: "right",
                            }}
                          >
                            {chat?.timestamp
                              ? new Date(chat.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </div>
                        </div>
                        <div
                          className="ms-2 d-flex align-items-center justify-content-center"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          <FaUserAlt />
                        </div>
                      </div>

                      {/* AI RESPONSE (Left Aligned) */}
                      <div className="d-flex justify-content-start align-items-start mb-3">
                        <div
                          className="me-2 d-flex align-items-center justify-content-center"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#10b981",
                            color: "#fff",
                            flexShrink: 0,
                          }}
                        >
                          <BsRobot />
                        </div>
                        <div
                          style={{
                            maxWidth: "75%",
                            backgroundColor: "#ffffff",
                            color: "#1e293b",
                            padding: "14px 18px",
                            borderRadius: "16px 16px 16px 2px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2 gap-3">
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "#059669",
                              }}
                            >
                              TrustMed AI (Gemini)
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                cursor: "pointer",
                              }}
                              onClick={() => copyResponse(chat?.message)}
                              title="Copy response"
                            >
                              <FaRegCopy />
                            </span>
                          </div>
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontSize: "14px",
                              lineHeight: "1.6",
                            }}
                          >
                            {chat?.message}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              marginTop: "6px",
                            }}
                          >
                            {chat?.timestamp
                              ? new Date(chat.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center h-100 text-muted"
                    style={{ minHeight: "18rem" }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#ecfdf5",
                        color: "#059669",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "26px",
                        marginBottom: "1rem",
                      }}
                    >
                      <BsRobot />
                    </div>
                    <h5>Welcome to TrustMed Gemini AI</h5>
                    <p className="text-center" style={{ maxWidth: "460px", fontSize: "13px" }}>
                      Select a consultation mode ({selectedRole} active) and ask any health,
                      prescription, or clinical inquiry below.
                    </p>
                  </div>
                )}

                {/* Loading indicator when waiting for Gemini */}
                {loader && (
                  <div className="d-flex justify-content-start align-items-center mb-3">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      <BsRobot />
                    </div>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "10px 16px",
                        borderRadius: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="text-muted fs-13">Gemini is analyzing your medical prompt...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="compose-content">
                <div className="mb-2">
                  <textarea
                    id="ai-prompt-input"
                    className="form-control"
                    rows={2}
                    placeholder={
                      selectedRole === "Patient"
                        ? "Ask about symptoms, medications, home care, or questions for your doctor... (Press Enter to send)"
                        : selectedRole === "Doctor"
                        ? "Enter clinical question, differential query, contraindications, or dosage protocols... (Press Enter to send)"
                        : "Ask any medical or healthcare question... (Press Enter to send)"
                    }
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={prompt}
                    style={{
                      borderRadius: "8px",
                      borderColor: "#cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted fs-12">
                  Tip: Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for a new line.
                </span>

                <div className="text-end">
                  {loader ? (
                    <button className="btn btn-primary btn-sl-sm" type="button" disabled>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Consulting Gemini...
                    </button>
                  ) : (
                    <button
                      onClick={CALLING_AI}
                      className="btn btn-primary btn-sl-sm d-flex align-items-center gap-2"
                      type="button"
                      disabled={!prompt || !prompt.trim()}
                    >
                      <span>
                        <BsSendFill />
                      </span>
                      <span>Ask AI ({selectedRole})</span>
                    </button>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="alert alert-danger mt-3 mb-0 fs-13" role="alert">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;
