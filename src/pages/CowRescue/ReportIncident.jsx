 
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./ReportIncident.module.css";
import MapPicker from "./components/MapPicker";
import { reportCow } from "../../services/api";

const ANIMAL_CONDITIONS = [
  "Injured",
  "Accident",
  "Sick",
  "Weak/Malnourished",
  "Abandoned",
  "Trapped",
  "Other",
];

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    description: "",
    animal_condition: ANIMAL_CONDITIONS[0],
    address: "",
    latitude: "28.6139",
    longitude: "77.2090",
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

  const [incidentPhoto, setIncidentPhoto] = useState(null);
  const [incidentVideo, setIncidentVideo] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [locating, setLocating] = useState(false);

  const fieldRefs = {
    reporter_name: useRef(null),
    reporter_phone: useRef(null),
    reporter_email: useRef(null),
    description: useRef(null),
    address: useRef(null),
  };

  // ==================== VALIDATION ====================
  const isValidName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return false;
    return /^[a-zA-Z\s]+$/.test(trimmed);
  };

  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};

    if (!formData.reporter_name.trim()) {
      errors.reporter_name = "Name is required.";
    } else if (formData.reporter_name.trim().length < 2) {
      errors.reporter_name = "Name must be at least 2 characters.";
    } else if (!isValidName(formData.reporter_name)) {
      errors.reporter_name = "Name can only contain letters and spaces.";
    }

    if (!formData.reporter_phone.trim()) {
      errors.reporter_phone = "Mobile number is required.";
    } else if (!isValidPhone(formData.reporter_phone)) {
      errors.reporter_phone = "Enter a valid 10-digit Indian mobile (starts with 6-9).";
    }

    if (!formData.reporter_email.trim()) {
      errors.reporter_email = "Email address is required.";
    } else if (!isValidEmail(formData.reporter_email)) {
      errors.reporter_email = "Enter a valid email (e.g. name@example.com).";
    }

    if (!formData.description.trim()) {
      errors.description = "Please describe the situation.";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter the location / area.";
    }

    return errors;
  };

  // ==================== HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

    if (name === "reporter_phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==================== CURRENT LOCATION ====================
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          setFormData((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
            address: addr.road || addr.suburb || addr.neighbourhood || addr.village || prev.address,
            city: addr.city || addr.town || addr.village || addr.county || "",
            district: addr.state_district || addr.county || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
          }));

          setFieldErrors((prev) => {
            const next = { ...prev };
            delete next.address;
            return next;
          });
        } catch (err) {
          console.warn("Reverse geocode failed:", err.message);
          setFormData((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
          }));
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setErrorMsg("Could not fetch your location. Please enable location permission in browser.");
        console.warn(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==================== FILE HANDLERS ====================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Only JPG, PNG, WEBP images supported.");
      return;
    }

    setErrorMsg("");
    setIncidentPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Video size exceeds 10MB.");
      return;
    }
    setIncidentVideo(file);
  };

  const handleRemovePhoto = () => {
    setIncidentPhoto(null);
    setPhotoPreview(null);
  };

  const handleRemoveVideo = () => {
    setIncidentVideo(null);
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      const firstErrorKey = Object.keys(errors)[0];
      const errorCount = Object.keys(errors).length;
      setErrorMsg(
        errorCount === 1
          ? `⚠️ ${errors[firstErrorKey]}`
          : `⚠️ Please fix ${errorCount} errors below.`
      );

      const ref = fieldRefs[firstErrorKey];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("reporter_name", formData.reporter_name.trim());
      payload.append("reporter_phone", formData.reporter_phone);
      payload.append("reporter_email", formData.reporter_email.trim());
      payload.append("description", formData.description.trim());
      payload.append("animal_type", "Cow");
      payload.append("animal_condition", formData.animal_condition);
      payload.append("severity", "MEDIUM");
      payload.append("address", formData.address.trim());
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      payload.append("state", formData.state.trim());
      payload.append("district", formData.district.trim());
      payload.append("city", formData.city.trim());
      payload.append("pincode", formData.pincode.trim());

      if (incidentPhoto) payload.append("incidentPhoto", incidentPhoto);
      if (incidentVideo) payload.append("incidentVideo", incidentVideo);

      const res = await reportCow(payload);
      setSuccessData(res.data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit rescue report.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (name) =>
    fieldErrors[name] ? styles.inputError : "";

  // ==================== SUCCESS SCREEN ====================
  if (successData) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successBadge}>✅ Report Submitted Successfully</div>
          <h2>Thank You for Reporting!</h2>
          <p className={styles.successSub}>
            Your emergency report has been registered. NGOs and Government helpline have been notified.
          </p>

          <div className={styles.ticketDetails}>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Case ID:</span>
              <span className={styles.ticketValue}>{successData.case_id}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Status:</span>
              <span className={styles.statusBadge}>{successData.status}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Submitted At:</span>
              <span>{new Date(successData.created_at).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className={styles.successActions}>
            <Link to={`/cow-rescue/track?case=${successData.case_id}`} className={styles.btnPrimary}>
              🔍 Track Status
            </Link>
            <Link to="/cow-rescue" className={styles.btnSecondary}>
              ← Back to Cow Rescue Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Link to="/cow-rescue" className={styles.backLink}>
          ← Back to Portal
        </Link>
        <h1>🚨 Report an Injured Cow</h1>
        <p>
          Fill this form to report an injured, sick, or trapped cow. Your location helps
          rescue teams find the animal quickly.
        </p>
      </div>

      {errorMsg && (
        <div
          className={styles.errorAlert}
          style={{
            position: "sticky",
            top: "80px",
            zIndex: 100,
            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
        {/* 1. Reporter Info */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>👤</span> 1. Reporter Information
          </h3>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label htmlFor="reporter_name">Full Name *</label>
              <input
                ref={fieldRefs.reporter_name}
                type="text"
                id="reporter_name"
                name="reporter_name"
                placeholder="Enter your name"
                value={formData.reporter_name}
                onChange={handleChange}
                className={fieldClass("reporter_name")}
                required
              />
              {fieldErrors.reporter_name && (
                <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.reporter_name}</p>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="reporter_phone">
                Mobile Number * <small>(10 digits)</small>
              </label>
              <input
                ref={fieldRefs.reporter_phone}
                type="tel"
                id="reporter_phone"
                name="reporter_phone"
                placeholder="e.g. 9876543210"
                value={formData.reporter_phone}
                onChange={handleChange}
                className={fieldClass("reporter_phone")}
                inputMode="numeric"
                maxLength={10}
                required
              />
              {fieldErrors.reporter_phone && (
                <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.reporter_phone}</p>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reporter_email">Email Address *</label>
            <input
              ref={fieldRefs.reporter_email}
              type="email"
              id="reporter_email"
              name="reporter_email"
              placeholder="e.g. ramesh@example.com"
              value={formData.reporter_email}
              onChange={handleChange}
              className={fieldClass("reporter_email")}
              required
            />
            {fieldErrors.reporter_email && (
              <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.reporter_email}</p>
            )}
          </div>
        </div>

        {/* 2. Situation */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>🐄</span> 2. Situation & Condition
          </h3>

          <div className={styles.fieldGroup}>
            <label htmlFor="animal_condition">Cow Condition *</label>
            <select
              id="animal_condition"
              name="animal_condition"
              value={formData.animal_condition}
              onChange={handleChange}
              required
            >
              {ANIMAL_CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description">Situation Description *</label>
            <textarea
              ref={fieldRefs.description}
              id="description"
              name="description"
              rows="4"
              placeholder="Describe what happened, visible injuries, and urgent needs..."
              value={formData.description}
              onChange={handleChange}
              className={fieldClass("description")}
              required
            ></textarea>
            {fieldErrors.description && (
              <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* 3. Location */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>📍</span> 3. Incident Location
          </h3>

          <MapPicker
            lat={formData.latitude}
            lng={formData.longitude}
            onChangeLocation={(lat, lng) => {
              setFormData((prev) => ({
                ...prev,
                latitude: String(lat),
                longitude: String(lng),
              }));
            }}
            onAddressGeocoded={(geoDetails) => {
              if (!geoDetails) return;
              setFormData((prev) => ({
                ...prev,
                address: prev.address.trim() ? prev.address : (geoDetails.address || prev.address),
                city: geoDetails.city || prev.city,
                district: geoDetails.district || prev.district,
                state: geoDetails.state || prev.state,
                pincode: geoDetails.pincode || prev.pincode,
              }));
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.address;
                return next;
              });
            }}
          />

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "16px",
              marginBottom: "16px",
              background: locating
                ? "#94a3b8"
                : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: locating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {locating ? "📡 Fetching your location..." : "📡 Use My Current Location"}
          </button>

          <div className={styles.fieldGroup}>
            <label htmlFor="address">Road / Area / Landmark *</label>
            <input
              ref={fieldRefs.address}
              type="text"
              id="address"
              name="address"
              placeholder="e.g. Near Temple Chowk, Main Bypass Road"
              value={formData.address}
              onChange={handleChange}
              className={fieldClass("address")}
              required
            />
            {fieldErrors.address && (
              <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.address}</p>
            )}
          </div>
        </div>

        {/* 4. Media */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>📷</span> 4. Upload Photo / Video (Optional)
          </h3>
          <p className={styles.uploadHint}>
            Photo max 5MB (JPG, PNG, WEBP) • Video max 10MB (MP4, MOV, WEBM)
          </p>

          {!photoPreview ? (
            <div className={styles.fileDropArea} style={{ marginBottom: "12px" }}>
              <input
                type="file"
                id="incidentPhoto"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className={styles.fileInputHidden}
              />
              <label htmlFor="incidentPhoto" className={styles.fileDropLabel}>
                <span className={styles.uploadIcon}>📷</span>
                <span>Click to Select Photo</span>
              </label>
            </div>
          ) : (
            <div className={styles.photoPreviewWrapper} style={{ marginBottom: "12px" }}>
              <img src={photoPreview} alt="Preview" className={styles.previewImg} />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className={styles.btnRemovePhoto}
              >
                ✕ Remove Photo
              </button>
            </div>
          )}

          {!incidentVideo ? (
            <div className={styles.fileDropArea}>
              <input
                type="file"
                id="incidentVideo"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleVideoChange}
                className={styles.fileInputHidden}
              />
              <label htmlFor="incidentVideo" className={styles.fileDropLabel}>
                <span className={styles.uploadIcon}>🎥</span>
                <span>Click to Select Video</span>
              </label>
            </div>
          ) : (
            <div style={{ marginTop: "12px", padding: "12px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px" }}>
              <strong>🎥 Video:</strong> {incidentVideo.name}
              <button
                type="button"
                onClick={handleRemoveVideo}
                style={{ marginLeft: "12px", padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.btnSubmit}>
          {isSubmitting ? "Submitting Emergency Report..." : "🚨 Submit Rescue Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;