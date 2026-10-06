const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanBaseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
const API_BASE_URL = `${cleanBaseUrl}/api`;

// ==================== HELPERS ====================
export const getUploadUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${cleanBaseUrl}${path}`;
};

// ==================== PUBLIC CONFIG ====================
export const getPublicConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/config/public`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch config.");
  return result;
};

// ==================== CONTACT ====================
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

// ==================== DONATIONS (public) ====================
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

// ==================== ADMIN AUTH ====================
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

export const getAdminMe = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch profile.");
  return result;
};

// ==================== ADMIN: DONATIONS ====================
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

// ==================== ADMIN: CONTACTS ====================
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

// =====================================================
// COW RESCUE — PUBLIC
// =====================================================

export const reportCow = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/cases/report`, {
    method: "POST",
    ...(isFormData
      ? { body: data }
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to submit report.");
  return result;
};

export const trackCase = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/track/${caseId}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Case not found.");
  return result;
};

export const getCaseTimeline = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/track/${caseId}/timeline`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Timeline not found.");
  return result;
};

export const getNearbyNGOs = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/nearby-ngos`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch NGOs.");
  return result;
};

export const getEligibleNGOs = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/eligible-ngos`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch eligible NGOs.");
  return result;
};

export const userCalled1962 = async (caseId, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/user-action/called-1962`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to log action.");
  return result;
};

export const userRequestHelp = async (caseId, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/user-action/request-help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to log request.");
  return result;
};

export const userNoResponse = async (caseId, note = "") => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/user-action/no-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to log response.");
  return result;
};

// ==================== NGO ALERTS ====================
export const getAlertByToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/alerts/${token}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Alert not found or expired.");
  return result;
};

export const acceptAlert = async (token) => {
  const response = await fetch(`${API_BASE_URL}/alerts/${token}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
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

// ==================== ADMIN: COW RESCUE ====================
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

// =====================================================
// CASE DONATIONS
// =====================================================

export const createCaseDonationOrder = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/case-donations/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to create order.");
  return result;
};

export const verifyCaseDonation = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/case-donations/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to verify payment.");
  return result;
};

export const getCaseDonations = async (caseId) => {
  const response = await fetch(`${API_BASE_URL}/case-donations/case/${caseId}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch donations.");
  return result;
};

export const getNgoPendingSettlements = async (token, ngoId) => {
  const response = await fetch(`${API_BASE_URL}/case-donations/ngo/${ngoId}/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch settlements.");
  return result;
};

// =====================================================
// NGO BANK DETAILS
// =====================================================

export const getNgoBankFormInfo = async (token) => {
  const response = await fetch(`${API_BASE_URL}/ngo-bank/${token}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Invalid link.");
  return result;
};

export const submitNgoBankDetails = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/ngo-bank/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to submit.");
  return result;
};

// =====================================================
// SETTLEMENTS
// =====================================================

export const getPendingSettlements = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/settlements/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch settlements.");
  return result;
};

export const getNgoSettlementDetail = async (token, ngoId) => {
  const response = await fetch(`${API_BASE_URL}/admin/settlements/ngo/${ngoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch NGO detail.");
  return result;
};

export const markNgoAsSettled = async (token, ngoId, utrReference, note = "") => {
  const response = await fetch(`${API_BASE_URL}/admin/settlements/ngo/${ngoId}/mark-settled`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ utr_reference: utrReference, note }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to mark as settled.");
  return result;
};

// =====================================================
// NEWS
// =====================================================

export const getPublicNews = async (category = null) => {
  const url = category && category !== "All"
    ? `${API_BASE_URL}/news?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/news`;
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch news.");
  return result;
};

export const getAdminNews = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/news`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch admin news.");
  return result;
};

export const createNews = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/admin/news`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to create news.");
  return result;
};

export const updateNews = async (token, id, formData) => {
  const response = await fetch(`${API_BASE_URL}/admin/news/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update news.");
  return result;
};

export const deleteNews = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/news/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to delete news.");
  return result;
};

export const toggleNewsPublish = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/news/${id}/toggle-publish`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to toggle publish.");
  return result;
};

// =====================================================
// GALLERY IMAGES
// =====================================================

export const getPublicGallery = async (category = null) => {
  const url = category && category !== "All"
    ? `${API_BASE_URL}/gallery?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/gallery`;
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch gallery.");
  return result;
};

export const getAdminGallery = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch gallery.");
  return result;
};

export const createGalleryImage = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to create image.");
  return result;
};

export const updateGalleryImage = async (token, id, formData) => {
  const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update image.");
  return result;
};

export const deleteGalleryImage = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to delete image.");
  return result;
};

export const toggleGalleryPublish = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}/toggle-publish`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to toggle publish.");
  return result;
};