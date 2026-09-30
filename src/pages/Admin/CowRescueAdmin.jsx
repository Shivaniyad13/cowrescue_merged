import React, { useState, useEffect } from "react";
import {
  getAdminCases,
  adminUpdateCaseStatus,
  adminUpdateGovernmentRoute,
  adminSendAlert,
  getAdminNGOs,
  getNearbyNGOs,
  getAdminStats,
} from "../../services/api";

const STATUS_OPTIONS = [
  "REPORTED",
  "NGO_ASSIGNED",
  "IN_PROGRESS",
  "RESCUED",
  "TREATED",
  "SHELTERED",
  "COMPLETED",
  "CANCELLED",
];

const CowRescueAdmin = ({ token }) => {
  const [cases, setCases] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCase, setSelectedCase] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showGovModal, setShowGovModal] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [govStatus, setGovStatus] = useState("");
  const [govNote, setGovNote] = useState("");
  const [selectedNgoId, setSelectedNgoId] = useState("");
  const [alertPriority, setAlertPriority] = useState(1);
  const [alertChannel, setAlertChannel] = useState("EMAIL");
  const [alertNote, setAlertNote] = useState("");
  const [alertDeadline, setAlertDeadline] = useState(24);
  const [availableNgos, setAvailableNgos] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (token) fetchAll();
  }, [token, statusFilter]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [casesRes, ngosRes, statsRes] = await Promise.all([
        getAdminCases(token, statusFilter),
        getAdminNGOs(token).catch(() => ({ data: [] })),
        getAdminStats(token).catch(() => ({ data: null })),
      ]);
      setCases(casesRes.data || []);
      setNgos(ngosRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      setError(err.message || "Failed to load Cow Rescue data.");
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (c) => {
    setSelectedCase(c);
    setNewStatus(c.status || "REPORTED");
    setStatusNote("");
    setShowStatusModal(true);
  };

  const openAlertModal = async (c) => {
    setSelectedCase(c);
    setSelectedNgoId("");
    setAlertPriority(1);
    setAlertChannel("EMAIL");
    setAlertNote("");
    setAlertDeadline(24);
    setAvailableNgos([]);
    setShowAlertModal(true);

    try {
      const res = await getNearbyNGOs(c.case_id);
      setAvailableNgos(res.data || []);
    } catch (err) {
      setAvailableNgos(ngos);
    }
  };

  const openGovModal = (c) => {
    setSelectedCase(c);
    setGovStatus(c.government_route_status || "NOT_CHECKED");
    setGovNote("");
    setShowGovModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedCase) return;
    setActionLoading(true);
    try {
      await adminUpdateCaseStatus(token, selectedCase.case_id, newStatus, statusNote);
      showToast(`Status updated to ${newStatus}`);
      setShowStatusModal(false);
      await fetchAll();
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendAlert = async () => {
    if (!selectedCase) return;
    if (!selectedNgoId) {
      showToast("Please select an NGO", "error");
      return;
    }
    setActionLoading(true);
    try {
      await adminSendAlert(token, selectedCase.case_id, {
        ngo_id: selectedNgoId,
        priority: parseInt(alertPriority),
        channel: alertChannel,
        note: alertNote,
        response_deadline_hours: parseInt(alertDeadline),
      });
      showToast("Alert sent successfully!");
      setShowAlertModal(false);
      await fetchAll();
    } catch (err) {
      showToast(err.message || "Failed to send alert", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateGov = async () => {
    if (!selectedCase) return;
    setActionLoading(true);
    try {
      await adminUpdateGovernmentRoute(token, selectedCase.case_id, govStatus, govNote);
      showToast(`Government route updated to ${govStatus}`);
      setShowGovModal(false);
      await fetchAll();
    } catch (err) {
      showToast(err.message || "Failed to update government route", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.case_id || "").toLowerCase().includes(q) ||
      (c.reporter_name || "").toLowerCase().includes(q) ||
      (c.reporter_phone || "").toLowerCase().includes(q) ||
      (c.city || "").toLowerCase().includes(q)
    );
  });

  const statusColor = (status) => {
    if (status === "COMPLETED") return "#16a34a";
    if (status === "CANCELLED") return "#dc2626";
    if (status === "REPORTED") return "#f59e0b";
    return "#2563eb";
  };

  return (
    <div style={{ padding: "20px" }}>
      {toast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 9999,
          padding: "14px 20px", borderRadius: "8px", color: "#fff",
          background: toast.type === "error" ? "#dc2626" : "#16a34a",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          {toast.type === "error" ? "⚠️ " : "✅ "} {toast.message}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>🐄 Cow Rescue Management</h2>
        <p style={{ color: "#64748b", margin: "6px 0 0" }}>Manage rescue cases, assign NGOs, and track progress</p>
      </div>

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Cases</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#1e40af" }}>{stats.totalCases ?? cases.length}</div>
          </div>
          <div style={{ background: "#fef3c7", padding: "14px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Pending</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#92400e" }}>{stats.pendingCases ?? "—"}</div>
          </div>
          <div style={{ background: "#dcfce7", padding: "14px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Completed</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#166534" }}>{stats.completedCases ?? "—"}</div>
          </div>
          <div style={{ background: "#f3e8ff", padding: "14px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Active NGOs</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#6b21a8" }}>{stats.totalNGOs ?? ngos.length}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search case ID, reporter, phone, city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: "220px", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={fetchAll}
          style={{ padding: "10px 18px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px", background: "#fee", color: "#991b1b", borderRadius: "8px", marginBottom: "16px" }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
          <div style={{ fontSize: "2rem" }}>🔄</div>
          Loading cases...
        </div>
      ) : filteredCases.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b", background: "#f8fafc", borderRadius: "10px" }}>
          No cases found.
        </div>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead style={{ background: "#f1f5f9" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>Case ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Reporter</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Location</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Severity</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.case_id} style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px" }}>
                    <strong>{c.case_id}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : ""}
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {c.reporter_name || "—"}
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.reporter_phone || ""}</div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {[c.city, c.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", background: "#fef3c7", color: "#92400e" }}>
                      {c.severity || "MEDIUM"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", color: "#fff", background: statusColor(c.status) }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button onClick={() => openStatusModal(c)} style={{ padding: "5px 10px", fontSize: "0.75rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                        Status
                      </button>
                      <button onClick={() => openAlertModal(c)} style={{ padding: "5px 10px", fontSize: "0.75rem", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                        Alert NGO
                      </button>
                      <button onClick={() => openGovModal(c)} style={{ padding: "5px 10px", fontSize: "0.75rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                        Gov Route
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showStatusModal && selectedCase && (
        <div onClick={() => setShowStatusModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "90%", maxWidth: "500px" }}>
            <h3>Update Status — {selectedCase.case_id}</h3>
            <label style={{ display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: 600 }}>New Status</label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label style={{ display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: 600 }}>Note (optional)</label>
            <textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows="3" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowStatusModal(false)} disabled={actionLoading} style={{ padding: "8px 16px", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleUpdateStatus} disabled={actionLoading} style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                {actionLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlertModal && selectedCase && (
        <div onClick={() => setShowAlertModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "90%", maxWidth: "520px" }}>
            <h3>Send Alert to NGO — {selectedCase.case_id}</h3>
            <label style={{ display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: 600 }}>Select NGO</label>
            <select value={selectedNgoId} onChange={(e) => setSelectedNgoId(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
              <option value="">-- Select NGO --</option>
              {availableNgos.map((n) => (
                <option key={n.id} value={n.id}>{n.name} — {[n.city, n.state].filter(Boolean).join(", ")}</option>
              ))}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "0.85rem" }}>Priority</label>
                <select value={alertPriority} onChange={(e) => setAlertPriority(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
                  <option value="1">1 — Normal</option>
                  <option value="2">2 — High</option>
                  <option value="3">3 — Critical</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "0.85rem" }}>Channel</label>
                <select value={alertChannel} onChange={(e) => setAlertChannel(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
                  <option value="EMAIL">EMAIL</option>
                  <option value="SMS">SMS</option>
                  <option value="WHATSAPP">WHATSAPP</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "0.85rem" }}>Deadline (hrs)</label>
                <input type="number" value={alertDeadline} onChange={(e) => setAlertDeadline(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
              </div>
            </div>
            <label style={{ display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: 600 }}>Note</label>
            <textarea value={alertNote} onChange={(e) => setAlertNote(e.target.value)} rows="3" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowAlertModal(false)} disabled={actionLoading} style={{ padding: "8px 16px", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSendAlert} disabled={actionLoading} style={{ padding: "8px 16px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                {actionLoading ? "Sending..." : "Send Alert"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGovModal && selectedCase && (
        <div onClick={() => setShowGovModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "90%", maxWidth: "500px" }}>
            <h3>Government Route — {selectedCase.case_id}</h3>
            <label style={{ display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: 600 }}>Status</label>
            <select value={govStatus} onChange={(e) => setGovStatus(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
              <option value="NOT_CHECKED">NOT_CHECKED</option>
              <option value="USER_CONTACTED">USER_CONTACTED</option>
              <option value="NO_RESPONSE">NO_RESPONSE</option>
              <option value="RESPONDED">RESPONDED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
            <label style={{ display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: 600 }}>Note</label>
            <textarea value={govNote} onChange={(e) => setGovNote(e.target.value)} rows="3" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowGovModal(false)} disabled={actionLoading} style={{ padding: "8px 16px", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleUpdateGov} disabled={actionLoading} style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                {actionLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CowRescueAdmin;