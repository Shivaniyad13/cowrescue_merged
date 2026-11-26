import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './OrgLogin.module.css';
import { API_BASE_URL } from '../../services/api';

const OrgLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromQuery = new URLSearchParams(location.search).get('email');
  const [email, setEmail] = useState(location.state?.email || emailFromQuery || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ngo/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("ngoToken", data.token);
        localStorage.setItem("ngoData", JSON.stringify(data.ngo));
        
        alert("Login Successful!");
        navigate('/cow-rescue/org/dashboard'); 
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.topNav}>
          <Link to="/cow-rescue" className={styles.backLink}>← Back to Portal</Link>
        </div>
        
        <div className={styles.header}>
          <div className={styles.icon}>🏢</div>
          <h1>Gaushala / NGO Portal Login</h1>
          <p>Access your organization's emergency rescue dashboard and active dispatches.</p>
        </div>

        {location.state?.notice && <div className={styles.noticeBox}>{location.state.notice}</div>}
        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Official Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. info@gaushala.org" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password *</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span 
                className={styles.eyeIcon} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className={styles.forgotWrap}>
            <Link to="/cow-rescue/org/reset-password" className={styles.forgotLink}>Forgot Password?</Link>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Rescue Dashboard'}
          </button>
        </form>

        <div className={styles.footer}>
          Not registered yet? <Link to="/cow-rescue/register">Register your Gaushala / NGO</Link>
        </div>
      </div>
    </div>
  );
};

export default OrgLogin;