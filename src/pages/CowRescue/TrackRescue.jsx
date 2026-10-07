import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./TrackRescue.module.css";
import SupportRescueModal from "./components/SupportRescueModal";
import {
  trackCase,
  getMyCasesByPhone,
  userCalled1962,
  userRequestHelp,
  userNoResponse,
  getPublicConfig,
} from "../../services/api";

const STATUS_LABELS = {
  REPORTED: "Reported",
  DISPATCHED: "Alerts Sent — Awaiting Response",
  NGO_ASSIGNED: "NGO Assigned",
  GOV_ASSIGNED: "Government Assigned",
  IN_PROGRESS: "In Progress",
  RESCUED: "Rescued",
  TREATED: "Treated",
  SHELTERED: "Sheltered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const TrackRescue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCaseId = searchParams.get("case") || searchParams.get("ticket") || "";

  const [searchMode, setSearchMode] = useState("case"); // "case" | "phone"

  // Case ID mode
  const [caseInput, setCaseInput] = useState(initialCaseId);
  const [caseData, setCaseData] = useState(null);
  const [timeline, setTimeline] = useState([]);

  // Phone mode
  const [phoneInput, setPhoneInput] = useState("");
  const [myCases, setMyCases] = useState([]);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [phoneSearched, setPhoneSearched] = useState(false);

  // Common
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportCaseData, setSupportCaseData] = useState(null);

  const [emergencyNumber, setEmergencyNumber] = useState("1962");
  const [emergencyLabel, setEmergencyLabel] = useState("Govt. Animal Ambulance");

  useEffect(() => {
    getPublicConfig()
      .then((res) => {
        if (res.data) {
          setEmergencyNumber(res.data.emergency_number || "1962");
          setEmergencyLabel(res.data.emergency_label || "Govt. Animal Ambulance");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialCaseId) {
      fetchCase(initialCaseId);
    }
  }, [initialCaseId]);

  // ═══════════════════════════════════════════════
  // CASE ID MODE
  // ═══════════════════════════════════════════════
  const fetchCase = async (caseId) => {
    if (!caseId.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setCaseData(null);
    setTimeline([]);

    try {
      const res = await trackCase(caseId.trim());
      setCaseData(res.data);
      setTimeline(res.data.case_timeline || []);
    } catch (err) {
      setErrorMsg(err.message || "Case not found with this ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaseSearch = (e) => {
    e.preventDefault();
    if (caseInput.trim()) {
      setSearchParams({ case: caseInput.trim().toUpperCase() });
      fetchCase(caseInput.trim());
    }
  };

  // ═══════════════════════════════════════════════
  // PHONE MODE
  // ═══════════════════════════════════════════════
  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setMyCases([]);
    setExpandedCaseId(null);
    setPhoneSearched(false);

    try {
      const res = await getMyCasesByPhone(phoneInput.trim());
      setMyCases(res.data || []);
      setPhoneSearched(true);

      // Auto-expand latest case (first in array since sorted desc)
      if (res.data && res.data.length > 0) {
        setExpandedCaseId(res.data[0].case_id);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to fetch your reports.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCase = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  // ═══════════════════════════════════════════════
  // USER ACTIONS (used inside expanded case)
  // ═══════════════════════════════════════════════
  const handleAction = async (actionFn, actionName, caseId) => {
    if (!window.confirm(`Are you sure you want to ${actionName}?`)) return;

    setActionLoading(true);
    setActionMessage("");
    try {
      await actionFn(caseId, "");
      setActionMessage(`✅ ${actionName} logged successfully`);
      // Refetch phone reports
      const res = await getMyCasesByPhone(phoneInput.trim());
      setMyCases(res.data || []);
    } catch (err) {
      setActionMessage(`⚠️ ${err.message || "Action failed"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const isAccepted = (status) =>
    ["NGO_ASSIGNED", "GOV_ASSIGNED", "IN_PROGRESS", "RESCUED", "TREATED", "SHELTERED", "COMPLETED"].includes(status);

  // ═══════════════════════════════════════════════
  // CASE DETAILS BLOCK (reusable for both modes)
  // ═══════════════════════════════════════════════
  const renderCaseDetails = (data, caseTimeline) => {
    const alertsSent = data?.case_alerts?.length > 0;
    const accepted = isAccepted(data.status);

    return (
      <>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <strong>Severity:</strong>
            <span>{data.severity || "MEDIUM"}</span>
          </div>
          <div className={styles.detailItem}>
            <strong>Location:</strong>
            <span>
              {[data.address, data.city, data.state].filter(Boolean).join(", ")}
            </span>
          </div>
          <div className={styles.detailItem}>
            <strong>Reported At:</strong>
            <span>{new Date(data.created_at).toLocaleString("en-IN")}</span>
          </div>
          <div className={styles.detailItem}>
            <strong>Last Updated:</strong>
            <span>{new Date(data.updated_at).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {data.ngos && (
          <div className={styles.assignedOrgCard}>
            <div className={styles.assignedOrgHeader}>
              <div>
                <span className={styles.assignedBadge}>Assigned Partner Organization</span>
                <h3 className={styles.assignedOrgName}>{data.ngos.name}</h3>
                {data.ngos.city && (
                  <p className={styles.assignedOrgLoc}>
                    📍 {data.ngos.city}, {data.ngos.state}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {data.description && (
          <div className={styles.descriptionBox}>
            <strong>Situation Description:</strong>
            <p>{data.description}</p>
          </div>
        )}

        {data.photo_url && (
          <div className={styles.photoBox}>
            <strong>Incident Photo:</strong>
            <div style={{ marginTop: "8px" }}>
              <img src={data.photo_url} alt="Rescue incident" className={styles.photoImg} />
            </div>
          </div>
        )}

        {/* Support Button */}
        {accepted && (
          <button
            onClick={() => {
              setSupportCaseData(data);
              setShowSupportModal(true);
            }}
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
            }}
          >
            💝 Support this Rescue
          </button>
        )}

        {/* User Actions */}
        {!accepted && (
          <div className={styles.actionButtons}>
            <h3 style={{ marginTop: "16px" }}>🚨 Need to take action?</h3>
            <p style={{ color: "#666", marginBottom: "12px", fontSize: "0.88rem" }}>
              Let us know if you've taken any of these actions:
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleAction(userCalled1962, `call to ${emergencyNumber}`, data.case_id)}
                disabled={actionLoading}
                style={{ padding: "10px 16px", background: "#0066cc", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                📞 I called {emergencyNumber}
              </button>
              <button
                onClick={() => handleAction(userRequestHelp, "help request", data.case_id)}
                disabled={actionLoading}
                style={{ padding: "10px 16px", background: "#ff9800", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                🙏 Request Help
              </button>
              <button
                onClick={() => handleAction(userNoResponse, "no-response report", data.case_id)}
                disabled={actionLoading}
                style={{ padding: "10px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                ⚠️ Report No Response
              </button>
            </div>
            {actionMessage && (
              <p style={{ marginTop: "12px", padding: "10px", background: "#f0f0f0", borderRadius: "6px" }}>
                {actionMessage}
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className={styles.timelineSection}>
          <h3 className={styles.timelineTitle}>📌 Case Activity Timeline</h3>
          {(!caseTimeline || caseTimeline.length === 0) ? (
            <p className={styles.emptyTimeline}>No progress logs available yet.</p>
          ) : (
            <div className={styles.timelineList}>
              {caseTimeline.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.statusTransition}>
                        <strong>{item.event}</strong>
                      </span>
                      <span className={styles.timelineTime}>
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {item.description && (
                      <p className={styles.timelineNote}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Link to="/cow-rescue" className={styles.backLink}>
          ← Back to Cow Rescue Portal
        </Link>
        <h1>🔍 Track Cow Rescue Status</h1>
        <p>Enter your Case ID or phone number to view your reports</p>
      </div>

      {/* ═══ TABS ═══ */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          maxWidth: "900px",
          margin: "0 auto 20px",
          padding: "6px",
          background: "#f1f5f9",
          borderRadius: "12px",
        }}
      >
        <button
          onClick={() => setSearchMode("case")}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: searchMode === "case" ? "#ffffff" : "transparent",
            border: searchMode === "case" ? "2px solid #16a34a" : "2px solid transparent",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: searchMode === "case" ? "#166534" : "#64748b",
            boxShadow: searchMode === "case" ? "0 2px 8px rgba(22, 163, 74, 0.15)" : "none",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          📋 By Case ID
        </button>
        <button
          onClick={() => setSearchMode("phone")}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: searchMode === "phone" ? "#ffffff" : "transparent",
            border: searchMode === "phone" ? "2px solid #2563eb" : "2px solid transparent",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: searchMode === "phone" ? "#1e40af" : "#64748b",
            boxShadow: searchMode === "phone" ? "0 2px 8px rgba(37, 99, 235, 0.15)" : "none",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          📱 My Reports
        </button>
      </div>

      {/* ═══ CASE ID TAB ═══ */}
      {searchMode === "case" && (
        <>
          <form onSubmit={handleCaseSearch} className={styles.searchCard}>
            <div className={styles.searchRow}>
              <input
                type="text"
                placeholder="Enter Case ID (e.g. CASE-2026-123456)"
                value={caseInput}
                onChange={(e) => setCaseInput(e.target.value.toUpperCase())}
                className={styles.searchInput}
                required
              />
              <button type="submit" disabled={loading} className={styles.searchBtn}>
                {loading ? "Searching..." : "Track Case"}
              </button>
            </div>
          </form>

          {errorMsg && <div className={styles.errorAlert}>⚠️ {errorMsg}</div>}

          {loading && (
            <div className={styles.loadingBox}>
              <span>🔄</span> Fetching case details...
            </div>
          )}

          {caseData && (
            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <div>
                  <div className={styles.ticketIdTag}>Case ID: {caseData.case_id}</div>
                  <h2 className={styles.cowConditionTitle}>
                    {caseData.animal_type} — {caseData.animal_condition || "Unknown condition"}
                  </h2>
                </div>
                <div className={styles.statusBadgeWrapper}>
                  <span className={styles.statusBadge}>
                    {STATUS_LABELS[caseData.status] || caseData.status}
                  </span>
                </div>
              </div>
              {renderCaseDetails(caseData, timeline)}
            </div>
          )}
        </>
      )}

      {/* ═══ PHONE TAB ═══ */}
      {searchMode === "phone" && (
        <>
          <form onSubmit={handlePhoneSearch} className={styles.searchCard}>
            <div className={styles.searchRow}>
              <input
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={styles.searchInput}
                inputMode="numeric"
                maxLength={10}
                required
              />
              <button type="submit" disabled={loading} className={styles.searchBtn}>
                {loading ? "Searching..." : "Find My Reports"}
              </button>
            </div>
          </form>

          {errorMsg && <div className={styles.errorAlert}>⚠️ {errorMsg}</div>}

          {loading && (
            <div className={styles.loadingBox}>
              <span>🔄</span> Fetching your reports...
            </div>
          )}

          {/* No results state */}
          {phoneSearched && !loading && myCases.length === 0 && (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "60px 20px",
                textAlign: "center",
                background: "#f9fafb",
                borderRadius: "16px",
                border: "2px dashed #cbd5e1",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📭</div>
              <h3 style={{ margin: "0 0 8px", color: "#374151" }}>No reports found</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                No cow rescue reports found for this phone number.
              </p>
            </div>
          )}

          {/* Cases list (accordion) */}
          {myCases.length > 0 && (
            <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  padding: "10px 14px",
                  background: "#eff6ff",
                  border: "1px solid #93c5fd",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "#1e40af",
                  marginBottom: "8px",
                }}
              >
                📊 <strong>{myCases.length}</strong> report(s) found for <strong>{phoneInput}</strong> — Latest on top
              </div>

              {myCases.map((c, index) => {
                const isExpanded = expandedCaseId === c.case_id;
                const accepted = isAccepted(c.status);

                return (
                  <div
                    key={c.case_id}
                    style={{
                      background: "#ffffff",
                      border: isExpanded ? "2px solid #16a34a" : "1px solid #e5e7eb",
                      borderRadius: "14px",
                      overflow: "hidden",
                      transition: "all 0.25s ease",
                      boxShadow: isExpanded ? "0 8px 24px rgba(22, 163, 74, 0.15)" : "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    {/* Header (clickable) */}
                    <button
                      onClick={() => toggleCase(c.case_id)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                    >
                      {/* Number badge */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: index === 0 ? "#16a34a" : "#e5e7eb",
                          color: index === 0 ? "#ffffff" : "#4b5563",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                          flexShrink: 0,
                        }}
                      >
                        {index === 0 ? "🆕" : index + 1}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 800,
                            color: "#111827",
                            marginBottom: "2px",
                            wordBreak: "break-word",
                          }}
                        >
                          {c.case_id}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          {c.animal_type} • {c.animal_condition || "Unknown"} •{" "}
                          {new Date(c.created_at).toLocaleDateString("en-IN")}
                        </div>
                      </div>

                      {/* Status badge */}
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          background: accepted ? "#dcfce7" : "#fef3c7",
                          color: accepted ? "#166534" : "#92400e",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {STATUS_LABELS[c.status] || c.status}
                      </div>

                      {/* Chevron */}
                      <div
                        style={{
                          fontSize: "1rem",
                          color: "#9ca3af",
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.25s",
                          flexShrink: 0,
                        }}
                      >
                        ▼
                      </div>
                    </button>

                    {/* Expanded body */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "0 20px 20px",
                          borderTop: "1px solid #f3f4f6",
                          paddingTop: "16px",
                        }}
                      >
                        {/* Accepted banner */}
                        {accepted && (
                          <div
                            style={{
                              background: "#d4edda",
                              border: "1px solid #86efac",
                              borderRadius: "10px",
                              padding: "14px 16px",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <span style={{ fontSize: "1.2rem" }}>✅</span>
                              <strong style={{ color: "#155724", fontSize: "0.95rem" }}>Case Accepted!</strong>
                            </div>
                            <p style={{ margin: 0, color: "#166534", fontSize: "0.85rem", lineHeight: 1.5 }}>
                              {c.status === "GOV_ASSIGNED"
                                ? `The ${emergencyLabel} has accepted your report.`
                                : "A nearby NGO has accepted your report and will reach soon."}
                            </p>
                          </div>
                        )}

                        {/* Pending banner */}
                        {!accepted && c.case_alerts?.length > 0 && (
                          <div
                            style={{
                              background: "#fffbeb",
                              border: "1px solid #fde68a",
                              borderRadius: "10px",
                              padding: "14px 16px",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <span style={{ fontSize: "1.2rem" }}>📡</span>
                              <strong style={{ color: "#78350f", fontSize: "0.95rem" }}>Alerts Sent</strong>
                            </div>
                            <p style={{ margin: 0, color: "#78350f", fontSize: "0.85rem", lineHeight: 1.5 }}>
                              Awaiting response from nearby NGOs and {emergencyLabel}.
                            </p>
                          </div>
                        )}

                        {renderCaseDetails(c, c.case_timeline || [])}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Support Modal */}
      {showSupportModal && supportCaseData && (
        <SupportRescueModal
          caseData={supportCaseData}
          onClose={() => {
            setShowSupportModal(false);
            setSupportCaseData(null);
          }}
          onSuccess={() => {
            // Refetch phone reports if in phone mode
            if (searchMode === "phone" && phoneInput) {
              getMyCasesByPhone(phoneInput.trim()).then((res) => {
                setMyCases(res.data || []);
              });
            } else if (caseData) {
              fetchCase(caseData.case_id);
            }
          }}
        />
      )}
    </div>
  );
};

export default TrackRescue;