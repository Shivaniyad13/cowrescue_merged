import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterOrganization.module.css';
import { API_BASE_URL } from '../../services/api';

// India ke coordinates ka range check karne ka function
const isInIndia = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  // India ka bounding box (Roughly)
  return latitude >= 8.0 && latitude <= 37.0 && longitude >= 68.0 && longitude <= 97.5;
};

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [registrationCertificate, setRegistrationCertificate] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);
  const [documentError, setDocumentError] = useState('');
  
  const [formData, setFormData] = useState({
    orgName: '', orgType: '', regNumber: '', contactPerson: '', phone: '', email: '',
    password: '', address: '', city: '', state: '', pincode: '', lat: '', lng: '',
    capacity: '', hasAmbulance: false, hasVet: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDocumentChange = (setter) => (event) => {
    const file = event.target.files?.[0] || null;
    setDocumentError('');
    if (file && file.size > 5 * 1024 * 1024) {
      setDocumentError('Each verification document must be 5 MB or smaller.');
      event.target.value = '';
      setter(null);
      return;
    }
    if (file && !['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setDocumentError('Upload a PDF, JPEG, PNG, or WEBP document.');
      event.target.value = '';
      setter(null);
      return;
    }
    setter(file);
  };

  // USE MY CURRENT LOCATION with India Check
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // INDIA CHECK: Agar location India ke bahar hai toh block karein
        if (!isInIndia(latitude, longitude)) {
          alert("⚠️ Location is outside India. This service is only available within India.");
          setIsLocating(false);
          return;
        }
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();
          const addr = data.address || {};

          setFormData((prev) => ({
            ...prev,
            lat: latitude.toString(),
            lng: longitude.toString(),
            address: addr.road || addr.suburb || addr.neighbourhood || prev.address,
            city: addr.city || addr.town || addr.village || addr.county || prev.city,
            state: addr.state || prev.state,
            pincode: addr.postcode || prev.pincode
          }));
          alert("✅ Location fetched successfully!");
        } catch (error) {
          console.error("Address fetch failed", error);
          setFormData((prev) => ({ ...prev, lat: latitude.toString(), lng: longitude.toString() }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latitude = Number(formData.lat);
    const longitude = Number(formData.lng);
    
    // Validation: Coordinates zaroori hain aur India mein hone chahiye
    if (!formData.lat.trim() || !formData.lng.trim() ||
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      alert('Please click "Use My Current Location" to fetch coordinates.');
      return;
    }

    if (!isInIndia(latitude, longitude)) {
      alert("⚠️ You can only register a Gaushala located within India.");
      return;
    }

    if (documentError) return;
    setLoading(true);
    
    try {
      const registrationData = new FormData();
      registrationData.append('orgName', formData.orgName);
      registrationData.append('orgType', formData.orgType);
      registrationData.append('regNumber', formData.regNumber);
      registrationData.append('contactPerson', formData.contactPerson);
      registrationData.append('phone', formData.phone);
      registrationData.append('email', formData.email);
      registrationData.append('password', formData.password);
      registrationData.append('address', formData.address);
      registrationData.append('city', formData.city);
      registrationData.append('state', formData.state);
      registrationData.append('pincode', formData.pincode);
      registrationData.append('latitude', formData.lat);
      registrationData.append('longitude', formData.lng);
      registrationData.append('capacity', formData.capacity);
      registrationData.append('hasAmbulance', String(formData.hasAmbulance));
      registrationData.append('hasVet', String(formData.hasVet));
      
      if (registrationCertificate) {
        registrationData.append('registrationCertificate', registrationCertificate);
      }
      if (identityProof) registrationData.append('identityProof', identityProof);

      const response = await fetch(`${API_BASE_URL}/ngo/register`, {
        method: 'POST',
        body: registrationData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate('/cow-rescue/org/login', {
          replace: true,
          state: { email: formData.email.trim().toLowerCase(), notice: "Application submitted! Please wait for admin approval." }
        });
      } else {
        alert(data.error || data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/cow-rescue" className={styles.backLink}>← Back to Portal</Link>
        <h1>🤝 Join Verified Rescue Network</h1>
        <p>Register your Gaushala, NGO, or Animal Shelter to become a verified partner.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.section}>
          <h2>🏢 1. Organization Information</h2>
          <div className={styles.grid}>
            <input type="text" name="orgName" placeholder="Organization Name *" required onChange={handleChange} />
            <select name="orgType" required onChange={handleChange}>
              <option value="">Select Organization Type *</option>
              <option value="Gaushala">Gaushala</option>
              <option value="NGO">NGO</option>
              <option value="Animal Shelter">Animal Shelter</option>
            </select>
            <input type="text" name="regNumber" placeholder="Registration/License Number *" required onChange={handleChange} />
          </div>
        </div>

        <div className={styles.section}>
          <h2>📞 2. Contact Details & Credentials</h2>
          <div className={styles.grid}>
            <input type="text" name="contactPerson" placeholder="Contact Person Name *" required onChange={handleChange} />
            <input type="tel" name="phone" placeholder="Mobile Number *" required onChange={handleChange} />
            <input type="email" name="email" placeholder="Email Address *" required onChange={handleChange} />
            <input type="password" name="password" placeholder="Create a Password *" required minLength={6} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.section}>
          <h2>📍 3. Address & Exact Location</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#b45309' }}>
              ⚠️ Important: Please mention your correct Gaushala location.
            </p>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#92400e' }}>
              <strong>Option A:</strong> Type your full address below.
              <br/>
              <strong>Option B:</strong> Click "Use My Current Location" if you are physically present at the Gaushala (Only within India).
            </p>
            
            <button 
              type="button" 
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {isLocating ? "📡 Fetching Location..." : "📡 Use My Current Location"}
            </button>

            {formData.lat && formData.lng && (
              <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#16a34a', textAlign: 'center' }}>
                ✅ Location set! (Lat: {formData.lat}, Lng: {formData.lng})
              </p>
            )}
          </div>

          <div className={styles.grid}>
            <input type="text" name="address" placeholder="Full Address *" required value={formData.address} onChange={handleChange} />
            <input type="text" name="city" placeholder="City *" required value={formData.city} onChange={handleChange} />
            <input type="text" name="state" placeholder="State *" required value={formData.state} onChange={handleChange} />
            <input type="text" name="pincode" placeholder="Pincode *" required value={formData.pincode} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.section}>
          <h2>⚙️ 4. Capabilities & Capacity</h2>
          <div className={styles.grid}>
            <input type="number" name="capacity" placeholder="Max Cow Capacity *" required onChange={handleChange} />
            <div className={styles.checkboxGroup}>
              <label><input type="checkbox" name="hasAmbulance" onChange={handleChange} /> Has Ambulance?</label>
              <label><input type="checkbox" name="hasVet" onChange={handleChange} /> Has On-call Vet?</label>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>📄 5. Verification Documents</h2>
          <div className={styles.grid}>
            <div>
              <label>Registration Certificate:</label>
              <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={handleDocumentChange(setRegistrationCertificate)} />
              {registrationCertificate && <small>{registrationCertificate.name}</small>}
            </div>
            <div>
              <label>Panchayat/NGO ID Proof:</label>
              <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={handleDocumentChange(setIdentityProof)} />
              {identityProof && <small>{identityProof.name}</small>}
            </div>
          </div>
          {documentError && <p className={styles.note} role="alert">{documentError}</p>}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
};

export default RegisterOrganization;