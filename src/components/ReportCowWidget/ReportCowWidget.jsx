import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ReportCowWidget.module.css";
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


// India ke coordinates ka range check
const isInIndia = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  return latitude >= 8.0 && latitude <= 37.0 && longitude >= 68.0 && longitude <= 97.5;
};



// Profile / user icon (inline SVG)
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Plus icon (inline SVG)
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ReportCowWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const location = useLocation();

  const [form, setForm] = useState({
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    animal_condition: ANIMAL_CONDITIONS[0],
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

  // NAYA: GPS Location Fetch with India Check
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        if (!isInIndia(latitude, longitude)) {
          alert("⚠️ Location is outside India. This service is only available within India.");
          setIsLocating(false);
          return;
        }
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();
          const addr = data.address || {};

          setForm((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            address: addr.road || addr.suburb || addr.neighbourhood || prev.address,
            city: addr.city || addr.town || addr.village || addr.county || prev.city,
            state: addr.state || prev.state,
            district: addr.state_district || addr.county || prev.district,
            pincode: addr.postcode || prev.pincode
          }));
          
          setFieldErrors((prev) => {
            const n = { ...prev };
            delete n.location;
            delete n.address;
            return n;
          });
        } catch (error) {
          console.error("Address fetch failed", error);
          setForm((prev) => ({ ...prev, latitude: latitude.toString(), longitude: longitude.toString() }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        alert("Could not get your location. Please enable permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isReportPage = location.pathname === "/cow-rescue/report";

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setFieldErrors({});
      setSuccess(null);
      setPhotoFile(null);
      setVideoFile(null);
      setPhotoPreview(null);
      setMediaType("image");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openReportCowWidget", handler);
    return () => window.removeEventListener("openReportCowWidget", handler);
  }, []);

  if (isReportPage) return null;

  const isValidName = (n) => {
    const t = n.trim();
    if (t.length < 2) return false;
    return /^[a-zA-Z\s]+$/.test(t);
  };
  const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p);
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const n = { ...prev };
      delete n[name];
      return n;
    });
    if (name === "reporter_phone") {
      setForm((p) => ({ ...p, [name]: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    if (file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setVideoFile(null);
    } else if (file.type.startsWith("video/")) {
      if (file.size > 10 * 1024 * 1024) { setError("Video must be under 10MB"); return; }
      setVideoFile(file);
      setPhotoFile(null);
      setPhotoPreview(null);
    } else {
      setError("Please upload an image or video");
    }
  };

  const handleRemoveMedia = () => {
    setPhotoFile(null);
    setVideoFile(null);
    setPhotoPreview(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.reporter_name.trim()) errs.reporter_name = "Name is required";
    else if (!isValidName(form.reporter_name)) errs.reporter_name = "Only letters and spaces allowed";

    if (!form.reporter_phone.trim()) errs.reporter_phone = "Mobile number is required";
    else if (!isValidPhone(form.reporter_phone)) errs.reporter_phone = "Enter valid 10-digit mobile";

    if (!form.reporter_email.trim()) errs.reporter_email = "Email is required";
    else if (!isValidEmail(form.reporter_email)) errs.reporter_email = "Enter valid email";

    if (!form.description.trim()) errs.description = "Please describe the situation";
    else if (form.description.trim().length < 10) errs.description = "Minimum 10 characters";

    if (!form.address.trim()) errs.address = "Please provide exact address";

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    if (!form.latitude.trim() || !form.longitude.trim() ||
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errs.location = "Please click 'Use My Current Location' to fetch coordinates.";
    } else if (!isInIndia(latitude, longitude)) {
      errs.location = "Location must be within India.";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("reporter_name", form.reporter_name.trim());
      payload.append("reporter_phone", form.reporter_phone);
      payload.append("reporter_email", form.reporter_email.trim());
      payload.append("description", form.description.trim());
      payload.append("animal_type", "Cow");
      payload.append("animal_condition", form.animal_condition);
      payload.append("severity", "MEDIUM");
      payload.append("address", form.address.trim());
      payload.append("latitude", form.latitude);
      payload.append("longitude", form.longitude);
      payload.append("state", form.state.trim());
      payload.append("district", form.district.trim());
      payload.append("city", form.city.trim());
      payload.append("pincode", form.pincode.trim());
      if (photoFile) payload.append("incidentPhoto", photoFile);
      if (videoFile) payload.append("incidentVideo", videoFile);

      const res = await reportCow(payload);
      setSuccess(res.data);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const handleCheckStatus = () => {
    const caseId = success?.case_id;
    setIsOpen(false);

    if (!caseId) return;

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("openTrackCowWidget", {
          detail: { caseId },
        })
      );
    }, 150);
  };

  return (
    <>
      <button
        className={styles.floatingBtn}
        onClick={() => setIsOpen(true)}
        aria-label="Report Incident"
        title="Report Incident"
      >
        <span className={styles.btnIcon}>
          <PlusIcon />
        </span>
        <span className={styles.btnLabel}>Report Incident</span>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>
                  <PlusIcon /> New Report Incident
                </h2>
                <p className={styles.modalSub}>Fill this form to alert nearby NGOs</p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Close"
              >   
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {error && <div className={styles.errorBox}>⚠️ {error}</div>}

              {success ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>✅</div>
                  <h3 className={styles.successTitle}>Report Submitted!</h3>
                  <p className={styles.successText}>
                    Rescue alerts are limited to verified Gaushalas within 25 km of the reported location.
                  </p>
                  <div className={styles.caseIdBox}>
                    <span className={styles.caseIdLabel}>Case ID:</span>
                    <span className={styles.caseIdValue}>{success.case_id}</span>
                  </div>
                  <div className={styles.successActions}>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleCheckStatus}
                    >
                      <ProfileIcon /> Check Status
                    </button>
                    <button className={styles.btnSecondary} onClick={handleClose}>
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.grid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Your Name *</label>
                      <input
                        type="text"
                        name="reporter_name"
                        value={form.reporter_name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className={`${styles.input} ${fieldErrors.reporter_name ? styles.inputError : ""}`}
                      />
                      {fieldErrors.reporter_name && (
                        <p className={styles.fieldError}>⚠️ {fieldErrors.reporter_name}</p>
                      )}
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Mobile Number *</label>
                      <input
                        type="tel"
                        name="reporter_phone"
                        value={form.reporter_phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        inputMode="numeric"
                        className={`${styles.input} ${fieldErrors.reporter_phone ? styles.inputError : ""}`}
                      />
                      {fieldErrors.reporter_phone && (
                        <p className={styles.fieldError}>⚠️ {fieldErrors.reporter_phone}</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      name="reporter_email"
                      value={form.reporter_email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`${styles.input} ${fieldErrors.reporter_email ? styles.inputError : ""}`}
                    />
                    {fieldErrors.reporter_email && (
                      <p className={styles.fieldError}>⚠️ {fieldErrors.reporter_email}</p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Cow's Condition *</label>
                    <select
                      name="animal_condition"
                      value={form.animal_condition}
                      onChange={handleChange}
                      className={styles.input}
                    >
                      {ANIMAL_CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Describe the situation *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What happened? Injuries? Urgent needs?"
                      className={`${styles.input} ${fieldErrors.description ? styles.inputError : ""}`}
                    />
                    {fieldErrors.description && (
                      <p className={styles.fieldError}>⚠️ {fieldErrors.description}</p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Please provide exact address *</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="e.g. Near Temple, Main Road, Sector 62"
                      className={`${styles.input} ${fieldErrors.address ? styles.inputError : ""}`}
                    />
                    {fieldErrors.address && (
                      <p className={styles.fieldError}>⚠️ {fieldErrors.address}</p>
                    )}
                  </div>
                  
                  {/* NAYA: GPS Location Button */}
                  <div style={{ margin: '10px 0', padding: '15px', backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#92400e' }}>
                      <strong>Note:</strong> Click the button below to fetch your exact GPS location.
                    </p>
                    <button 
                      type="button" 
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {isLocating ? "📡 Fetching Location..." : "📡 Use My Current Location"}
                    </button>
                    {form.latitude && form.longitude && (
                      <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#16a34a', textAlign: 'center' }}>
                        ✅ Location set! (Lat: {form.latitude}, Lng: {form.longitude})
                      </p>
                    )}
                  </div>
                  {fieldErrors.location && (
                    <p className={styles.fieldError}>⚠️ {fieldErrors.location}</p>
                  )}

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Upload Evidence (Optional)</label>
                    <div className={styles.mediaRow}>
                      <select
                        value={mediaType}
                        onChange={(e) => {
                          setMediaType(e.target.value);
                          handleRemoveMedia();
                        }}
                        className={styles.mediaTypeSelect}
                      >
                        <option value="image">📷 Image</option>
                        <option value="video">🎥 Video</option>
                      </select>

                      {!photoPreview && !videoFile ? (
                        <>
                          <input
                            type="file"
                            id="reportCowMediaInput"
                            accept={mediaType === "image" ? "image/*" : "video/*"}
                            onChange={handleMediaChange}
                            style={{ display: "none" }}
                          />
                          <label htmlFor="reportCowMediaInput" className={styles.uploadBtn}>
                            📎 Choose File
                          </label>
                        </>
                      ) : (
                        <button type="button" onClick={handleRemoveMedia} className={styles.removeBtn}>
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    {photoPreview && (
                      <img src={photoPreview} alt="Preview" className={styles.previewImg} />
                    )}
                    {videoFile && (
                      <div className={styles.videoInfo}>🎥 {videoFile.name}</div>
                    )}
                  </div>

                  <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                    {isSubmitting ? "Submitting..." : "🚨 Submit Report"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportCowWidget;