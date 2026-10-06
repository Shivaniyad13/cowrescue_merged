import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import {
  getAdminDonations,
  updateAdminDonationStatus,
  getAdminContacts,
  updateAdminContactStatus,
  getUploadUrl,
} from "../services/api";
import CowRescueAdmin from "./Admin/CowRescueAdmin";
import AdminSettlements from "./Admin/AdminSettlements";
import AdminNews from "./Admin/AdminNews";
import AdminGalleryImages from "./Admin/AdminGalleryImages";

const REJECTION_REASONS = [
  "Invalid payment screenshot",
  "Payment not received in bank account",
  "Transaction ID mismatch / Invalid UTR",
  "Duplicate payment submission",
  "Incorrect donation amount",
  "Other",
];

const AdminDashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState("donations");
  const [donationCategory, setDonationCategory] = useState("general");
  const [subTab, setSubTab] = useState("PENDING");

  const [donations, setDonations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("ALL");

  const [screenshotModal, setScreenshotModal] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [detailsModal, setDetailsModal] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser") || "Admin";

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setError("");
    // Tabs that fetch their own data
    if (
      activeMainTab === "cowRescue" ||
      activeMainTab === "settlements" ||
      activeMainTab === "news" ||
      activeMainTab === "gallery"
    ) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [token, activeMainTab]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeMainTab === "donations") {
        const res = await getAdminDonations(token);
        setDonations(res.donations || []);
      } else if (activeMainTab === "contacts") {
        const res = await getAdminContacts(token);
        setContacts(res.contacts || []);
      }
    } catch (err) {
      if (
        err.message.toLowerCase().includes("token") ||
        err.message.includes("401") ||
        err.message.toLowerCase().includes("unauthorized")
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
      } else {
        setError(err.message || "Failed to load administrative data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmApprove = async () => {
    if (!approveModal) return;
    setActionLoading(true);
    try {
      await updateAdminDonationStatus(token, approveModal.id, {
        paymentStatus: "PAID",
        verificationStatus: "VERIFIED",
      });
      showToast(
        `Donation #${approveModal.id} from ${approveModal.donor_name || "Donor"} verified successfully!`,
        "success"
      );
      setApproveModal(null);
      if (detailsModal?.id === approveModal.id) setDetailsModal(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || "Failed to verify donation.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModal) return;
    setActionLoading(true);
    const finalReason = selectedReason === "Other" ? customReason : selectedReason;
    try {
      await updateAdminDonationStatus(token, rejectModal.id, {
        paymentStatus: "FAILED",
        verificationStatus: "REJECTED",
        rejectionReason: finalReason || "Rejected by admin",
      });
      showToast(`Donation #${rejectModal.id} marked as rejected.`, "success");
      setRejectModal(null);
      setSelectedReason(REJECTION_REASONS[0]);
      setCustomReason("");
      if (detailsModal?.id === rejectModal.id) setDetailsModal(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || "Failed to reject donation.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleContactStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await updateAdminContactStatus(token, id, status);
      showToast(`Contact submission updated to ${status}.`, "success");
      await fetchData();
    } catch (err) {
      showToast(err.message || "Failed to update contact status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  // ─── Split Donations ───
  const generalDonations = donations.filter((d) => !d.case_id);
  const caseDonations = donations.filter((d) => !!d.case_id);

  const activeDonations =
    donationCategory === "general" ? generalDonations : caseDonations;

  const totalCount = activeDonations.length;
  const pendingCount = activeDonations.filter(
    (d) => (d.verification_status || d.payment_status) === "PENDING"
  ).length;
  const verifiedCount = activeDonations.filter(
    (d) => d.verification_status === "VERIFIED"
  ).length;
  const rejectedCount = activeDonations.filter(
    (d) => d.verification_status === "REJECTED"
  ).length;
  const verifiedTotalAmount = activeDonations
    .filter((d) => d.verification_status === "VERIFIED")
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const pendingSettlementAmount = caseDonations
    .filter((d) => d.verification_status === "VERIFIED" && !d.settled)
    .reduce((sum, d) => sum + Number(d.ngo_amount || 0), 0);

  const filteredDonations = activeDonations.filter((d) => {
    const vStatus = d.verification_status || d.payment_status || "PENDING";

    if (subTab === "PENDING" && vStatus !== "PENDING") return false;
    if (subTab === "VERIFIED" && vStatus !== "VERIFIED") return false;
    if (subTab === "REJECTED" && vStatus !== "REJECTED") return false;

    if (paymentMethodFilter !== "ALL") {
      if (
        (d.payment_method || "UPI").toUpperCase() !==
        paymentMethodFilter.toUpperCase()
      ) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (d.donor_name || d.name || "").toLowerCase();
      const phone = (d.phone || "").toLowerCase();
      const email = (d.email || "").toLowerCase();
      const caseId = (d.case_id || "").toLowerCase();
      const utr = (
        d.transaction_id ||
        d.gateway_payment_id ||
        d.gateway_order_id ||
        d.razorpay_payment_id ||
        ""
      ).toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        caseId.includes(q) ||
        utr.includes(q)
      );
    }

    return true;
  });

  const isCaseView = donationCategory === "case";

  return (
    <div className={styles.adminContainer}>
      {/* Toast */}
      {toast && (
        <div className={styles.toastContainer}>
          <div
            className={`${styles.toast} ${
              toast.type === "error" ? styles.toastError : styles.toastSuccess
            }`}
          >
            <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.adminHeader}>
        <div>
          <h1 className={styles.adminTitle}>
            <span>🛡️</span> Admin Verification & Management
          </h1>
          <p className={styles.adminSub}>
            Logged in as <strong>{adminUser}</strong>
          </p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span>🚪</span> Sign Out
        </button>
      </header>

      {/* Summary Cards — only for donations tab */}
      {activeMainTab === "donations" && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>
                {isCaseView ? "Case Donations" : "General Donations"}
              </span>
              <span className={styles.statIcon}>📦</span>
            </div>
            <div className={styles.statNumber}>{totalCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Pending Verification</span>
              <span className={styles.statIcon}>⏳</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberPending}`}>
              {pendingCount}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Verified</span>
              <span className={styles.statIcon}>✅</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberVerified}`}>
              {verifiedCount}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Rejected</span>
              <span className={styles.statIcon}>❌</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberRejected}`}>
              {rejectedCount}
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>
                {isCaseView ? "To Transfer to NGOs" : "Total Verified Amount"}
              </span>
              <span className={styles.statIcon}>💰</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberVerified}`}>
              ₹
              {isCaseView
                ? pendingSettlementAmount.toLocaleString("en-IN")
                : verifiedTotalAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${
            activeMainTab === "donations" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveMainTab("donations")}
        >
          🎁 Donations ({donations.length})
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeMainTab === "contacts" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveMainTab("contacts")}
        >
          ✉️ Contact Submissions ({contacts.length})
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeMainTab === "cowRescue" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveMainTab("cowRescue")}
        >
          🐄 Cow Rescue Cases
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeMainTab === "settlements" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveMainTab("settlements")}
        >
          💰 Settlements
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeMainTab === "news" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveMainTab("news")}
        >
          📰 News
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeMainTab === "gallery" ? styles.tabBtnActive : ""
          }`}
          onClick={() => setActiveMainTab("gallery")}
        >
          🖼️ Gallery
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "14px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #fecaca",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={fetchData}
            style={{
              padding: "6px 12px",
              background: "#991b1b",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ═══════════ TAB CONTENT ═══════════ */}

      {activeMainTab === "settlements" ? (
        <AdminSettlements token={token} />
      ) : activeMainTab === "news" ? (
        <AdminNews token={token} />
      ) : activeMainTab === "gallery" ? (
        <AdminGalleryImages token={token} />
      ) : activeMainTab === "cowRescue" ? (
        <CowRescueAdmin token={token} />
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔄</div>
          Fetching administrative records...
        </div>
      ) : activeMainTab === "donations" ? (
        /* ─── DONATIONS TAB ─── */
        <div>
          {/* Category Sub-Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "18px",
              padding: "6px",
              background: "#f1f5f9",
              borderRadius: "12px",
              maxWidth: "520px",
            }}
          >
            <button
              onClick={() => {
                setDonationCategory("general");
                setSubTab("PENDING");
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                background:
                  donationCategory === "general" ? "#ffffff" : "transparent",
                border:
                  donationCategory === "general"
                    ? "2px solid #16a34a"
                    : "2px solid transparent",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 700,
                color:
                  donationCategory === "general" ? "#166534" : "#64748b",
                boxShadow:
                  donationCategory === "general"
                    ? "0 2px 8px rgba(22, 163, 74, 0.15)"
                    : "none",
                transition: "all 0.2s",
              }}
            >
              🎁 General ({generalDonations.length})
            </button>
            <button
              onClick={() => {
                setDonationCategory("case");
                setSubTab("PENDING");
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                background:
                  donationCategory === "case" ? "#ffffff" : "transparent",
                border:
                  donationCategory === "case"
                    ? "2px solid #f59e0b"
                    : "2px solid transparent",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: donationCategory === "case" ? "#92400e" : "#64748b",
                boxShadow:
                  donationCategory === "case"
                    ? "0 2px 8px rgba(245, 158, 11, 0.15)"
                    : "none",
                transition: "all 0.2s",
              }}
            >
              🐄 Case Donations ({caseDonations.length})
            </button>
          </div>

          {/* Case View Info Banner */}
          {isCaseView && (
            <div
              style={{
                padding: "14px 18px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "10px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>💡</span>
              <div style={{ fontSize: "0.9rem", color: "#78350f" }}>
                <strong>Case Donations:</strong> Ye donations track page ke
                "Support this Rescue" button se aate hain. Har donation me{" "}
                <strong>10% platform fee</strong> aur <strong>90% NGO amount</strong>{" "}
                auto-calculate hota hai. NGO ko transfer karne ke liye{" "}
                <strong>Settlement tab</strong> use karo.
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.subTabs}>
              <button
                className={`${styles.subTabBtn} ${
                  subTab === "PENDING" ? styles.subTabBtnActive : ""
                }`}
                onClick={() => setSubTab("PENDING")}
              >
                ⏳ Pending ({pendingCount})
              </button>
              <button
                className={`${styles.subTabBtn} ${
                  subTab === "VERIFIED" ? styles.subTabBtnActive : ""
                }`}
                onClick={() => setSubTab("VERIFIED")}
              >
                ✅ Verified ({verifiedCount})
              </button>
              <button
                className={`${styles.subTabBtn} ${
                  subTab === "REJECTED" ? styles.subTabBtnActive : ""
                }`}
                onClick={() => setSubTab("REJECTED")}
              >
                ❌ Rejected ({rejectedCount})
              </button>
              <button
                className={`${styles.subTabBtn} ${
                  subTab === "ALL" ? styles.subTabBtnActive : ""
                }`}
                onClick={() => setSubTab("ALL")}
              >
                📋 All ({totalCount})
              </button>
            </div>

            <div className={styles.filterControls}>
              <input
                type="text"
                placeholder={isCaseView ? "Search case ID, donor, UTR..." : "Search name, phone, UTR..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className={styles.selectInput}
              >
                <option value="ALL">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="CASHFREE">Cashfree</option>
                <option value="ONLINE">Online Gateway</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              {isCaseView ? (
                <>
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th>Platform Fee</th>
                      <th>NGO Amount</th>
                      <th>Status</th>
                      <th>Settled</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                          No case donations found.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((d) => {
                        const status = d.verification_status || d.payment_status || "PENDING";
                        return (
                          <tr key={d.id}>
                            <td>
                              <strong style={{ color: "#92400e", fontSize: "0.85rem" }}>
                                {d.case_id || "—"}
                              </strong>
                            </td>
                            <td>
                              <strong>{d.donor_name || "Anonymous"}</strong>
                              {d.donor_phone && (
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{d.donor_phone}</div>
                              )}
                            </td>
                            <td>
                              <strong style={{ color: "#166534", fontSize: "1rem" }}>
                                ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                              </strong>
                            </td>
                            <td>
                              <span style={{ color: "#dc2626", fontSize: "0.9rem" }}>
                                ₹{Number(d.platform_fee || 0).toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.9rem" }}>
                                ₹{Number(d.ngo_amount || 0).toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`${styles.badge} ${
                                  status === "VERIFIED"
                                    ? styles.badgeVerified
                                    : status === "REJECTED"
                                    ? styles.badgeRejected
                                    : styles.badgePending
                                }`}
                              >
                                {status === "VERIFIED" ? "✓ VERIFIED" : status === "REJECTED" ? "✕ REJECTED" : "⏳ PENDING"}
                              </span>
                            </td>
                            <td>
                              {d.settled ? (
                                <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.85rem" }}>
                                  ✅ Settled
                                </span>
                              ) : (
                                <span style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.85rem" }}>
                                  ⏳ Pending
                                </span>
                              )}
                            </td>
                            <td>
                              {d.created_at
                                ? new Date(d.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                            <td>
                              <div className={styles.actionGroup}>
                                <button
                                  onClick={() => setDetailsModal(d)}
                                  className={`${styles.actionBtn} ${styles.btnDetails}`}
                                >
                                  🔍 Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </>
              ) : (
                <>
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Contact & Location</th>
                      <th>Purpose</th>
                      <th>Amount</th>
                      <th>Method & UTR</th>
                      <th>Status</th>
                      <th>Screenshot</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                          No general donations matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((d) => {
                        const status = d.verification_status || d.payment_status || "PENDING";
                        return (
                          <tr key={d.id}>
                            <td>
                              <strong>{d.donor_name || d.name || "Anonymous Donor"}</strong>
                            </td>
                            <td>
                              <div>{d.phone || "—"}</div>
                              {(d.city || d.state) && (
                                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                  {[d.city, d.state].filter(Boolean).join(", ")}
                                </div>
                              )}
                            </td>
                            <td>{d.purpose || "General Welfare"}</td>
                            <td>
                              <strong style={{ color: "#166534", fontSize: "1rem" }}>
                                ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                              </strong>
                            </td>
                            <td>
                              <div><strong>{d.payment_gateway || d.payment_method || "UPI"}</strong></div>
                              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                {d.gateway_payment_id || d.gateway_order_id || d.transaction_id || d.razorpay_payment_id || "—"}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`${styles.badge} ${
                                  status === "VERIFIED"
                                    ? styles.badgeVerified
                                    : status === "REJECTED"
                                    ? styles.badgeRejected
                                    : styles.badgePending
                                }`}
                              >
                                {status === "VERIFIED" ? "✓ VERIFIED" : status === "REJECTED" ? "✕ REJECTED" : "⏳ PENDING"}
                              </span>
                            </td>
                            <td>
                              {d.payment_screenshot_url ? (
                                <button
                                  className={`${styles.actionBtn} ${styles.btnScreenshot}`}
                                  onClick={() => setScreenshotModal(d)}
                                >
                                  🖼️ View Screenshot
                                </button>
                              ) : (
                                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>None</span>
                              )}
                            </td>
                            <td>
                              {d.created_at
                                ? new Date(d.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                            <td>
                              <div className={styles.actionGroup}>
                                <button
                                  onClick={() => setDetailsModal(d)}
                                  className={`${styles.actionBtn} ${styles.btnDetails}`}
                                >
                                  🔍 Details
                                </button>
                                {status !== "VERIFIED" && (
                                  <button
                                    onClick={() => setApproveModal(d)}
                                    className={`${styles.actionBtn} ${styles.btnVerify}`}
                                    disabled={actionLoading}
                                  >
                                    ✅ Approve
                                  </button>
                                )}
                                {status !== "REJECTED" && (
                                  <button
                                    onClick={() => setRejectModal(d)}
                                    className={`${styles.actionBtn} ${styles.btnReject}`}
                                    disabled={actionLoading}
                                  >
                                    ❌ Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </>
              )}
            </table>
          </div>

          {/* Mobile View (General only) */}
          {!isCaseView && (
            <div className={styles.mobileCards}>
              {filteredDonations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No donation records found.
                </div>
              ) : (
                filteredDonations.map((d) => {
                  const status = d.verification_status || d.payment_status || "PENDING";
                  return (
                    <div key={d.id} className={styles.mobileCard}>
                      <div className={styles.mobileCardHeader}>
                        <div>
                          <div className={styles.mobileDonorName}>
                            {d.donor_name || d.name || "Anonymous Donor"}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {[d.city, d.state].filter(Boolean).join(", ")}
                          </div>
                        </div>
                        <div className={styles.mobileAmount}>
                          ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className={styles.mobileCardBody}>
                        <div><strong>Purpose:</strong> {d.purpose || "General Welfare"}</div>
                        <div><strong>Phone:</strong> {d.phone || "—"}</div>
                        <div><strong>Status:</strong> {status}</div>
                      </div>
                      <div className={styles.mobileCardFooter}>
                        <button
                          onClick={() => setDetailsModal(d)}
                          className={`${styles.actionBtn} ${styles.btnDetails}`}
                        >
                          🔍 Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : activeMainTab === "contacts" ? (
        /* ─── CONTACTS TAB ─── */
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{c.email}</div>
                    </td>
                    <td>{c.subject || "General Inquiry"}</td>
                    <td style={{ maxWidth: "320px" }}>{c.message}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          c.status === "RESOLVED"
                            ? styles.badgeVerified
                            : c.status === "READ"
                            ? styles.badgeRead
                            : styles.badgeNew
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
                    <td>
                      <div className={styles.actionGroup}>
                        {c.status === "NEW" && (
                          <button
                            onClick={() => handleContactStatus(c.id, "READ")}
                            className={`${styles.actionBtn} ${styles.btnRead}`}
                            disabled={actionLoading}
                          >
                            Mark Read
                          </button>
                        )}
                        {c.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleContactStatus(c.id, "RESOLVED")}
                            className={`${styles.actionBtn} ${styles.btnResolve}`}
                            disabled={actionLoading}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* ═══════════ MODALS ═══════════ */}

      {/* Screenshot Lightbox */}
      {screenshotModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setScreenshotModal(null);
            setIsZoomed(false);
          }}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => {
                setScreenshotModal(null);
                setIsZoomed(false);
              }}
            >
              ✕
            </button>
            <h3 className={styles.modalTitle}>
              <span>🖼️</span> Payment Proof Screenshot
            </h3>
            <div style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "12px" }}>
              <strong>Donor:</strong> {screenshotModal.donor_name || screenshotModal.name || "Donor"} |{" "}
              <strong>Amount:</strong> ₹{Number(screenshotModal.amount || 0).toLocaleString("en-IN")} |{" "}
              <strong>UTR:</strong> {screenshotModal.transaction_id || "N/A"}
            </div>
            {screenshotModal.payment_screenshot_url ? (
              <div className={styles.screenshotContainer}>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "8px" }}>
                  (Click image to toggle zoom)
                </p>
                <img
                  src={getUploadUrl(screenshotModal.payment_screenshot_url)}
                  alt="Uploaded Payment Screenshot"
                  className={`${styles.modalImg} ${isZoomed ? styles.modalImgZoomed : ""}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
            ) : (
              <div className={styles.noScreenshotBox}>
                No payment screenshot uploaded for this donation.
              </div>
            )}
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => {
                  setScreenshotModal(null);
                  setIsZoomed(false);
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && (
        <div className={styles.modalOverlay} onClick={() => setDetailsModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDetailsModal(null)}>
              ✕
            </button>
            <h3 className={styles.modalTitle}>
              <span>📋</span> Donation Record Details #{detailsModal.id}
            </h3>

            {detailsModal.case_id && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#78350f" }}>
                  <strong>🐄 Case Donation</strong>
                </div>
                <div style={{ fontSize: "0.9rem", color: "#92400e", marginTop: "4px" }}>
                  <strong>Case ID:</strong> {detailsModal.case_id}
                </div>
              </div>
            )}

            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Donor Information</div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Full Name</div>
                  <div className={styles.detailValue}>
                    {detailsModal.donor_name || detailsModal.name || "Anonymous"}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Phone</div>
                  <div className={styles.detailValue}>
                    {detailsModal.donor_phone || detailsModal.phone || "—"}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Email</div>
                  <div className={styles.detailValue}>
                    {detailsModal.donor_email || detailsModal.email || "—"}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Location</div>
                  <div className={styles.detailValue}>
                    {[detailsModal.city, detailsModal.state].filter(Boolean).join(", ") || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Payment Info</div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Amount</div>
                  <div className={styles.detailValue} style={{ color: "#166534", fontSize: "1.1rem" }}>
                    ₹{Number(detailsModal.amount || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                {detailsModal.case_id && (
                  <>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Platform Fee (10%)</div>
                      <div className={styles.detailValue} style={{ color: "#dc2626" }}>
                        ₹{Number(detailsModal.platform_fee || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>NGO Amount (90%)</div>
                      <div className={styles.detailValue} style={{ color: "#16a34a", fontWeight: 700 }}>
                        ₹{Number(detailsModal.ngo_amount || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Settled</div>
                      <div className={styles.detailValue}>
                        {detailsModal.settled ? "✅ Yes" : "⏳ Pending"}
                      </div>
                    </div>
                  </>
                )}
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Payment Method</div>
                  <div className={styles.detailValue}>
                    {detailsModal.payment_gateway || detailsModal.payment_method || "UPI"}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Transaction Ref</div>
                  <div className={styles.detailValue}>
                    {detailsModal.gateway_payment_id ||
                      detailsModal.gateway_order_id ||
                      detailsModal.transaction_id ||
                      "—"}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Verification Status</div>
                  <div className={styles.detailValue}>
                    {detailsModal.verification_status || "PENDING"}
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Submitted</div>
                  <div className={styles.detailValue}>
                    {detailsModal.created_at
                      ? new Date(detailsModal.created_at).toLocaleString("en-IN")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setDetailsModal(null)}>
                Close
              </button>
              {!detailsModal.case_id &&
                (detailsModal.verification_status || detailsModal.payment_status) !== "VERIFIED" && (
                  <button
                    className={`${styles.actionBtn} ${styles.btnVerify}`}
                    onClick={() => {
                      setApproveModal(detailsModal);
                      setDetailsModal(null);
                    }}
                  >
                    ✅ Verify
                  </button>
                )}
              {!detailsModal.case_id &&
                (detailsModal.verification_status || detailsModal.payment_status) !== "REJECTED" && (
                  <button
                    className={`${styles.actionBtn} ${styles.btnReject}`}
                    onClick={() => {
                      setRejectModal(detailsModal);
                      setDetailsModal(null);
                    }}
                  >
                    ❌ Reject
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div className={styles.modalOverlay} onClick={() => !actionLoading && setApproveModal(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => !actionLoading && setApproveModal(null)}
              disabled={actionLoading}
            >
              ✕
            </button>
            <h3 className={styles.modalTitle} style={{ color: "#166534" }}>
              <span>✅</span> Confirm Verification
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: "1.5" }}>
              Verify donation of{" "}
              <strong>₹{Number(approveModal.amount || 0).toLocaleString("en-IN")}</strong> from{" "}
              <strong>{approveModal.donor_name || approveModal.name || "Donor"}</strong>?
            </p>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setApproveModal(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className={`${styles.actionBtn} ${styles.btnVerify}`}
                onClick={handleConfirmApprove}
                disabled={actionLoading}
                style={{ padding: "10px 20px", fontSize: "0.9rem" }}
              >
                {actionLoading ? "Processing..." : "Confirm & Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className={styles.modalOverlay} onClick={() => !actionLoading && setRejectModal(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => !actionLoading && setRejectModal(null)}
              disabled={actionLoading}
            >
              ✕
            </button>
            <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
              <span>❌</span> Reject Donation
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#334155", marginBottom: "12px" }}>
              Rejecting donation of{" "}
              <strong>₹{Number(rejectModal.amount || 0).toLocaleString("en-IN")}</strong> from{" "}
              <strong>{rejectModal.donor_name || rejectModal.name || "Donor"}</strong>.
            </p>
            <label style={{ display: "block", fontWeight: "600", fontSize: "0.875rem", color: "#334155", marginBottom: "4px" }}>
              Reason:
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className={styles.reasonSelect}
            >
              {REJECTION_REASONS.map((reason, idx) => (
                <option key={idx} value={reason}>{reason}</option>
              ))}
            </select>
            {selectedReason === "Other" && (
              <textarea
                placeholder="Enter specific rejection reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className={styles.customReasonInput}
              />
            )}
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setRejectModal(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className={`${styles.actionBtn} ${styles.btnReject}`}
                onClick={handleConfirmReject}
                disabled={actionLoading}
                style={{ padding: "10px 20px", fontSize: "0.9rem" }}
              >
                {actionLoading ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;