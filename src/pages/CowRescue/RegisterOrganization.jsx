import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterOrganization.module.css';
import MapPicker from './components/MapPicker';

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationCertificate, setRegistrationCertificate] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);
  const [documentError, setDocumentError] = useState('');
  
  const [formData, setFormData] = useState({
    orgName: '', orgType: '', regNumber: '', contactPerson: '', phone: '', email: '',
    password: '', address: '', city: '', state: '', pincode: '', lat: '', lng: '',
    capacity: '', hasAmbulance: false, hasVet: false, bankAccount: '', ifsc: ''
  });
  const handleMapLocationChange = useCallback((lat, lng) => {
    setFormData((previous) => ({ ...previous, lat, lng }));
  }, []);
  const handleMapAddressGeocoded = useCallback((location) => {
    setFormData((previous) => ({ ...previous, ...location }));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const latitude = Number(formData.lat);
    const longitude = Number(formData.lng);
    if (!formData.lat.trim() || !formData.lng.trim() ||
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      alert('Select the Gaushala’s exact location on the map before registering.');
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
      registrationData.append('bankAccount', formData.bankAccount);
      registrationData.append('ifsc', formData.ifsc);
      if (registrationCertificate) {
        registrationData.append('registrationCertificate', registrationCertificate);
      }
      if (identityProof) registrationData.append('identityProof', identityProof);

      const response = await fetch('http://localhost:5000/api/ngo/register', {
        method: 'POST',
        body: registrationData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate('/cow-rescue/org/login', {
          replace: true,
          state: {
            email: formData.email.trim().toLowerCase(),
            notice: "Your application was submitted. Sign in now to check verification status; rescue assignments require admin approval."
          }
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
        <p>Register your Gaushala, NGO, or Animal Shelter to become a verified partner in our regional emergency cow rescue network.</p>
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
          <h2>📍 3. Address & GPS Coordinates</h2>
          <div className={styles.grid}>
            <input type="text" name="address" placeholder="Full Address *" required value={formData.address} onChange={handleChange} />
            <input type="text" name="city" placeholder="City *" required value={formData.city} onChange={handleChange} />
            <input type="text" name="state" placeholder="State *" required value={formData.state} onChange={handleChange} />
            <input type="text" name="pincode" placeholder="Pincode *" required value={formData.pincode} onChange={handleChange} />
            
          </div>
          <MapPicker
            lat={formData.lat}
            lng={formData.lng}
            onChangeLocation={handleMapLocationChange}
            onAddressGeocoded={handleMapAddressGeocoded}
          />
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
          <h2>📄 5. Verification Documents Upload</h2>
          <p className={styles.note}>Please upload clear PDF or image copies for admin verification (Max 5MB each).</p>
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

        <div className={styles.section}>
          <h2>🏦 6. Bank Account Details (Optional)</h2>
          <p className={styles.note}>Provide bank account details for future direct donation settlement payouts.</p>
          <div className={styles.grid}>
            <input type="text" name="bankAccount" placeholder="Bank Account Number" onChange={handleChange} />
            <input type="text" name="ifsc" placeholder="IFSC Code" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
};

export default RegisterOrganization;