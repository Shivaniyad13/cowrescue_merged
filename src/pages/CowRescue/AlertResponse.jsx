import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlertByToken, acceptAlert, rejectAlert } from "../../services/api";

const AlertResponse = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState(null);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) fetchAlert();
  }, [token]);

  const fetchAlert = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAlertByToken(token);
      setAlertData(res.data);
      if (res.data.status === "RESPONDED" && res.data.response) {
        setActionStatus(res.data.response);
      }
    } catch (err) {
      setError(err.message || "Alert not found or expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!window.confirm("Accept this rescue request?")) return;
    setSubmitting(true);
    try {
      await acceptAlert(token);
      setActionStatus("ACCEPTED");
    } catch (err) {
      setError(err.message || "Failed to accept alert.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    setSubmitting(true);
    try {
      await rejectAlert(token, rejectReason);
      setActionStatus("REJECTED");
    } catch (err) {
      setError(err.message || "Failed to reject alert.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "24px", textAlign: "center" }}>
        <h2>🔄 Loading alert details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "24px" }}>
        <div style={{ background: "#fee", border: "1px solid #fcc", padding: "16px", borderRadius: "8px", color: "#c00" }}>
          <h2>⚠️ {error}</h2>
          <p>This alert link may have expired or already been responded to.</p>
          <Link to="/cow-rescue" style={{ color: "#0066cc" }}>← Back to Cow Rescue Portal</Link>
        </div>
      </div>
    );
  }

  if (!alertData) return null;

  const caseData = alertData.cases || {};

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "24px" }}>
      <Link to="/cow-rescue" style={{ color: "#0066cc", textDecoration: "none" }}>← Back to Portal</Link>

      <h1 style={{ marginTop: "20px" }}>🚨 Rescue Alert</h1>

      {/* Status Banner */}
      {actionStatus === "ACCEPTED" && (
        <div style={{ background: "#d4edda", border: "1px solid #c3e6cb", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#155724" }}>✅ You have ACCEPTED this rescue request</h2>
          <p style={{ margin: "8px 0 0" }}>Please reach the location as soon as possible. The admin has been notified.</p>
        </div>
      )}

      {actionStatus === "REJECTED" && (
        <div style={{ background: "#f8d7da", border: "1px solid #f5c6cb", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#721c24" }}>❌ You have DECLINED this rescue request</h2>
          <p style={{ margin: "8px 0 0" }}>The admin will assign this case to another organization.</p>
        </div>
      )}

      {/* Case Details */}
      <div style={{ background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0 }}>📋 Case Details</h2>
        <p><strong>Case ID:</strong> {caseData.case_id}</p>
        <p><strong>Animal:</strong> {caseData.animal_type} — {caseData.animal_condition || "Unknown condition"}</p>
        <p><strong>Severity:</strong> {caseData.severity}</p>
        <p><strong>Description:</strong> {caseData.description}</p>
        <p><strong>Location:</strong> {[caseData.address, caseData.city, caseData.state].filter(Boolean).join(", ")}</p>
        {caseData.reporter_name && <p><strong>Reporter:</strong> {caseData.reporter_name} ({caseData.reporter_phone})</p>}
        {caseData.photo_url && (
          <div>
            <strong>Photo:</strong><br />
            <img src={caseData.photo_url} alt="Case" style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "8px", borderRadius: "6px" }} />
          </div>
        )}
      </div>

      {/* Alert Info */}
      <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
        <p style={{ margin: 0 }}><strong>Response Deadline:</strong> {new Date(alertData.response_deadline).toLocaleString("en-IN")}</p>
        <p style={{ margin: "8px 0 0" }}><strong>Channel:</strong> {alertData.channel}</p>
        {alertData.note && <p style={{ margin: "8px 0 0" }}><strong>Note from Admin:</strong> {alertData.note}</p>}
      </div>

      {/* Action Buttons */}
      {!actionStatus && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleAccept}
            disabled={submitting}
            style={{ padding: "14px", fontSize: "16px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            {submitting ? "Processing..." : "✅ Accept Rescue Request"}
          </button>

          {!showRejectInput ? (
            <button
              onClick={handleReject}
              disabled={submitting}
              style={{ padding: "14px", fontSize: "16px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              ❌ Decline Request
            </button>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}><strong>Reason for declining (optional):</strong></label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="3"
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px", marginBottom: "8px" }}
                placeholder="e.g. Outside our service area, no vet available..."
              />
              <button
                onClick={handleReject}
                disabled={submitting}
                style={{ padding: "10px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                {submitting ? "Processing..." : "Confirm Decline"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertResponse;