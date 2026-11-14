import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './OrgLogin.module.css'; // Same CSS use kar rahe hain

const OrgResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(() => new URLSearchParams(window.location.search).get('token') ? 2 : 1);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ngo/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setNotice(data.message || "If an organization account exists for that email, a reset link has been sent.");
        setStep(2);
      } else {
        setError(data.error || "Email not found");
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ngo/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/cow-rescue/org/login', {
          replace: true,
          state: { notice: "Password reset successfully. Please sign in with your new password." }
        });
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.topNav}>
          <Link to="/cow-rescue/org/login" className={styles.backLink}>← Back to Login</Link>
        </div>
        
        <div className={styles.header}>
          <div className={styles.icon}>🔑</div>
          <h1>Reset Password</h1>
          <p>{step === 1 ? "Enter your registered email address." : "Use the emailed reset link or enter its token and choose a new password."}</p>
        </div>

        {notice && <div className={styles.noticeBox}>{notice}</div>}
        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        {step === 1 ? (
          <form onSubmit={handleCheckEmail} className={styles.form}>
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
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className={styles.form}>
            {!new URLSearchParams(window.location.search).get('token') && (
              <div className={styles.inputGroup}>
                <label>Reset Token *</label>
                <input
                  type="text"
                  placeholder="Paste the token from your reset email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
            )}
            <div className={styles.inputGroup}>
              <label>New Password *</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                minLength={6}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrgResetPassword;