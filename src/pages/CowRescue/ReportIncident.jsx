import React, { useState } from "react";
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

const SEVERITY_LEVELS = [
  { id: "LOW", label: "Low (Stable condition)" },
  { id: "MEDIUM", label: "Medium (Needs attention)" },
  { id: "HIGH", label: "High (Urgent)" },
  { id: "CRITICAL", label: "Critical (Life threatening)" },
];

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    description: "",
    animal_type: "Cow",
    animal_condition: ANIMAL_CONDITIONS[0],
    severity: "MEDIUM",
    address: "",
    latitude: "28.6139",
    longitude: "77.2090",
    state: "",
    district: "",
    city: "",
    pincode: "",
    photo_url: "",
    video_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: String(lat),
      longitude: String(lng),
    }));
  };

  const handleAddressGeocoded = (geoDetails) => {
    if (!geoDetails) return;
    setFormData((prev) => ({
      ...prev,
      address: prev.address.trim() ? prev.address : (geoDetails.address || prev.address),
      city: prev.city.trim() ? prev.city : (geoDetails.city || prev.city),
      state: prev.state.trim() ? prev.state : (geoDetails.state || prev.state),
      pincode: prev.pincode.trim() ? prev.pincode : (geoDetails.pincode || prev.pincode),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.reporter_name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.reporter_phone.trim() || formData.reporter_phone.trim().length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg("Please provide a description of the situation.");
      return;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim()) {
      setErrorMsg("Please fill in address, city, and state details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        reporter_name: formData.reporter_name,
        reporter_phone: formData.reporter_phone,
        reporter_email: formData.reporter_email || undefined,
        description: formData.description,
        animal_type: formData.animal_type,
        animal_condition: formData.animal_condition,
        severity: formData.severity,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        state: formData.state,
        district: formData.district || undefined,
        city: formData.city,
        pincode: formData.pincode || undefined,
        photo_url: formData.photo_url || undefined,
        video_url: formData.video_url || undefined,
      };

      const res = await reportCow(payload);
      setSuccessData(res.data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit rescue report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successBadge}>✅ Report Submitted Successfully</div>
          <h2>Thank You for Reporting!</h2>
          <p className={styles.successSub}>
            Your emergency report has been registered in our central database.
          </p>

          <div className={styles.ticketDetails}>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Case ID:</span>
              <span className={styles.ticketValue}>{successData.case_id}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Initial Status:</span>
              <span className={styles.statusBadge}>{successData.status}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Submitted At:</span>
              <span>{new Date(successData.created_at).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <p className={styles.successNotice}>
            Your report has been received. Our rescue network will identify suitable verified organizations for this case.
          </p>

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
          Fill out this form to report an injured, sick, or trapped cow. Your exact location
          will help verified rescue teams find the animal quickly.
        </p>
      </div>

      {errorMsg && <div className={styles.errorAlert}>⚠️ {errorMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
        {/* 1. Reporter Information */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>👤</span> 1. Reporter Information
          </h3>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label htmlFor="reporter_name">Your Full Name *</label>
              <input
                type="text"
                id="reporter_name"
                name="reporter_name"
                placeholder="e.g. Ramesh Kumar"
                value={formData.reporter_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="reporter_phone">Mobile Number *</label>
              <input
                type="tel"
                id="reporter_phone"
                name="reporter_phone"
                placeholder="e.g. 9876543210"
                value={formData.reporter_phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reporter_email">Email Address (Optional)</label>
            <input
              type="email"
              id="reporter_email"
              name="reporter_email"
              placeholder="e.g. ramesh@example.com"
              value={formData.reporter_email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 2. Cow Condition & Severity */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>🐄</span> 2. Situation & Condition
          </h3>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label htmlFor="animal_type">Animal Type *</label>
              <input
                type="text"
                id="animal_type"
                name="animal_type"
                value={formData.animal_type}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="animal_condition">Animal Condition *</label>
              <select
                id="animal_condition"
                name="animal_condition"
                value={formData.animal_condition}
                onChange={handleChange}
                required
              >
                {ANIMAL_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="severity">Severity Level *</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              {SEVERITY_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description">Situation Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Describe what happened, visible injuries, animal appearance, and urgent needs..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        {/* 3. Location Details & Map Picker */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>📍</span> 3. Incident Location & Coordinates
          </h3>

          <MapPicker
            lat={formData.latitude}
            lng={formData.longitude}
            onChangeLocation={handleLocationChange}
            onAddressGeocoded={handleAddressGeocoded}
          />

          <div className={styles.grid2} style={{ marginTop: "16px" }}>
            <div className={styles.fieldGroup}>
              <label htmlFor="latitude">Latitude *</label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="longitude">Longitude *</label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="address">Address / Road Name *</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="e.g. Near Temple Chowk, Main Bypass Road"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.grid3}>
            <div className={styles.fieldGroup}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="e.g. Noida"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="e.g. Uttar Pradesh"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="e.g. 201301"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              name="district"
              placeholder="e.g. Gautam Buddh Nagar"
              value={formData.district}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 4. Optional Media URLs */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>📷</span> 4. Photo / Video URL (Optional)
          </h3>
          <p className={styles.uploadHint}>
            Paste a link to a photo or video of the incident (from Google Drive, Imgur, YouTube etc.)
          </p>

          <div className={styles.fieldGroup}>
            <label htmlFor="photo_url">Photo URL</label>
            <input
              type="url"
              id="photo_url"
              name="photo_url"
              placeholder="https://example.com/photo.jpg"
              value={formData.photo_url}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="video_url">Video URL</label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.video_url}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.btnSubmit}
        >
          {isSubmitting ? "Submitting Emergency Report..." : "🚨 Submit Rescue Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;