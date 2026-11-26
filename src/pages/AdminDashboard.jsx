import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import {
  getAdminContacts,
  updateAdminContactStatus,
  getAdminNGOs,
  API_BASE_URL,
} from "../services/api";
import CowRescueAdmin from "./Admin/CowRescueAdmin";
import AdminNews from "./Admin/AdminNews";
import AdminGalleryImages from "./Admin/AdminGalleryImages";
import AdminPanchgavyaSellers from "./Admin/AdminPanchgavyaSellers";

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
  const [activeMainTab, setActiveMainTab] = useState("ngoRequests");
  const [contacts, setContacts] = useState([]);
  
  // NGO Requests States
  const [ngoRequests, setNgoRequests] = useState([]);
  const [rejectedNgoRequests, setRejectedNgoRequests] = useState([]);
  const [registeredNgos, setRegisteredNgos] = useState([]);
  const [expandedNgoId, setExpandedNgoId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [approvingNgo, setApprovingNgo] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectingNgo, setRejectingNgo] = useState(false);

  // Pagination States for Pending NGOs
  const [ngoPage, setNgoPage] = useState(1);
  const [ngoTotalPages, setNgoTotalPages] = useState(1);
  const ngoLimit = 20;

  // Pagination States for Rejected NGOs
  const [rejectedPage, setRejectedPage] = useState(1);
  const [rejectedTotalPages, setRejectedTotalPages] = useState(1);
  const rejectedLimit = 20;

  // Pagination States for Approved NGOs
  const [approvedPage, setApprovedPage] = useState(1);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const approvedLimit = 20;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

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
      activeMainTab === "news" ||
      activeMainTab === "gallery" ||
      activeMainTab === "panchgavyaSellers"
    ) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [token, activeMainTab, ngoPage, approvedPage, rejectedPage]); // Dependencies updated

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeMainTab === "contacts") {
        const res = await getAdminContacts(token);
        setContacts(res.contacts || []);
      } else if (activeMainTab === "ngoRequests") {
        const [res, registeredRes, rejectedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/ngo/pending?page=${ngoPage}&limit=${ngoLimit}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/admin/ngos?page=${approvedPage}&limit=${approvedLimit}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/ngo/rejected?page=${rejectedPage}&limit=${rejectedLimit}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch pending Gaushalas.");
        setNgoRequests(data.data || []);
        if (data.pagination && data.pagination.totalPages) {
          setNgoTotalPages(data.pagination.totalPages);
        } else {
          setNgoTotalPages(1); 
        }

        const rejectedData = await rejectedRes.json();
        if (!rejectedRes.ok) {
          throw new Error(rejectedData.error || "Failed to fetch rejected Gaushalas.");
        }
        setRejectedNgoRequests(rejectedData.data || []);
        const rejectedPages = Math.max(rejectedData.pagination?.totalPages || 1, 1);
        setRejectedTotalPages(rejectedPages);
        setRejectedPage((currentPage) => Math.min(currentPage, rejectedPages));
        
        const registeredData = await registeredRes.json();
        if (registeredRes.ok) {
          setRegisteredNgos(registeredData.data || []);
          if (registeredData.pagination && registeredData.pagination.totalPages) {
            setApprovedTotalPages(registeredData.pagination.totalPages);
          } else {
            setApprovedTotalPages(1);
          }
        }
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

  const handleRejectNgo = async (req) => {
    setRejectingNgo(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ngo/reject/${req.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject Gaushala request.");

      showToast("Gaushala request rejected.", "success");
      await fetchData();
    } catch (err) {
      showToast(err.message || "Failed to reject Gaushala request.", "error");
    } finally {
      setRejectingId(null);
      setRejectingNgo(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

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

      <div className={styles.tabBar}>
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
        <button
          className={`${styles.tabBtn} ${activeMainTab === "panchgavyaSellers" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveMainTab("panchgavyaSellers")}
        >
          🌿 Panchgavya Sellers
        </button>
      </div>

      {error && (
        <div style={{ padding: "14px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "10px", marginBottom: "20px", border: "1px solid #fecaca", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>⚠️ {error}</span>
          <button onClick={fetchData} style={{ padding: "6px 12px", background: "#991b1b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {activeMainTab === "news" ? (
        <AdminNews token={token} />
      ) : activeMainTab === "gallery" ? (
        <AdminGalleryImages token={token} />
      ) : activeMainTab === "panchgavyaSellers" ? (
        <AdminPanchgavyaSellers token={token} />
      ) : activeMainTab === "cowRescue" ? (
        <CowRescueAdmin token={token} />
      ) : activeMainTab === "ngoRequests" ? (
        <div className={styles.tableWrapper}>
          
          {/* Pending NGOs Table */}
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
                        <div className={styles.actionGroup}>
                        <button
                          onClick={() => setExpandedNgoId((current) => current === `pending-${req.id}` ? null : `pending-${req.id}`)}
                          style={{ padding: '6px', marginRight: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {expandedNgoId === `pending-${req.id}` ? 'Hide details' : 'Full details'}
                        </button>
                        {approvingId === req.id ? (
                          <>
                            <button onClick={() => handleApproveNgo(req)} disabled={approvingNgo} style={{ padding: '6px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                              {approvingNgo ? 'Approving...' : 'Confirm Approval'}
                            </button>
                            <button onClick={() => setApprovingId(null)} disabled={approvingNgo} style={{ padding: '6px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                              Cancel
                            </button>
                          </>
                        ) : rejectingId === req.id ? (
                          <>
                            <button onClick={() => handleRejectNgo(req)} disabled={rejectingNgo} className={`${styles.actionBtn} ${styles.btnReject}`}>
                              {rejectingNgo ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                            <button onClick={() => setRejectingId(null)} disabled={rejectingNgo} className={`${styles.actionBtn} ${styles.btnDetails}`}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setApprovingId(req.id)} className={`${styles.actionBtn} ${styles.btnVerify}`}>
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => setRejectingId(req.id)}
                              disabled={expandedNgoId !== `pending-${req.id}`}
                              title={expandedNgoId === `pending-${req.id}` ? "Reject this request" : "Open full details before rejecting"}
                              className={`${styles.actionBtn} ${styles.btnReject}`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        </div>
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
          
          {/* Pagination for Pending NGOs */}
          {ngoRequests.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '40px' }}>
              <button 
                onClick={() => setNgoPage(prev => Math.max(prev - 1, 1))} 
                disabled={ngoPage === 1}
                style={{ padding: '8px 16px', backgroundColor: ngoPage === 1 ? '#e2e8f0' : '#0f7631', color: ngoPage === 1 ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', cursor: ngoPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <span style={{ fontWeight: 'bold', color: '#333' }}>Page {ngoPage} of {ngoTotalPages}</span>
              <button 
                onClick={() => setNgoPage(prev => Math.min(prev + 1, ngoTotalPages))} 
                disabled={ngoPage === ngoTotalPages}
                style={{ padding: '8px 16px', backgroundColor: ngoPage === ngoTotalPages ? '#e2e8f0' : '#0f7631', color: ngoPage === ngoTotalPages ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', cursor: ngoPage === ngoTotalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          )}

          <h3 style={{ margin: '28px 0 12px' }}>Rejected Gaushala Requests</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Gaushala Name</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {rejectedNgoRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                    No rejected Gaushala requests.
                  </td>
                </tr>
              ) : rejectedNgoRequests.map((req) => (
                <Fragment key={req.id}>
                  <tr>
                    <td>
                      <strong>{req.name}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{req.registration_number || "No Reg No."}</div>
                    </td>
                    <td>
                      <div>{req.contact_person || "—"}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{req.phone} | {req.email}</div>
                    </td>
                    <td>{[req.city, req.state].filter(Boolean).join(", ") || "—"}</td>
                    <td>{req.capacity ?? "N/A"} cows</td>
                    <td>
                      <button
                        onClick={() => setExpandedNgoId((current) => current === `rejected-${req.id}` ? null : `rejected-${req.id}`)}
                        style={{ padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {expandedNgoId === `rejected-${req.id}` ? 'Hide details' : 'Full details'}
                      </button>
                    </td>
                  </tr>
                  {expandedNgoId === `rejected-${req.id}` && (
                    <tr>
                      <td colSpan={5} style={{ background: '#f8fafc', padding: '18px' }}>
                        <NgoDetails organization={req} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {rejectedNgoRequests.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '40px' }}>
              <button
                onClick={() => setRejectedPage((page) => Math.max(page - 1, 1))}
                disabled={rejectedPage === 1}
                style={{ padding: '8px 16px', backgroundColor: rejectedPage === 1 ? '#e2e8f0' : '#0f7631', color: rejectedPage === 1 ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', cursor: rejectedPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <span style={{ fontWeight: 'bold', color: '#333' }}>Page {rejectedPage} of {rejectedTotalPages}</span>
              <button
                onClick={() => setRejectedPage((page) => Math.min(page + 1, rejectedTotalPages))}
                disabled={rejectedPage === rejectedTotalPages}
                style={{ padding: '8px 16px', backgroundColor: rejectedPage === rejectedTotalPages ? '#e2e8f0' : '#0f7631', color: rejectedPage === rejectedTotalPages ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', cursor: rejectedPage === rejectedTotalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          )}

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

          {/* NAYA: Pagination for Approved NGOs */}
          {registeredNgos.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '40px' }}>
              <button 
                onClick={() => setApprovedPage(prev => Math.max(prev - 1, 1))} 
                disabled={approvedPage === 1}
                style={{ padding: '8px 16px', backgroundColor: approvedPage === 1 ? '#e2e8f0' : '#0f7631', color: approvedPage === 1 ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', cursor: approvedPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <span style={{ fontWeight: 'bold', color: '#333' }}>Page {approvedPage} of {approvedTotalPages}</span>
              <button 
                onClick={() => setApprovedPage(prev => Math.min(prev + 1, approvedTotalPages))} 
                disabled={approvedPage === approvedTotalPages}
                style={{ padding: '8px 16px', backgroundColor: approvedPage === approvedTotalPages ? '#e2e8f0' : '#0f7631', color: approvedPage === approvedTotalPages ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', cursor: approvedPage === approvedTotalPages ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔄</div>
          Fetching administrative records...
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

    </div>
  );
};

export default AdminDashboard;