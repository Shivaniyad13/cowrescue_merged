const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanBaseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
const API_BASE_URL = `${cleanBaseUrl}/api`;

export const getUploadUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${cleanBaseUrl}${path}`;
};

// -------------------------------------------------------------
// EXISTING SITE APIs (Contact, Donation, Admin)
// -------------------------------------------------------------
export const submitContact = async (data) => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to submit contact message.");
  return result;
};

export const submitDonation = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to submit donation.");
  return result;
};

export const createDonationOrder = async (donationData) => {
  const response = await fetch(`${API_BASE_URL}/donations/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donationData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to create payment order.");
  return result;
};

export const verifyDonationOrder = async (verifyData) => {
  const response = await fetch(`${API_BASE_URL}/donations/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(verifyData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to verify payment.");
  return result;
};

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Admin login failed.");
  return result;
};

export const getAdminDonations = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/donations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch donation records.");
  return result;
};

export const updateAdminDonationStatus = async (token, id, statusData) => {
  const response = await fetch(`${API_BASE_URL}/admin/donations/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(statusData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update donation status.");
  return result;
};

export const getAdminContacts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch contact messages.");
  return result;
};

export const updateAdminContactStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update contact status.");
  return result;
};

// -------------------------------------------------------------
// COW RESCUE APIs (Backend: /api/cases/*, /api/alerts/*, /api/admin/*)
// -------------------------------------------------------------

// ==== PUBLIC ====

// Report a cow
export const reportCow = async (data) => {
  const response = await fetch(`${API_BASE_URL}/cases/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to submit report.");
  return result;
};

// Track case by case_id (e.g. CASE-2026-123456)
export const trackCase = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/track/${caseId}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Case not found.");
  return result;
};

// Get timeline for a case
export const getCaseTimeline = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/track/${caseId}/timeline`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Timeline not found.");
  return result;
};

// Nearby NGOs for a case
export const getNearbyNGOs = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/nearby-ngos`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch nearby NGOs.");
  return result;
};

// Eligible NGOs for a case
export const getEligibleNGOs = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/eligible-ngos`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch eligible NGOs.");
  return result;
};

// User action: called 1962
export const userCalled1962 = async (caseId, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/user-action/called-1962`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to log 1962 call.");
  return result;
};

// User action: request help
export const userRequestHelp = async (caseId, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/user-action/request-help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to request help.");
  return result;
};

// User action: no response
export const userNoResponse = async (caseId, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/user-action/no-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to log no-response.");
  return result;
};

// ==== NGO ALERTS (Token-based) ====

export const getAlertByToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/alerts/${token}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Alert not found or expired.");
  return result;
};

export const acceptAlert = async (token) => {
  const response = await fetch(`${API_BASE_URL}/alerts/${token}/accept`, {
    method: "POST",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to accept alert.");
  return result;
};

export const rejectAlert = async (token, reason = "") => {
  const response = await fetch(`${API_BASE_URL}/alerts/${token}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to reject alert.");
  return result;
};

// ==== ADMIN (Cow Rescue) ====

export const getAdminMe = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch profile.");
  return result;
};

export const getAdminCases = async (token, status = "", page = 1, limit = 20) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("page", page);
  params.append("limit", limit);
  const response = await fetch(`${API_BASE_URL}/cases/admin/list?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch cases.");
  return result;
};

export const adminUpdateCaseStatus = async (token, caseId, status, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/admin/${caseId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update status.");
  return result;
};

export const adminUpdateGovernmentRoute = async (token, caseId, government_route_status, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/admin/${caseId}/government-route`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ government_route_status, note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update government route.");
  return result;
};

export const adminSendAlert = async (token, caseId, payload) => {
  const response = await fetch(`${API_BASE_URL}/cases/admin/${caseId}/send-alert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to send alert.");
  return result;
};

export const getAdminStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch admin stats.");
  return result;
};

export const getAdminNGOs = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/ngos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch NGOs.");
  return result;
};

export const verifyAdminNGO = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/ngos/${id}/verify`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to verify NGO.");
  return result;
};

export const optInAdminNGO = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/ngos/${id}/opt-in`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to opt-in NGO.");
  return result;
};

export const getAdminAlerts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/alerts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch alerts.");
  return result;
};

export const getAdminFullCase = async (token, caseId) => {
  const response = await fetch(`${API_BASE_URL}/admin/cases/${caseId}/full`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch full case.");
  return result;
};

// -------------------------------------------------------------
// PUBLIC CONFIG
// -------------------------------------------------------------
export const getPublicConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/config/public`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch public config.");
  return result;
};