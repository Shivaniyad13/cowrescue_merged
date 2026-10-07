import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./TrackCowWidget.module.css";
import SupportRescueModal from "../../pages/CowRescue/components/SupportRescueModal";
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
  DISPATCHED: "Alerts Sent",
  NGO_ASSIGNED: "NGO Assigned",
  GOV_ASSIGNED: "Government Assigned",
  IN_PROGRESS: "In Progress",
  RESCUED: "Rescued",
  TREATED: "Treated",
  SHELTERED: "Sheltered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Profile / user icon (inline SVG)
const ProfileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TrackCowWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchMode, setSearchMode] = useState("case"); // "case" | "phone"

  // Case ID mode
  const [caseInput, setCaseInput] = useState("");
  const [caseData, setCaseData] = useState(null);
  const [timeline, setTimeline] = useState([]);

  // Phone mode
  const [phoneInput, setPhoneInput] = useState("");
  const [myCases, setMyCases] = useState([]);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [phoneSearched, setPhoneSearched] = useState(false);

  // Common
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportCaseData, setSupportCaseData] = useState(null);
  const [emergencyNumber, setEmergencyNumber] = useState("1962");
  const [emergencyLabel, setEmergencyLabel] = useState("Govt. Animal Ambulance");

  const location = useLocation();
  const isTrackPage = location.pathname === "/cow-rescue/track";

  // Load config
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

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchMode("case");
      setCaseInput("");
      setCaseData(null);
      setTimeline([]);
      setPhoneInput("");
      setMyCases([]);
      setExpandedCaseId(null);
      setPhoneSearched(false);
      setError("");
      setShowFullDetails(false);
      setActionMessage("");
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ✅ UPDATED — External open event with optional caseId
  useEffect(() => {
    const handler = async (e) => {
      setIsOpen(true);

      const caseId = e?.detail?.caseId;
      if (!caseId) return;

      // Pre-fill and auto-search
      setSearchMode("case");
      setCaseInput(String(caseId).toUpperCase());
      setLoading(true);
      setError("");
      setCaseData(null);
      setTimeline([]);
      setShowFullDetails(false);
      setActionMessage("");

      try {
        const res = await trackCase(String(caseId).trim().toUpperCase());
        setCaseData(res.data);
        setTimeline(res.data.case_timeline || []);
      } catch (err) {
        setError(err.message || "Case not found with this ID.");
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("openTrackCowWidget", handler);
    return () => window.removeEventListener("openTrackCowWidget", handler);
  }, []);

  if (isTrackPage) return null;

  // ═══════════════════════════════════════════════
  // CASE ID SEARCH
  // ═══════════════════════════════════════════════
  const handleCaseSearch = async (e) => {
    e.preventDefault();
    if (!caseInput.trim()) return;

    setLoading(true);
    setError("");
    setCaseData(null);
    setTimeline([]);
    setShowFullDetails(false);
    setActionMessage("");

    try {
      const res = await trackCase(caseInput.trim().toUpperCase());
      setCaseData(res.data);
      setTimeline(res.data.case_timeline || []);
    } catch (err) {
      setError(err.message || "Case not found with this ID.");
    } finally {
      setLoading(false);
    }
  };

  const refetchCase = async () => {
    if (!caseData) return;
    try {
      const res = await trackCase(caseData.case_id);
      setCaseData(res.data);
      setTimeline(res.data.case_timeline || []);
    } catch (err) {
      console.warn("Refetch failed:", err.message);
    }
  };

  // ═══════════════════════════════════════════════
  // PHONE SEARCH
  // ═══════════════════════════════════════════════
  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    setMyCases([]);
    setExpandedCaseId(null);
    setPhoneSearched(false);

    try {
      const res = await getMyCasesByPhone(phoneInput.trim());
      setMyCases(res.data || []);
      setPhoneSearched(true);

      if (res.data && res.data.length > 0) {
        setExpandedCaseId(res.data[0].case_id);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch your reports.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCase = (caseId) => {
    setExpandedCaseId((prev) => (prev === caseId ? null : caseId));
  };

  // ═══════════════════════════════════════════════
  // USER ACTIONS
  // ═══════════════════════════════════════════════
  const handleAction = async (actionFn, actionName, caseId) => {
    if (!window.confirm(`Are you sure you want to ${actionName}?`)) return;

    setActionLoading(true);
    setActionMessage("");
    try {
      await actionFn(caseId, "");
      setActionMessage(`✅ ${actionName} logged successfully`);

      if (searchMode === "phone") {
        const res = await getMyCasesByPhone(phoneInput.trim());
        setMyCases(res.data || []);
      } else {
        await refetchCase();
      }
    } catch (err) {
      setActionMessage(`⚠️ ${err.message || "Action failed"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
  };

  const isAccepted = (status) =>
    ["NGO_ASSIGNED", "GOV_ASSIGNED", "IN_PROGRESS", "RESCUED", "TREATED", "SHELTERED", "COMPLETED"].includes(status);

  const alertsSent = caseData?.case_alerts?.length > 0 || false;
  const accepted = caseData ? isAccepted(caseData.status) : false;

  // ═══════════════════════════════════════════════
  // REUSABLE: CASE DETAILS BLOCK
  // ═══════════════════════════════════════════════
  const renderCaseDetails = (data, caseTimeline) => {
    const caseAccepted = isAccepted(data.status);

    return (
      <>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Severity</span>
            <span className={styles.detailValue}>{data.severity || "MEDIUM"}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>
              {[data.address, data.city, data.state].filter(Boolean).join(", ") || "—"}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Reported At</span>
            <span className={styles.detailValue}>
              {new Date(data.created_at).toLocaleString("en-IN")}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Last Updated</span>
            <span className={styles.detailValue}>
              {new Date(data.updated_at).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {data.ngos && (
          <div className={styles.assignedOrgCard}>
            <div className={styles.assignedOrgLabel}>Assigned Partner Organization</div>
            <div className={styles.assignedOrgName}>{data.ngos.name}</div>
            {data.ngos.city && (
              <div className={styles.assignedOrgLoc}>
                📍 {data.ngos.city}, {data.ngos.state}
              </div>
            )}
          </div>
        )}

        {data.description && (
          <div className={styles.sectionBox}>
            <div className={styles.sectionTitle}>📝 Situation Description</div>
            <p className={styles.sectionText}>{data.description}</p>
          </div>
        )}

        {data.photo_url && (
          <div className={styles.sectionBox}>
            <div className={styles.sectionTitle}>📷 Incident Photo</div>
            <img src={data.photo_url} alt="Rescue incident" className={styles.photoImgFull} />
          </div>
        )}

        {/* Support button */}
        {caseAccepted && (
          <button
            className={styles.supportBtn}
            onClick={() => {
              setSupportCaseData(data);
              setShowSupportModal(true);
            }}
          >
            💝 Support this Rescue
          </button>
        )}

        {/* User actions */}
        {!caseAccepted && (
          <div className={styles.sectionBox}>
            <div className={styles.sectionTitle}>🚨 Need to take action?</div>
            <p className={styles.sectionSubText}>Let us know if you've taken any of these actions:</p>
            <div className={styles.actionBtns}>
              <button
                className={`${styles.actionBtn} ${styles.actionBtnBlue}`}
                onClick={() => handleAction(userCalled1962, `call to ${emergencyNumber}`, data.case_id)}
                disabled={actionLoading}
              >
                📞 I called {emergencyNumber}
              </button>
              <button
                className={`${styles.actionBtn} ${styles.actionBtnOrange}`}
                onClick={() => handleAction(userRequestHelp, "help request", data.case_id)}
                disabled={actionLoading}
              >
                🙏 Request Help
              </button>
              <button
                className={`${styles.actionBtn} ${styles.actionBtnRed}`}
                onClick={() => handleAction(userNoResponse, "no-response report", data.case_id)}
                disabled={actionLoading}
              >
                ⚠️ Report No Response
              </button>
            </div>
            {actionMessage && <div className={styles.actionMsg}>{actionMessage}</div>}
          </div>
        )}

        {/* Timeline */}
        <div className={styles.sectionBox}>
          <div className={styles.sectionTitle}>📌 Case Activity Timeline</div>
          {(!caseTimeline || caseTimeline.length === 0) ? (
            <p className={styles.emptyTimeline}>No activity yet.</p>
          ) : (
            <div className={styles.timelineListFull}>
              {caseTimeline.map((item, idx) => (
                <div key={idx} className={styles.timelineItemFull}>
                  <div className={styles.timelineDotFull}></div>
                  <div className={styles.timelineContentFull}>
                    <div className={styles.timelineHeaderFull}>
                      <strong>{item.event}</strong>
                      <span className={styles.timelineTimeFull}>
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {item.description && (
                      <p className={styles.timelineDescFull}>{item.description}</p>
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
    <>
      {/* Floating Button — profile icon + "Track Your Status" */}
      <button
        className={styles.floatingBtn}
        onClick={() => setIsOpen(true)}
        aria-label="Track Status"
        title="Track Status"
      >
        <span className={styles.btnIcon}>
          <ProfileIcon />
        </span>
        <span className={styles.btnLabel}>Track Your Status</span>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>🔍 Track Rescue Status</h2>
                <p className={styles.modalSub}>
                  Search by Case ID or find all your reports by phone number
                </p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* ═══ TABS ═══ */}
            <div className={styles.tabsBar}>
              <button
                className={`${styles.tabBtn} ${searchMode === "case" ? styles.tabBtnActive : ""}`}
                onClick={() => {
                  setSearchMode("case");
                  setError("");
                }}
              >
                📋 By Case ID
              </button>
              <button
                className={`${styles.tabBtn} ${searchMode === "phone" ? styles.tabBtnActive : ""}`}
                onClick={() => {
                  setSearchMode("phone");
                  setError("");
                }}
              >
                📱 My Reports
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* ═══ CASE ID MODE ═══ */}
              {searchMode === "case" && (
                <>
                  <form onSubmit={handleCaseSearch} className={styles.searchForm}>
                    <input
                      type="text"
                      placeholder="Enter Case ID (e.g. CASE-2026-123456)"
                      value={caseInput}
                      onChange={(e) => setCaseInput(e.target.value.toUpperCase())}
                      className={styles.searchInput}
                      required
                    />
                    <button type="submit" disabled={loading} className={styles.searchBtn}>
                      {loading ? "🔄" : "Search"}
                    </button>
                  </form>

                  {error && <div className={styles.errorBox}>⚠️ {error}</div>}

                  {loading && (
                    <div className={styles.loadingBox}>
                      <span>🔄</span> Fetching case details...
                    </div>
                  )}

                  {caseData && !showFullDetails && (
                    <div className={styles.caseResult}>
                      <div className={styles.caseHeader}>
                        <div>
                          <div className={styles.caseIdBadge}>Case ID: {caseData.case_id}</div>
                          <h3 className={styles.caseTitle}>
                            {caseData.animal_type} — {caseData.animal_condition || "Unknown"}
                          </h3>
                        </div>
                        <span className={styles.statusBadge}>
                          {STATUS_LABELS[caseData.status] || caseData.status}
                        </span>
                      </div>

                      {alertsSent && !accepted && (
                        <div className={styles.dispatchBanner}>
                          <div className={styles.bannerHeader}>
                            <span className={styles.bannerIcon}>📡</span>
                            <strong>Alerts Sent — Please Wait</strong>
                          </div>
                          <p className={styles.bannerText}>
                            Your report has been sent to nearby NGOs and {emergencyLabel}.
                          </p>
                        </div>
                      )}

                      {accepted && (
                        <div className={styles.acceptedBanner}>
                          <div className={styles.bannerHeader}>
                            <span className={styles.bannerIcon}>✅</span>
                            <strong>Case Accepted!</strong>
                          </div>
                          <p className={styles.bannerText}>
                            A nearby NGO has accepted your report and is on the way.
                          </p>
                          {caseData.ngos && (
                            <p className={styles.assignedInfo}>
                              <strong>Assigned to:</strong> {caseData.ngos.name}
                            </p>
                          )}
                        </div>
                      )}

                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Severity</span>
                          <span className={styles.detailValue}>{caseData.severity || "MEDIUM"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Location</span>
                          <span className={styles.detailValue}>
                            {[caseData.city, caseData.state].filter(Boolean).join(", ") || "—"}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Reported At</span>
                          <span className={styles.detailValue}>
                            {new Date(caseData.created_at).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <button
                        className={styles.fullDetailsBtn}
                        onClick={() => setShowFullDetails(true)}
                      >
                        View Full Details →
                      </button>
                    </div>
                  )}

                  {caseData && showFullDetails && (
                    <div className={styles.fullDetailsView}>
                      <button
                        className={styles.backToCompact}
                        onClick={() => setShowFullDetails(false)}
                      >
                        ← Back to Summary
                      </button>
                      <div className={styles.caseHeader}>
                        <div>
                          <div className={styles.caseIdBadge}>Case ID: {caseData.case_id}</div>
                          <h3 className={styles.caseTitle}>
                            {caseData.animal_type} — {caseData.animal_condition || "Unknown"}
                          </h3>
                        </div>
                        <span className={styles.statusBadge}>
                          {STATUS_LABELS[caseData.status] || caseData.status}
                        </span>
                      </div>
                      {renderCaseDetails(caseData, timeline)}
                    </div>
                  )}

                  {!caseData && !loading && !error && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📋</div>
                      <p className={styles.emptyText}>
                        Enter your Case ID above to track status.
                      </p>
                      <p className={styles.emptyHint}>
                        💡 You received the Case ID via email when you submitted the report.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* ═══ PHONE MODE ═══ */}
              {searchMode === "phone" && (
                <>
                  <form onSubmit={handlePhoneSearch} className={styles.searchForm}>
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
                      {loading ? "🔄" : "Find"}
                    </button>
                  </form>

                  {error && <div className={styles.errorBox}>⚠️ {error}</div>}

                  {loading && (
                    <div className={styles.loadingBox}>
                      <span>🔄</span> Fetching your reports...
                    </div>
                  )}

                  {phoneSearched && !loading && myCases.length === 0 && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📭</div>
                      <p className={styles.emptyText}>No reports found</p>
                      <p className={styles.emptyHint}>
                        No cow rescue reports found for this phone number.
                      </p>
                    </div>
                  )}

                  {myCases.length > 0 && (
                    <div className={styles.casesAccordion}>
                      <div className={styles.casesSummary}>
                        📊 <strong>{myCases.length}</strong> report(s) found — Latest on top
                      </div>

                      {myCases.map((c, index) => {
                        const isExpanded = expandedCaseId === c.case_id;
                        const caseAccepted = isAccepted(c.status);

                        return (
                          <div
                            key={c.case_id}
                            className={`${styles.accordionItem} ${isExpanded ? styles.accordionItemOpen : ""}`}
                          >
                            <button
                              className={styles.accordionHeader}
                              onClick={() => toggleCase(c.case_id)}
                            >
                              <div
                                className={`${styles.accordionBadge} ${index === 0 ? styles.accordionBadgeNew : ""}`}
                              >
                                {index === 0 ? "🆕" : index + 1}
                              </div>
                              <div className={styles.accordionInfo}>
                                <div className={styles.accordionCaseId}>{c.case_id}</div>
                                <div className={styles.accordionMeta}>
                                  {c.animal_type} • {c.animal_condition || "Unknown"} •{" "}
                                  {new Date(c.created_at).toLocaleDateString("en-IN")}
                                </div>
                              </div>
                              <span
                                className={`${styles.accordionStatus} ${
                                  caseAccepted ? styles.accordionStatusAccepted : styles.accordionStatusPending
                                }`}
                              >
                                {STATUS_LABELS[c.status] || c.status}
                              </span>
                              <span className={styles.accordionChevron}>
                                {isExpanded ? "▼" : "▶"}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className={styles.accordionBody}>
                                {caseAccepted && (
                                  <div className={styles.acceptedBanner}>
                                    <div className={styles.bannerHeader}>
                                      <span className={styles.bannerIcon}>✅</span>
                                      <strong>Case Accepted!</strong>
                                    </div>
                                    <p className={styles.bannerText}>
                                      {c.status === "GOV_ASSIGNED"
                                        ? `The ${emergencyLabel} has accepted your report.`
                                        : "A nearby NGO has accepted your report."}
                                    </p>
                                  </div>
                                )}

                                {!caseAccepted && c.case_alerts?.length > 0 && (
                                  <div className={styles.dispatchBanner}>
                                    <div className={styles.bannerHeader}>
                                      <span className={styles.bannerIcon}>📡</span>
                                      <strong>Alerts Sent</strong>
                                    </div>
                                    <p className={styles.bannerText}>
                                      Awaiting response from nearby NGOs.
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

                  {!phoneSearched && !loading && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📱</div>
                      <p className={styles.emptyText}>
                        Enter your phone number to see all your reports.
                      </p>
                      <p className={styles.emptyHint}>
                        💡 Use the same number you provided when reporting.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
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
            if (searchMode === "phone" && phoneInput) {
              getMyCasesByPhone(phoneInput.trim()).then((res) => {
                setMyCases(res.data || []);
              });
            } else if (caseData) {
              refetchCase();
            }
          }}
        />
      )}
    </>
  );
};

export default TrackCowWidget;