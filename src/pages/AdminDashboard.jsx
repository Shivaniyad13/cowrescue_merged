import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import {
  getAdminDonations,
  updateAdminDonationStatus,
  getAdminContacts,
  updateAdminContactStatus,
  getUploadUrl,
  getAdminNGOs,
  API_BASE_URL,
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

const NgoDetails = ({ organization }) => {
  const hasCoordinates =
    organization.latitude !== null &&
    organization.latitude !== undefined &&
    organization.longitude !== null &&
    organization.longitude !== undefined &&
    String(organization.latitude).trim() !== "" &&
    String(organization.longitude).trim() !== "";
  const coordinates = hasCoordinates
    ? `${organization.latitude}, ${organization.longitude}`
    : null;
  const mapUrl = coordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(coordinates)}`
    : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
      <div>
        <strong>Organization type:</strong> {organization.organization_type || "—"}
        <br />
        <strong>Registration number:</strong> {organization.registration_number || "—"}
        <br />
        <strong>Contact person:</strong> {organization.contact_person || "—"}
        <br />
        <strong>Email:</strong> {organization.email || "—"}
        <br />
        <strong>Phone:</strong> {organization.phone || "—"}
      </div>
      <div>
        <strong>Full address:</strong> {[organization.address, organization.city, organization.district, organization.state, organization.pincode].filter(Boolean).join(", ") || "—"}
        <br />
        <strong>Capacity:</strong> {organization.capacity ?? "—"}
        <br />
        <strong>Ambulance:</strong> {organization.has_ambulance ? "Yes" : "No"}
        <br />
        <strong>Veterinary support:</strong> {organization.has_vet ? "Yes" : "No"}
        <br />
        <strong>Bank account:</strong> {organization.bank_account_number || "—"}
        <br />
        <strong>IFSC:</strong> {organization.bank_ifsc || "—"}
      </div>
      <div>
        <strong>Exact coordinates:</strong> {coordinates || "Not provided"}
        {mapUrl && (
          <>
            <br />
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">Open exact location in Google Maps</a>
          </>
        )}
        <div style={{ marginTop: "8px" }}>
          <strong>Registration certificate:</strong>{" "}
          {organization.registration_certificate_url ? (
            <a href={organization.registration_certificate_url} target="_blank" rel="noopener noreferrer">
              {organization.registration_certificate_name || "View document"}
            </a>
          ) : "Not provided"}
        </div>
        <div style={{ marginTop: "6px" }}>
          <strong>Identity proof:</strong>{" "}
          {organization.identity_proof_url ? (
            <a href={organization.identity_proof_url} target="_blank" rel="noopener noreferrer">
              {organization.identity_proof_name || "View document"}
            </a>
          ) : "Not provided"}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState("donations");
  const [donationCategory, setDonationCategory] = useState("general");
  const [subTab, setSubTab] = useState("PENDING");

  const [donations, setDonations] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  // NGO Requests States
  const [ngoRequests, setNgoRequests] = useState([]);
  const [registeredNgos, setRegisteredNgos] = useState([]);
  const [expandedNgoId, setExpandedNgoId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [approvingNgo, setApprovingNgo] = useState(false);

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
      } else if (activeMainTab === "ngoRequests") {
        const [res, registeredRes] = await Promise.all([
          fetch(`${API_BASE_URL}/ngo/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          getAdminNGOs(token, 100),
        ]);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch pending Gaushalas.");
        setNgoRequests(data.data || []);
        setRegisteredNgos(registeredRes.data || []);
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
      showToast(`Donation #${approveModal.id} verified!`, "success");
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
      showToast(`Donation #${rejectModal.id} rejected.`, "success");
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

  const handleApproveNgo = async (req) => {
    setApprovingNgo(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ngo/approve/${req.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Approved successfully! Data saved to DB and CSV.", "success");
        await fetchData();
      } else {
        showToast(data.error || "Failed to approve", "error");
      }
    } catch {
      showToast("Server error", "error");
    } finally {
      setApprovingId(null);
      setApprovingNgo(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

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
      if ((d.payment_method || "UPI").toUpperCase() !== paymentMethodFilter.toUpperCase()) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (d.donor_name || d.name || "").toLowerCase();
      const phone = (d.phone || "").toLowerCase();
      const email = (d.email || "").toLowerCase();
      const caseId = (d.case_id || "").toLowerCase();
      const utr = (d.transaction_id || d.gateway_payment_id || d.gateway_order_id || d.razorpay_payment_id || "").toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q) || caseId.includes(q) || utr.includes(q);
    }
    return true;
  });

  const isCaseView = donationCategory === "case";

  return (
    <div className={styles.adminContainer}>
      {toast && (
        <div className={styles.toastContainer}>
          <div className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
            <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <header className={styles.adminHeader}>
        <div>
          <h1 className={styles.adminTitle}>
            <span>🛡️</span> Admin Verification & Management
          </h1>
          <p className={styles.adminSub}>Logged in as <strong>{adminUser}</strong></p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span>🚪</span> Sign Out
        </button>
      </header>

      {activeMainTab === "donations" && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{isCaseView ? "Case Donations" : "General Donations"}</span>
              <span className={styles.statIcon}>📦</span>
            </div>
            <div className={styles.statNumber}>{totalCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Pending Verification</span>
              <span className={styles.statIcon}>⏳</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberPending}`}>{pendingCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Verified</span>
              <span className={styles.statIcon}>✅</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberVerified}`}>{verifiedCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Rejected</span>
              <span className={styles.statIcon}>❌</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberRejected}`}>{rejectedCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{isCaseView ? "To Transfer to NGOs" : "Total Verified Amount"}</span>
              <span className={styles.statIcon}>💰</span>
            </div>
            <div className={`${styles.statNumber} ${styles.statNumberVerified}`}>
              ₹{isCaseView ? pendingSettlementAmount.toLocaleString("en-IN") : verifiedTotalAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "donations" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("donations")}
        >
          🎁 Donations ({donations.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "ngoRequests" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("ngoRequests")}
        >
          🏢 NGO Requests ({ngoRequests.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "contacts" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("contacts")}
        >
          ✉️ Contact Submissions ({contacts.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "cowRescue" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("cowRescue")}
        >
          🐄 Cow Rescue Cases
        </button>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "settlements" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("settlements")}
        >
          💰 Settlements
        </button>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "news" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("news")}
        >
          📰 News
        </button>
        <button
          className={`${styles.tabBtn} ${activeMainTab === "gallery" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("gallery")}
        >
          🖼️ Gallery
        </button>
      </div>

      {error && (
        <div style={{ padding: "14px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "10px", marginBottom: "20px", border: "1px solid #fecaca", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>⚠️ {error}</span>
          <button onClick={fetchData} style={{ padding: "6px 12px", background: "#991b1b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {activeMainTab === "settlements" ? (
        <AdminSettlements token={token} />
      ) : activeMainTab === "news" ? (
        <AdminNews token={token} />
      ) : activeMainTab === "gallery" ? (
        <AdminGalleryImages token={token} />
      ) : activeMainTab === "cowRescue" ? (
        <CowRescueAdmin token={token} />
      ) : activeMainTab === "ngoRequests" ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
                  <tr>
                <th>Gaushala Name</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngoRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No pending NGO requests.
                  </td>
                </tr>
              ) : (
                ngoRequests.map((req) => (
                  <Fragment key={req.id}>
                          <tr>
                    <td>
                      <strong>{req.name}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{req.registration_number || "No Reg No."}</div>
                    </td>
                    <td>
                      <div>{req.contact_person}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{req.phone} | {req.email}</div>
                    </td>
                    <td>{req.city}, {req.state}</td>
                    <td>{req.capacity || "N/A"} cows</td>
                    <td>
                      <button
                        onClick={() => setExpandedNgoId((current) => current === `pending-${req.id}` ? null : `pending-${req.id}`)}
                        style={{ padding: '6px', marginRight: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {expandedNgoId === `pending-${req.id}` ? 'Hide details' : 'Full details'}
                      </button>
                      {approvingId === req.id ? (
                        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                          <button onClick={() => handleApproveNgo(req)} disabled={approvingNgo} style={{ padding: '6px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            {approvingNgo ? 'Approving...' : 'Confirm Approval'}
                          </button>
                          <button onClick={() => setApprovingId(null)} disabled={approvingNgo} style={{ padding: '6px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setApprovingId(req.id)} className={`${styles.actionBtn} ${styles.btnVerify}`}>
                          ✅ Approve
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedNgoId === `pending-${req.id}` && (
                    <tr>
                      <td colSpan={5} style={{ background: '#f8fafc', padding: '18px' }}>
                        <NgoDetails organization={req} />
                      </td>
                    </tr>
                  )}
          </Fragment>
                ))
              )}
            </tbody>
          </table>
          <h3 style={{ margin: '28px 0 12px' }}>Approved Gaushalas &amp; rescue partners</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Network status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {registeredNgos.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>No approved organizations found.</td></tr>
              ) : registeredNgos.map((organization) => (
                <Fragment key={organization.id}>
                  <tr>
                    <td><strong>{organization.name}</strong><div style={{ fontSize: "0.8rem", color: "#64748b" }}>{organization.organization_type || "Organization"}</div></td>
                    <td>{organization.contact_person || "—"}<div style={{ fontSize: "0.8rem", color: "#64748b" }}>{organization.phone || "—"} | {organization.email || "—"}</div></td>
                    <td>{[organization.city, organization.state].filter(Boolean).join(", ") || "—"}</td>
                    <td>{organization.is_verified ? "Verified" : "Not verified"} · {organization.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        onClick={() => setExpandedNgoId((current) => current === `registered-${organization.id}` ? null : `registered-${organization.id}`)}
                        style={{ padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {expandedNgoId === `registered-${organization.id}` ? 'Hide details' : 'Full details'}
                      </button>
                    </td>
                  </tr>
                  {expandedNgoId === `registered-${organization.id}` && (
                    <tr>
                      <td colSpan={5} style={{ background: '#f8fafc', padding: '18px' }}>
                        <NgoDetails organization={organization} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔄</div>
          Fetching administrative records...
        </div>
      ) : activeMainTab === "donations" ? (
        <div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "18px", padding: "6px", background: "#f1f5f9", borderRadius: "12px", maxWidth: "520px" }}>
            <button
              onClick={() => { setDonationCategory("general"); setSubTab("PENDING"); }}
              style={{ flex: 1, padding: "12px 16px", background: donationCategory === "general" ? "#ffffff" : "transparent", border: donationCategory === "general" ? "2px solid #16a34a" : "2px solid transparent", borderRadius: "10px", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700, color: donationCategory === "general" ? "#166534" : "#64748b", boxShadow: donationCategory === "general" ? "0 2px 8px rgba(22, 163, 74, 0.15)" : "none", transition: "all 0.2s" }}
            >
              🎁 General ({generalDonations.length})
            </button>
            <button
              onClick={() => { setDonationCategory("case"); setSubTab("PENDING"); }}
              style={{ flex: 1, padding: "12px 16px", background: donationCategory === "case" ? "#ffffff" : "transparent", border: donationCategory === "case" ? "2px solid #f59e0b" : "2px solid transparent", borderRadius: "10px", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700, color: donationCategory === "case" ? "#92400e" : "#64748b", boxShadow: donationCategory === "case" ? "0 2px 8px rgba(245, 158, 11, 0.15)" : "none", transition: "all 0.2s" }}
            >
              🐄 Case Donations ({caseDonations.length})
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.subTabs}>
              <button className={`${styles.subTabBtn} ${subTab === "PENDING" ? styles.subTabBtnActive : ""}`} onClick={() => setSubTab("PENDING")}>⏳ Pending ({pendingCount})</button>
              <button className={`${styles.subTabBtn} ${subTab === "VERIFIED" ? styles.subTabBtnActive : ""}`} onClick={() => setSubTab("VERIFIED")}>✅ Verified ({verifiedCount})</button>
              <button className={`${styles.subTabBtn} ${subTab === "REJECTED" ? styles.subTabBtnActive : ""}`} onClick={() => setSubTab("REJECTED")}>❌ Rejected ({rejectedCount})</button>
              <button className={`${styles.subTabBtn} ${subTab === "ALL" ? styles.subTabBtnActive : ""}`} onClick={() => setSubTab("ALL")}>📋 All ({totalCount})</button>
            </div>

            <div className={styles.filterControls}>
              <input type="text" placeholder="Search name, phone, UTR..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
              <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} className={styles.selectInput}>
                <option value="ALL">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="CASHFREE">Cashfree</option>
                <option value="ONLINE">Online Gateway</option>
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Contact & Location</th>
                  <th>Amount</th>
                  <th>Method & UTR</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No donations found.</td>
                  </tr>
                ) : (
                  filteredDonations.map((d) => {
                    const status = d.verification_status || d.payment_status || "PENDING";
                    return (
                      <tr key={d.id}>
                        <td><strong>{d.donor_name || d.name || "Anonymous Donor"}</strong></td>
                        <td>
                          <div>{d.phone || "—"}</div>
                          {(d.city || d.state) && <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{[d.city, d.state].filter(Boolean).join(", ")}</div>}
                        </td>
                        <td><strong style={{ color: "#166534", fontSize: "1rem" }}>₹{Number(d.amount || 0).toLocaleString("en-IN")}</strong></td>
                        <td>
                          <div><strong>{d.payment_gateway || d.payment_method || "UPI"}</strong></div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{d.gateway_payment_id || d.transaction_id || "—"}</div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${status === "VERIFIED" ? styles.badgeVerified : status === "REJECTED" ? styles.badgeRejected : styles.badgePending}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button onClick={() => setDetailsModal(d)} className={`${styles.actionBtn} ${styles.btnDetails}`}>🔍 Details</button>
                            {status !== "VERIFIED" && (
                              <button onClick={() => setApproveModal(d)} className={`${styles.actionBtn} ${styles.btnVerify}`} disabled={actionLoading}>✅ Approve</button>
                            )}
                            {status !== "REJECTED" && (
                              <button onClick={() => setRejectModal(d)} className={`${styles.actionBtn} ${styles.btnReject}`} disabled={actionLoading}>❌ Reject</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeMainTab === "contacts" ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No contact messages found.</td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong><div style={{ fontSize: "0.8rem", color: "#64748b" }}>{c.email}</div></td>
                    <td>{c.subject || "General Inquiry"}</td>
                    <td style={{ maxWidth: "320px" }}>{c.message}</td>
                    <td>
                      <span className={`${styles.badge} ${c.status === "RESOLVED" ? styles.badgeVerified : c.status === "READ" ? styles.badgeRead : styles.badgeNew}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        {c.status === "NEW" && <button onClick={() => handleContactStatus(c.id, "READ")} className={`${styles.actionBtn} ${styles.btnRead}`} disabled={actionLoading}>Mark Read</button>}
                        {c.status !== "RESOLVED" && <button onClick={() => handleContactStatus(c.id, "RESOLVED")} className={`${styles.actionBtn} ${styles.btnResolve}`} disabled={actionLoading}>Resolve</button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {screenshotModal && (
        <div className={styles.modalOverlay} onClick={() => { setScreenshotModal(null); setIsZoomed(false); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => { setScreenshotModal(null); setIsZoomed(false); }}>✕</button>
            <h3 className={styles.modalTitle}><span>🖼️</span> Payment Proof Screenshot</h3>
            <div style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "12px" }}>
              <strong>Donor:</strong> {screenshotModal.donor_name || screenshotModal.name || "Donor"} | <strong>Amount:</strong> ₹{Number(screenshotModal.amount || 0).toLocaleString("en-IN")}
            </div>
            {screenshotModal.payment_screenshot_url ? (
              <img src={getUploadUrl(screenshotModal.payment_screenshot_url)} alt="Proof" className={`${styles.modalImg} ${isZoomed ? styles.modalImgZoomed : ""}`} onClick={() => setIsZoomed(!isZoomed)} />
            ) : (
              <div className={styles.noScreenshotBox}>No screenshot uploaded.</div>
            )}
            <div className={styles.modalFooter}><button className={styles.btnSecondary} onClick={() => { setScreenshotModal(null); setIsZoomed(false); }}>Close</button></div>
          </div>
        </div>
      )}

      {detailsModal && (
        <div className={styles.modalOverlay} onClick={() => setDetailsModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDetailsModal(null)}>✕</button>
            <h3 className={styles.modalTitle}><span>📋</span> Details #{detailsModal.id}</h3>
            <div className={styles.modalSection}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}><div className={styles.detailLabel}>Name</div><div className={styles.detailValue}>{detailsModal.donor_name || detailsModal.name || "Anonymous"}</div></div>
                <div className={styles.detailItem}><div className={styles.detailLabel}>Amount</div><div className={styles.detailValue} style={{ color: "#166534", fontSize: "1.1rem" }}>₹{Number(detailsModal.amount || 0).toLocaleString("en-IN")}</div></div>
              </div>
            </div>
            <div className={styles.modalFooter}><button className={styles.btnSecondary} onClick={() => setDetailsModal(null)}>Close</button></div>
          </div>
        </div>
      )}

      {approveModal && (
        <div className={styles.modalOverlay} onClick={() => !actionLoading && setApproveModal(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => !actionLoading && setApproveModal(null)} disabled={actionLoading}>✕</button>
            <h3 className={styles.modalTitle} style={{ color: "#166534" }}><span>✅</span> Confirm Verification</h3>
            <p style={{ fontSize: "0.95rem", color: "#334155" }}>Verify donation of <strong>₹{Number(approveModal.amount || 0).toLocaleString("en-IN")}</strong>?</p>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setApproveModal(null)} disabled={actionLoading}>Cancel</button>
              <button className={`${styles.actionBtn} ${styles.btnVerify}`} onClick={handleConfirmApprove} disabled={actionLoading}>{actionLoading ? "Processing..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className={styles.modalOverlay} onClick={() => !actionLoading && setRejectModal(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => !actionLoading && setRejectModal(null)} disabled={actionLoading}>✕</button>
            <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}><span>❌</span> Reject Donation</h3>
            <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} className={styles.reasonSelect}>
              {REJECTION_REASONS.map((reason, idx) => <option key={idx} value={reason}>{reason}</option>)}
            </select>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setRejectModal(null)} disabled={actionLoading}>Cancel</button>
              <button className={`${styles.actionBtn} ${styles.btnReject}`} onClick={handleConfirmReject} disabled={actionLoading}>{actionLoading ? "Processing..." : "Reject"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;