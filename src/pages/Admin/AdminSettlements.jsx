import { useState, useEffect } from "react";
import {
  getPendingSettlements,
  markNgoAsSettled,
  getNgoSettlementDetail,
} from "../../services/api";

const AdminSettlements = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ ngos: [], summary: {} });
  const [toast, setToast] = useState(null);

  // Modals
  const [settleModal, setSettleModal] = useState(null); // NGO object
  const [utrRef, setUtrRef] = useState("");
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (token) fetchSettlements();
  }, [token]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettlements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPendingSettlements(token);
      setData(res.data || { ngos: [], summary: {} });
    } catch (err) {
      setError(err.message || "Failed to load settlements.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (ngo) => {
    setDetailLoading(true);
    setDetailModal({ ngo, data: null });
    try {
      const res = await getNgoSettlementDetail(token, ngo.ngo_id);
      setDetailModal({ ngo, data: res.data });
    } catch (err) {
      showToast(err.message || "Failed to load detail", "error");
      setDetailModal(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenSettleModal = (ngo) => {
    setSettleModal(ngo);
    setUtrRef("");
    setNote("");
  };

  const handleConfirmSettle = async () => {
    if (!settleModal) return;
    if (!utrRef.trim() || utrRef.trim().length < 3) {
      showToast("Please enter a valid UTR / Reference number", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await markNgoAsSettled(
        token,
        settleModal.ngo_id,
        utrRef.trim(),
        note.trim()
      );
      showToast(
        `✅ ₹${res.data.total_amount} settled to ${res.data.ngo_name}`,
        "success"
      );
      setSettleModal(null);
      setUtrRef("");
      setNote("");
      await fetchSettlements();
    } catch (err) {
      showToast(err.message || "Failed to settle", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "14px 20px",
            borderRadius: "8px",
            color: "#fff",
            background: toast.type === "error" ? "#dc2626" : "#16a34a",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: "400px",
          }}
        >
          {toast.type === "error" ? "⚠️ " : "✅ "} {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>💰 Settlement Management</h2>
        <p style={{ color: "#64748b", margin: "6px 0 0" }}>
          Pending payments to NGOs from case donations (90% of each donation)
        </p>
      </div>

      {/* Summary Cards */}
      {data.summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div style={{ background: "#eff6ff", padding: "16px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Total To Transfer</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#1e40af" }}>
              ₹{Number(data.summary.total_pending_amount || 0).toFixed(2)}
            </div>
          </div>
          <div style={{ background: "#fef3c7", padding: "16px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Pending NGOs</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#92400e" }}>
              {data.summary.total_pending_ngos || 0}
            </div>
          </div>
          <div style={{ background: "#f3e8ff", padding: "16px", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Donations</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#6b21a8" }}>
              {data.summary.total_pending_donations || 0}
            </div>
          </div>
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={fetchSettlements}
        style={{
          padding: "10px 18px",
          background: "#1e40af",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "16px",
          fontWeight: 600,
        }}
      >
        🔄 Refresh
      </button>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "#fee",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
          <div style={{ fontSize: "2rem" }}>🔄</div>
          Loading settlements...
        </div>
      ) : data.ngos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#64748b",
            background: "#f8fafc",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
          <h3 style={{ margin: "0 0 8px" }}>All caught up!</h3>
          <p style={{ margin: 0 }}>No pending settlements</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {data.ngos.map((ngo) => (
            <div
              key={ngo.ngo_id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <h3 style={{ margin: "0 0 6px", color: "#0f172a", fontSize: "1.15rem" }}>
                    {ngo.ngo_name}
                  </h3>
                  {ngo.ngo_email && (
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      ✉️ {ngo.ngo_email}
                    </div>
                  )}
                  {ngo.ngo_phone && (
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      📞 {ngo.ngo_phone}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right", minWidth: "200px" }}>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Pending Amount</div>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: "#16a34a",
                      lineHeight: 1.2,
                    }}
                  >
                    ₹{Number(ngo.total_ngo_amount).toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                    {ngo.donations_count} donation{ngo.donations_count > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 16px",
                  background: ngo.bank_onboarding_completed ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${ngo.bank_onboarding_completed ? "#86efac" : "#fecaca"}`,
                  borderRadius: "10px",
                }}
              >
                {ngo.bank_onboarding_completed ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                    <div>
                      <strong>Bank:</strong> {ngo.bank_name || "—"}
                    </div>
                    <div>
                      <strong>A/C Holder:</strong> {ngo.bank_account_holder || "—"}
                    </div>
                    <div>
                      <strong>A/C Number:</strong> ****{String(ngo.bank_account_number || "").slice(-4)}
                    </div>
                    <div>
                      <strong>IFSC:</strong> {ngo.bank_ifsc || "—"}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "0.9rem", color: "#991b1b", fontWeight: 600 }}>
                    ⚠️ NGO has not submitted bank details yet. Cannot settle.
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleOpenDetail(ngo)}
                  style={{
                    padding: "10px 18px",
                    background: "#64748b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  📋 View Details
                </button>
                <button
                  onClick={() => handleOpenSettleModal(ngo)}
                  disabled={!ngo.bank_onboarding_completed}
                  style={{
                    padding: "10px 18px",
                    background: ngo.bank_onboarding_completed ? "#16a34a" : "#cbd5e1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: ngo.bank_onboarding_completed ? "pointer" : "not-allowed",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  ✅ Mark as Settled
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SETTLE MODAL */}
      {settleModal && (
        <div
          onClick={() => !actionLoading && setSettleModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ margin: "0 0 6px" }}>✅ Mark as Settled</h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "0.9rem" }}>
              NGO: <strong>{settleModal.ngo_name}</strong>
            </p>

            <div
              style={{
                padding: "14px 16px",
                background: "#f0fdf4",
                borderRadius: "10px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#166534" }}>Amount to transfer:</span>
              <strong style={{ color: "#16a34a", fontSize: "1.3rem" }}>
                ₹{Number(settleModal.total_ngo_amount).toFixed(2)}
              </strong>
            </div>

            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
              UTR / Reference Number *
            </label>
            <input
              type="text"
              value={utrRef}
              onChange={(e) => setUtrRef(e.target.value.toUpperCase())}
              placeholder="e.g. SBIN20261004123456"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
                marginBottom: "16px",
                boxSizing: "border-box",
                fontFamily: "monospace",
              }}
              autoFocus
            />

            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              placeholder="Any note for NGO..."
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
                marginBottom: "8px",
              }}
            />

            <div
              style={{
                padding: "10px 14px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "8px",
                fontSize: "0.82rem",
                color: "#78350f",
                marginTop: "12px",
              }}
            >
              📧 An automated confirmation email will be sent to <strong>{settleModal.ngo_email}</strong>.
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSettleModal(null)}
                disabled={actionLoading}
                style={{
                  padding: "10px 18px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSettle}
                disabled={actionLoading || !utrRef.trim()}
                style={{
                  padding: "10px 20px",
                  background: actionLoading || !utrRef.trim() ? "#94a3b8" : "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: actionLoading || !utrRef.trim() ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {actionLoading ? "Processing..." : "✅ Confirm & Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModal && (
        <div
          onClick={() => setDetailModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>📋 {detailModal.ngo.ngo_name}</h3>
              <button
                onClick={() => setDetailModal(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {detailLoading || !detailModal.data ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                🔄 Loading...
              </div>
            ) : (
              <>
                {/* Pending */}
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={{ margin: "0 0 10px", color: "#dc2626" }}>
                    ⏳ Pending ({detailModal.data.pending.count})
                  </h4>
                  <div
                    style={{
                      background: "#fef2f2",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <strong>Total Pending:</strong>{" "}
                    <span style={{ color: "#dc2626", fontWeight: 700 }}>
                      ₹{Number(detailModal.data.pending.total_ngo_amount).toFixed(2)}
                    </span>
                  </div>
                  {detailModal.data.pending.donations.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: "10px 14px",
                        background: "#f9fafb",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>{d.case_id}</span>
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>
                        ₹{Number(d.ngo_amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Settled */}
                {detailModal.data.settled.count > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 10px", color: "#16a34a" }}>
                      ✅ Previously Settled ({detailModal.data.settled.count})
                    </h4>
                    <div
                      style={{
                        background: "#f0fdf4",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        fontSize: "0.9rem",
                      }}
                    >
                      <strong>Total Settled:</strong>{" "}
                      <span style={{ color: "#16a34a", fontWeight: 700 }}>
                        ₹{Number(detailModal.data.settled.total_ngo_amount).toFixed(2)}
                      </span>
                    </div>
                    {detailModal.data.settled.donations.map((d) => (
                      <div
                        key={d.id}
                        style={{
                          padding: "10px 14px",
                          background: "#f9fafb",
                          borderRadius: "8px",
                          marginBottom: "6px",
                          fontSize: "0.85rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{d.case_id}</span>
                          <span style={{ color: "#16a34a", fontWeight: 600 }}>
                            ₹{Number(d.ngo_amount).toFixed(2)}
                          </span>
                        </div>
                        {d.settlement_reference && (
                          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
                            UTR: {d.settlement_reference} • {new Date(d.settled_at).toLocaleDateString("en-IN")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettlements;