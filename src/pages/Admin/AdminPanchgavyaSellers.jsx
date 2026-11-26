import { useEffect, useState } from "react";
import {
  getAdminPanchgavyaSellers,
  reviewPanchgavyaSeller,
} from "../../services/api";

const buttonStyle = {
  border: 0,
  borderRadius: "7px",
  padding: "8px 11px",
  cursor: "pointer",
  color: "#fff",
  fontWeight: 700,
};

export default function AdminPanchgavyaSellers({ token }) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminPanchgavyaSellers(token);
      setSellers(result.data || []);
    } catch (requestError) {
      setError(requestError.message || "Could not load seller submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const review = async (seller, status) => {
    let rejectionReason = "";
    if (status === "REJECTED") {
      rejectionReason = window.prompt("Enter the reason for rejection:");
      if (rejectionReason === null) return;
      if (!rejectionReason.trim()) {
        setError("Rejection reason is required.");
        return;
      }
    }
    setBusyId(seller.id);
    setError("");
    setMessage("");
    try {
      await reviewPanchgavyaSeller(token, seller.id, status, rejectionReason);
      setMessage(status === "VERIFIED"
        ? `${seller.business_name} verified and published.`
        : `${seller.business_name} was rejected.`);
      await load();
    } catch (requestError) {
      setError(requestError.message || "Could not review seller.");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <p>Loading Panchgavya seller submissions...</p>;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Panchgavya Seller Verifications</h2>
      {message && <p style={{ padding: "12px", background: "#dcfce7", color: "#166534", borderRadius: "8px" }}>{message}</p>}
      {error && <p style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>{error}</p>}
      {sellers.length === 0 ? (
        <p>No seller submissions found.</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {sellers.map((seller) => (
            <article key={seller.id} style={{ border: "1px solid #dbe4dc", borderRadius: "12px", background: "#fff", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <strong style={{ color: "#14532d", fontSize: "1.05rem" }}>{seller.business_name}</strong>
                  <div style={{ color: "#64748b", marginTop: "4px" }}>{seller.category} · {seller.owner_name}</div>
                </div>
                <span style={{
                  alignSelf: "start",
                  padding: "6px 9px",
                  borderRadius: "999px",
                  background: seller.verification_status === "VERIFIED" ? "#dcfce7" : seller.verification_status === "REJECTED" ? "#fee2e2" : "#fef3c7",
                  color: seller.verification_status === "VERIFIED" ? "#166534" : seller.verification_status === "REJECTED" ? "#991b1b" : "#92400e",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                }}>
                  {seller.verification_status}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setExpandedId(expandedId === seller.id ? null : seller.id)} style={buttonStyle}>
                  <span style={{ color: "#14532d" }}>{expandedId === seller.id ? "Hide details" : "Full details"}</span>
                </button>
                {seller.verification_status !== "VERIFIED" && (
                  <button type="button" disabled={busyId === seller.id} onClick={() => review(seller, "VERIFIED")} style={{ ...buttonStyle, background: "#16a34a" }}>
                    {busyId === seller.id ? "Processing..." : "Approve"}
                  </button>
                )}
                {seller.verification_status !== "REJECTED" && (
                  <button type="button" disabled={busyId === seller.id} onClick={() => review(seller, "REJECTED")} style={{ ...buttonStyle, background: "#dc2626" }}>
                    Reject
                  </button>
                )}
              </div>
              {expandedId === seller.id && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "16px", borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
                  <div><strong>Email:</strong> {seller.email}<br /><strong>Phone:</strong> {seller.phone}<br /><strong>Owner:</strong> {seller.owner_name}</div>
                  <div><strong>Website:</strong> <a href={seller.website_url} target="_blank" rel="noopener noreferrer">{seller.website_url}</a><br /><strong>Registration:</strong> {seller.registration_number || "Not provided"}<br /><strong>Address:</strong> {seller.address || "Not provided"}</div>
                  <div>
                    <strong>Description:</strong><p style={{ margin: "5px 0" }}>{seller.short_description}</p>
                    {seller.logo_url && <div><a href={seller.logo_url} target="_blank" rel="noopener noreferrer">View logo</a></div>}
                    {seller.registration_certificate_url && <div><a href={seller.registration_certificate_url} target="_blank" rel="noopener noreferrer">View registration certificate</a></div>}
                  </div>
                  {seller.rejection_reason && <div><strong>Rejection reason:</strong> {seller.rejection_reason}</div>}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
