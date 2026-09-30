import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./TrackRescue.module.css";
import { trackCase, userCalled1962, userRequestHelp, userNoResponse } from "../../services/api";

const STATUS_LABELS = {
  REPORTED: "Reported",
  NGO_ASSIGNED: "NGO Assigned",
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

  const [caseInput, setCaseInput] = useState(initialCaseId);
  const [caseData, setCaseData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (initialCaseId) {
      fetchCase(initialCaseId);
    }
  }, [initialCaseId]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (caseInput.trim()) {
      setSearchParams({ case: caseInput.trim().toUpperCase() });
      fetchCase(caseInput.trim());
    }
  };

  const handleAction = async (actionFn, actionName) => {
    if (!caseData) return;
    if (!window.confirm(`Are you sure you want to ${actionName}?`)) return;

    setActionLoading(true);
    setActionMessage("");
    try {
      await actionFn(caseData.case_id, "");
      setActionMessage(`✅ ${actionName} logged successfully`);
      // Refresh case data
      await fetchCase(caseData.case_id);
    } catch (err) {
      setActionMessage(`⚠️ ${err.message || "Action failed"}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Link to="/cow-rescue" className={styles.backLink}>
          ← Back to Cow Rescue Portal
        </Link>
        <h1>🔍 Track Cow Rescue Status</h1>
        <p>Enter your Case ID (e.g. CASE-2026-123456) to view report status and timeline.</p>
      </div>

      <form onSubmit={handleSearch} className={styles.searchCard}>
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
          <span>🔄</span> Fetching case details for #{caseInput}...
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

          {/* Assigned NGO */}
          {caseData.ngos && (
            <div className={styles.assignedOrgCard}>
              <div className={styles.assignedOrgHeader}>
                <div>
                  <span className={styles.assignedBadge}>Assigned Partner Organization</span>
                  <h3 className={styles.assignedOrgName}>{caseData.ngos.name}</h3>
                  {caseData.ngos.city && (
                    <p className={styles.assignedOrgLoc}>
                      📍 {caseData.ngos.city}, {caseData.ngos.state}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <strong>Severity:</strong>
              <span>{caseData.severity || "MEDIUM"}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Location:</strong>
              <span>
                {[caseData.address, caseData.city, caseData.state]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
            <div className={styles.detailItem}>
              <strong>Reported At:</strong>
              <span>{new Date(caseData.created_at).toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Last Updated:</strong>
              <span>{new Date(caseData.updated_at).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <strong>Situation Description:</strong>
            <p>{caseData.description}</p>
          </div>

          {caseData.photo_url && (
            <div className={styles.photoBox}>
              <strong>Incident Photo:</strong>
              <div style={{ marginTop: "8px" }}>
                <img
                  src={caseData.photo_url}
                  alt="Rescue incident"
                  className={styles.photoImg}
                />
              </div>
            </div>
          )}

          {/* User Action Buttons */}
          <div className={styles.actionButtons}>
            <h3>🚨 Need to take action?</h3>
            <p style={{ color: "#666", marginBottom: "12px" }}>
              Let the admin know if you've taken any of these actions:
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleAction(userCalled1962, "1962 call")}
                disabled={actionLoading}
                style={{ padding: "10px 16px", background: "#0066cc", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                📞 I called 1962
              </button>
              <button
                onClick={() => handleAction(userRequestHelp, "help request")}
                disabled={actionLoading}
                style={{ padding: "10px 16px", background: "#ff9800", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                🙏 Request Additional Help
              </button>
              <button
                onClick={() => handleAction(userNoResponse, "no-response report")}
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

          {/* Timeline */}
          <div className={styles.timelineSection}>
            <h3 className={styles.timelineTitle}>📌 Case Activity Timeline</h3>
            {timeline.length === 0 ? (
              <p className={styles.emptyTimeline}>No progress logs available yet.</p>
            ) : (
              <div className={styles.timelineList}>
                {timeline.map((item, idx) => (
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
                      {item.performed_by && (
                        <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                          By: {item.performed_by}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackRescue;