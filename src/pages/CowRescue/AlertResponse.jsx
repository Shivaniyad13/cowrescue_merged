 
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlertByToken, acceptAlert, rejectAlert } from "../../services/api";

const AlertResponse = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState(null);
  const [alreadyAccepted, setAlreadyAccepted] = useState(null);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelledCount, setCancelledCount] = useState(0);

  useEffect(() => {
    if (token) fetchAlert();
  }, [token]);

  const fetchAlert = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAlertByToken(token);
      setAlertData(res.data);
      setAlreadyAccepted(res.already_accepted || null);

      if (res.data.status === "ACCEPTED" && res.data.response === "ACCEPTED") {
        setActionStatus("ACCEPTED");
      }
      if (res.data.status === "REJECTED" || res.data.response === "REJECTED") {
        setActionStatus("REJECTED");
      }
      if (res.data.status === "CANCELLED") {
        setActionStatus("CANCELLED");
      }
    } catch (err) {
      setError(err.message || "Alert not found or expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!window.confirm("Accept this rescue request? Other responders will be notified to stand down.")) return;
    setSubmitting(true);
    try {
      const res = await acceptAlert(token);
      setActionStatus("ACCEPTED");
      setCancelledCount(res.cancelled_count || 0);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("already been accepted")) {
        setAlreadyAccepted({
          type: "UNKNOWN",
          name: err.message,
          is_self: false,
        });
        setError(err.message);
      } else {
        setError(err.message || "Failed to accept alert.");
      }
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

  if (error && !alertData) {
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
  const ngo = alertData.ngos_case_alerts_ngo_idTongos || {};
  const isGovernment = alertData.recipient_type === "GOVERNMENT";

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "24px" }}>
      <Link to="/cow-rescue" style={{ color: "#0066cc", textDecoration: "none" }}>← Back to Portal</Link>

      <h1 style={{ marginTop: "20px" }}>
        {isGovernment ? "🚑 Government Rescue Alert" : "🚨 Rescue Alert"}
      </h1>

      {isGovernment && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          <strong>📢 Animal Welfare Helpline Alert</strong>
          <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#78350f" }}>
            You are receiving this because you're listed as the government animal welfare helpline.
          </p>
        </div>
      )}

      {actionStatus === "ACCEPTED" && (
        <div style={{ background: "#d4edda", border: "2px solid #22c55e", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#155724", fontSize: "1.4rem" }}>
            ✅ You have ACCEPTED this rescue request
          </h2>
          <p style={{ margin: "8px 0 0", color: "#166534" }}>
            Please reach the location as soon as possible. The reporter and admin have been notified.
          </p>
          {cancelledCount > 0 && (
            <p style={{ margin: "12px 0 0", padding: "10px", background: "#fff", borderRadius: "6px", color: "#166534", fontSize: "0.9rem" }}>
              📣 <strong>{cancelledCount}</strong> other responder(s) have been notified to stand down.
            </p>
          )}
        </div>
      )}

      {actionStatus === "REJECTED" && (
        <div style={{ background: "#f8d7da", border: "2px solid #dc2626", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#721c24", fontSize: "1.4rem" }}>
            ❌ You have DECLINED this rescue request
          </h2>
          <p style={{ margin: "8px 0 0", color: "#991b1b" }}>
            Other responders can still accept this case. The admin has been notified.
          </p>
        </div>
      )}

      {actionStatus === "CANCELLED" && (
        <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#78350f", fontSize: "1.4rem" }}>
            ⚠️ This case has been accepted by someone else
          </h2>
          <p style={{ margin: "8px 0 0", color: "#78350f" }}>
            Your alert has been automatically cancelled. No further action is needed.
          </p>
          {alertData.cancel_reason && (
            <p style={{ margin: "8px 0 0", fontStyle: "italic", color: "#78350f" }}>
              Reason: {alertData.cancel_reason}
            </p>
          )}
        </div>
      )}

      {alreadyAccepted && !alreadyAccepted.is_self && actionStatus !== "CANCELLED" && (
        <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#78350f", fontSize: "1.3rem" }}>
            ⚠️ Already Accepted
          </h2>
          <p style={{ margin: "8px 0 0", color: "#78350f" }}>
            {alreadyAccepted.name
              ? `${alreadyAccepted.name} has already accepted this case.`
              : "Another responder has already accepted this case."}
          </p>
          {alreadyAccepted.accepted_at && (
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#92400e" }}>
              Accepted at: {new Date(alreadyAccepted.accepted_at).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      )}

      <div style={{ background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0 }}>📋 Case Details</h2>
        <p><strong>Case ID:</strong> {caseData.case_id}</p>
        <p><strong>Animal:</strong> {caseData.animal_type} — {caseData.animal_condition || "Unknown condition"}</p>
        <p><strong>Severity:</strong>{" "}
          <span style={{
            padding: "3px 10px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            background: caseData.severity === "CRITICAL" ? "#fee2e2" : caseData.severity === "HIGH" ? "#fef3c7" : "#dbeafe",
            color: caseData.severity === "CRITICAL" ? "#991b1b" : caseData.severity === "HIGH" ? "#92400e" : "#1e40af",
            fontWeight: "bold"
          }}>
            {caseData.severity}
          </span>
        </p>
        <p><strong>Description:</strong> {caseData.description}</p>
        <p><strong>Location:</strong> {[caseData.address, caseData.city, caseData.state].filter(Boolean).join(", ")}</p>
        {caseData.reporter_name && (
          <p><strong>Reporter:</strong> {caseData.reporter_name} ({caseData.reporter_phone})</p>
        )}
        {caseData.photo_url && (
          <div>
            <strong>Photo:</strong><br />
            <img src={caseData.photo_url} alt="Case" style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "8px", borderRadius: "6px" }} />
          </div>
        )}
      </div>

      <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
        <p style={{ margin: 0 }}>
          <strong>Recipient:</strong>{" "}
          {isGovernment ? "Government Helpline" : ngo.name || "NGO"}
        </p>
        <p style={{ margin: "8px 0 0" }}>
          <strong>Response Deadline:</strong> {new Date(alertData.response_deadline).toLocaleString("en-IN")}
        </p>
        {alertData.note && (
          <p style={{ margin: "8px 0 0" }}><strong>Note from Admin:</strong> {alertData.note}</p>
        )}
      </div>

      {error && alertData && (
        <div style={{ padding: "12px", background: "#fee", color: "#991b1b", borderRadius: "8px", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {!actionStatus && !alreadyAccepted && alertData.status === "SENT" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleAccept}
            disabled={submitting}
            style={{
              padding: "16px",
              fontSize: "16px",
              background: submitting ? "#86efac" : "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Processing..." : "✅ Accept Rescue Request"}
          </button>

          {!showRejectInput ? (
            <button
              onClick={handleReject}
              disabled={submitting}
              style={{
                padding: "16px",
                fontSize: "16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              ❌ Decline Request
            </button>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                Reason for declining (optional):
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="3"
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", marginBottom: "10px", fontFamily: "inherit" }}
                placeholder="e.g. Outside our service area, no vet available..."
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleReject}
                  disabled={submitting}
                  style={{ padding: "10px 20px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {submitting ? "Processing..." : "Confirm Decline"}
                </button>
                <button
                  onClick={() => {
                    setShowRejectInput(false);
                    setRejectReason("");
                  }}
                  disabled={submitting}
                  style={{ padding: "10px 20px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {actionStatus && (
        <div style={{ marginTop: "20px", padding: "12px", background: "#f3f4f6", borderRadius: "8px", textAlign: "center", color: "#6b7280" }}>
          No further action needed for this alert.
        </div>
      )}
    </div>
  );
};

export default AlertResponse;