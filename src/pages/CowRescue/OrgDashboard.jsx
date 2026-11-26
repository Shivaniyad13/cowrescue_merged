import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './OrgDashboard.module.css';
import {
  acceptNgoAlert,
  completeNgoTreatment,
  getNgoDashboard,
  revealNgoBankDetails,
  saveNgoBankDetails,
  startNgoTreatment
} from '../../services/api';

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
};

const primaryButtonStyle = {
  padding: '10px 16px',
  border: 0,
  borderRadius: '8px',
  background: '#166534',
  color: '#fff',
  cursor: 'pointer'
};

function notificationMessage(notifications) {
  if (!notifications) return '';
  const deliveries = [...(notifications.email || []), ...(notifications.sms || [])];
  const failures = deliveries.filter((delivery) => !delivery.success);
  if (failures.length) {
    const channels = [...new Set(failures.map((delivery) => delivery.channel))].join(' and ');
    return ` Workflow updated, but check ${channels} notification setup or delivery.`;
  }
  return ' Email and SMS notifications were accepted by their providers.';
}

function caseLocation(item) {
  return [item.address, item.city, item.state].filter(Boolean).join(', ') || 'Not provided';
}

function mapLink(item) {
  if (item.latitude == null || item.longitude == null) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(`${item.latitude},${item.longitude}`)}`;
}

function statusStyle(status, treatmentStatus) {
  if (status === 'COMPLETED' || treatmentStatus === 'COMPLETED') {
    return { label: 'Completed', className: 'completed' };
  }
  if (status === 'IN_PROGRESS' || treatmentStatus === 'UNDER_TREATMENT') {
    return { label: 'Treatment active', className: 'active' };
  }
  if (status === 'NGO_ASSIGNED') {
    return { label: 'Accepted - Treatment action', className: 'pending' };
  }
  return { label: (status || 'REPORTED').replaceAll('_', ' '), className: 'reported' };
}

const OrgDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const [treatmentPhotos, setTreatmentPhotos] = useState({});
  const [treatmentVideos, setTreatmentVideos] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [bankForm, setBankForm] = useState({ bank_account_number: '', bank_ifsc: '' });
  const [revealedAccount, setRevealedAccount] = useState('');
  const [bankVisible, setBankVisible] = useState(false);
  const [bankBusy, setBankBusy] = useState(false);
  const [bankError, setBankError] = useState('');
  const [bankMessage, setBankMessage] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [caseFilter, setCaseFilter] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('ngoToken');
    let active = true;

    if (!token) {
      navigate('/cow-rescue/org/login', { replace: true });
      return () => { active = false; };
    }

    getNgoDashboard(token)
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          localStorage.removeItem('ngoToken');
          localStorage.removeItem('ngoData');
          navigate('/cow-rescue/org/login', { replace: true });
        }
        setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [navigate, refreshKey]);

  const handleLogout = () => {
    localStorage.removeItem('ngoToken');
    localStorage.removeItem('ngoData');
    navigate('/cow-rescue/org/login');
  };

  const runAction = async (actionId, operation) => {
    const token = localStorage.getItem('ngoToken');
    setBusyAction(actionId);
    setActionError('');
    setActionMessage('');
    try {
      const result = await operation(token);
      setActionMessage(`${result.message || 'Update saved.'}${notificationMessage(result.notifications)}`);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setActionError(requestError.message || 'Could not update this case.');
    } finally {
      setBusyAction('');
    }
  };

  const handleAcceptAlert = (alert) => runAction(
    `accept-${alert.id}`,
    (token) => acceptNgoAlert(token, alert.token)
  );

  const handleStartTreatment = (item) => {
    const photo = treatmentPhotos[item.case_id];
    const video = treatmentVideos[item.case_id];
    if (!photo) {
      setActionError('Choose a treatment photo before starting treatment.');
      return;
    }
    if (!video) {
      setActionError('Choose a live treatment video before starting treatment.');
      return;
    }
    if (!navigator.geolocation) {
      setActionError('Geolocation is not supported by this browser.');
      return;
    }
    setBusyAction(`start-${item.case_id}`);
    setActionError('');
    setActionMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const formData = new FormData();
        formData.append('treatmentPhoto', photo);
        if (video) formData.append('treatmentVideo', video);
        formData.append('latitude', String(position.coords.latitude));
        formData.append('longitude', String(position.coords.longitude));
        formData.append('accuracy', String(position.coords.accuracy));
        runAction(
          `start-${item.case_id}`,
          (token) => startNgoTreatment(token, item.case_id, formData)
        );
      },
      (locationError) => {
        setBusyAction('');
        setActionError(locationError.code === 1
          ? 'Location permission is required to verify treatment at the registered Gaushala.'
          : 'Could not fetch GPS location. Please try again outdoors.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleCompleteTreatment = (item) => {
    const photo = treatmentPhotos[item.case_id];
    const video = treatmentVideos[item.case_id];
    if (!photo) {
      setActionError('Choose a completion photo before completing treatment.');
      return;
    }
    if (!video) {
      setActionError('Choose a live completion video before completing treatment.');
      return;
    }
    if (!window.confirm(`Mark treatment for ${item.case_id} as completed?`)) return;
    if (!navigator.geolocation) {
      setActionError('Geolocation is not supported by this browser.');
      return;
    }
    setBusyAction(`complete-${item.case_id}`);
    setActionError('');
    setActionMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const formData = new FormData();
        formData.append('treatmentPhoto', photo);
        if (video) formData.append('treatmentVideo', video);
        formData.append('latitude', String(position.coords.latitude));
        formData.append('longitude', String(position.coords.longitude));
        formData.append('accuracy', String(position.coords.accuracy));
        runAction(
          `complete-${item.case_id}`,
          (token) => completeNgoTreatment(token, item.case_id, formData)
        );
      },
      (locationError) => {
        setBusyAction('');
        setActionError(locationError.code === 1
          ? 'Location permission is required to verify completion at the registered Gaushala.'
          : 'Could not fetch GPS location. Please try again outdoors.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSaveBankDetails = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('ngoToken');
    setBankBusy(true);
    setBankError('');
    setBankMessage('');
    try {
      const result = await saveNgoBankDetails(token, bankForm);
      setDashboard((current) => ({ ...current, bankDetails: result.data }));
      setBankForm({ bank_account_number: '', bank_ifsc: '' });
      setRevealedAccount('');
      setBankVisible(false);
      setBankMessage(result.message || 'Bank details saved securely.');
    } catch (requestError) {
      setBankError(requestError.message || 'Could not save bank details.');
    } finally {
      setBankBusy(false);
    }
  };

  const handleToggleBankDetails = async () => {
    if (bankVisible) {
      setRevealedAccount('');
      setBankVisible(false);
      return;
    }
    const token = localStorage.getItem('ngoToken');
    setBankBusy(true);
    setBankError('');
    try {
      const result = await revealNgoBankDetails(token);
      setRevealedAccount(result.data.bank_account_number || '');
      setBankVisible(true);
    } catch (requestError) {
      setBankError(requestError.message || 'Could not reveal bank details.');
    } finally {
      setBankBusy(false);
    }
  };

  if (loading) {
    return <main style={{ padding: '48px 20px', textAlign: 'center' }}>Loading organization dashboard...</main>;
  }

  if (error) {
    return (
      <main style={{ maxWidth: '900px', margin: '40px auto', padding: '24px' }}>
        <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>
        <button onClick={handleLogout}>Return to login</button>
      </main>
    );
  }

  if (!dashboard) return null;

  const { ngo, verification, stats, cases = [], pendingAlerts = [], terms, bankDetails } = dashboard;
  const statusLabel = verification.isNetworkMember
    ? 'Verified rescue network member'
    : verification.status === 'PENDING'
      ? 'Awaiting admin verification'
      : verification.isVerified
        ? 'Verified, but not active for rescue assignments'
        : 'Not part of the verified rescue network';
  const statusColor = verification.isNetworkMember ? '#166534' : '#92400e';
  const statusBackground = verification.isNetworkMember ? '#dcfce7' : '#fef3c7';
  const selectedCase = cases.find((item) => item.case_id === selectedCaseId) || null;
  const filteredCases = cases.filter((item) => {
    if (caseFilter === 'PENDING') {
      return ['REPORTED', 'DISPATCHED', 'PARTNER_ALERTED', 'PARTNER_REJECTED'].includes(item.status);
    }
    if (caseFilter === 'ACTIVE') return item.status === 'NGO_ASSIGNED' || item.status === 'IN_PROGRESS';
    if (caseFilter === 'COMPLETED') return item.status === 'COMPLETED';
    return true;
  });

  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">🐄</div>
            <div>
              <h1 style={{ margin: 0, color: '#14532d' }}>Welcome, {ngo.name}</h1>
              <p style={{ margin: '6px 0 0', color: '#64748b' }}>{ngo.city || 'Location not set'}{ngo.state ? `, ${ngo.state}` : ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 16px', border: 0, borderRadius: '8px', background: '#dc2626', color: '#fff', cursor: 'pointer' }}>
            Sign Out
          </button>
        </header>

        <section
          aria-live="polite"
          style={{ ...cardStyle, marginBottom: '20px', background: statusBackground, color: statusColor }}
        >
          <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>{statusLabel}</h2>
          <p style={{ margin: 0 }}>
            {verification.isNetworkMember
              ? 'Your organization can receive and handle rescue assignments.'
              : 'You can use your dashboard now. Rescue assignments become available after network verification.'}
          </p>
        </section>

        <section className={styles.summaryGrid} aria-label="Rescue case summary">
          {[
            ['Total assigned', stats.totalCases, '📋'],
            ['Active rescues', stats.activeCases, '🚑'],
            ['Completed rescues', stats.completedCases, '✅']
          ].map(([label, value, icon]) => (
            <div key={label} className={styles.summaryCard}>
              <span style={{ color: '#64748b', fontWeight: 700 }}>{icon} {label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        <section aria-label="Bank details and terms" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <article style={cardStyle}>
            <h2 style={{ margin: '0 0 12px', color: '#14532d' }}>Bank Details</h2>
            <p style={{ margin: '0 0 12px', color: '#64748b' }}>
              Details are encrypted and visible only to you and authorized administrators.
            </p>
            <p style={{ margin: '0 0 12px', color: '#64748b' }}>
              Bank details are used only for eligible settlements, are never shown on public listings, and are handled under our{' '}
              <Link to="/privacy-policy" style={{ color: '#166534', fontWeight: 600 }}>Privacy Policy</Link>.
            </p>
            {bankDetails ? (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>Account:</strong> {bankVisible ? revealedAccount : bankDetails.account_number_masked}
                </p>
                <p style={{ margin: '4px 0' }}><strong>IFSC:</strong> {bankDetails.ifsc || '—'}</p>
                <button
                  type="button"
                  onClick={handleToggleBankDetails}
                  disabled={bankBusy}
                  style={{ ...primaryButtonStyle, marginTop: '6px', background: '#475569' }}
                >
                  {bankVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>No bank details have been added.</p>
            )}
            <form onSubmit={handleSaveBankDetails} style={{ display: 'grid', gap: '10px' }}>
              <label>
                Bank account number
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  value={bankForm.bank_account_number}
                  onChange={(event) => setBankForm((current) => ({
                    ...current,
                    bank_account_number: event.target.value.replace(/\D/g, '').slice(0, 18)
                  }))}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '5px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </label>
              <label>
                IFSC Code
                <input
                  type="text"
                  autoComplete="off"
                  required
                  value={bankForm.bank_ifsc}
                  onChange={(event) => setBankForm((current) => ({
                    ...current,
                    bank_ifsc: event.target.value.toUpperCase().slice(0, 11)
                  }))}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '5px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </label>
              <button type="submit" disabled={bankBusy} style={{ ...primaryButtonStyle, opacity: bankBusy ? 0.6 : 1 }}>
                {bankBusy ? 'Saving...' : bankDetails ? 'Update bank details' : 'Save bank details'}
              </button>
            </form>
            {bankError && <p role="alert" style={{ color: '#b91c1c' }}>{bankError}</p>}
            {bankMessage && <p role="status" style={{ color: '#166534' }}>{bankMessage}</p>}
          </article>

          <article style={cardStyle}>
            <h2 style={{ margin: '0 0 12px', color: '#14532d' }}>Accepted Terms</h2>
            <p style={{ margin: '4px 0' }}>
              <strong>Version:</strong> {terms?.version || 'Not recorded'}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Accepted:</strong> {terms?.accepted_at
                ? new Date(terms.accepted_at).toLocaleString('en-IN')
                : 'Not recorded'}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Status:</strong> {terms?.accepted ? 'Accepted' : 'Not accepted'}
            </p>
          </article>
        </section>

        {actionError && <p role="alert" style={{ ...cardStyle, color: '#b91c1c', marginBottom: '16px' }}>{actionError}</p>}
        {actionMessage && <p role="status" style={{ ...cardStyle, color: '#166534', marginBottom: '16px' }}>{actionMessage}</p>}

        <section aria-label="Incoming rescue alerts" style={{ ...cardStyle, marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 16px', color: '#1f2937' }}>Incoming rescue alerts</h2>
          {pendingAlerts.length === 0 ? (
            <p style={{ margin: 0, color: '#64748b' }}>There are no pending rescue alerts for your organization.</p>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {pendingAlerts.map((alert) => {
                const item = alert.cases || {};
                const actionId = `accept-${alert.id}`;
                const locationUrl = mapLink(item);
                return (
                  <article key={alert.id} style={{ border: '1px solid #fed7aa', borderRadius: '10px', padding: '16px', background: '#fff7ed' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <strong>{item.case_id || 'Rescue case'}</strong>
                      <span>{item.severity || 'MEDIUM'} priority</span>
                    </div>
                    <p style={{ margin: '10px 0 4px' }}>{item.animal_condition || 'Cow rescue'}</p>
                    <p style={{ margin: '4px 0', color: '#475569' }}>{item.description || 'No additional description.'}</p>
                    <p style={{ margin: '8px 0', color: '#475569' }}>
                      Location: {caseLocation(item)}
                      {locationUrl && <> · <a href={locationUrl} target="_blank" rel="noreferrer">Open map</a></>}
                    </p>
                    {item.photo_url && (
                      <p style={{ margin: '8px 0' }}><a href={item.photo_url} target="_blank" rel="noreferrer">View reported photo</a></p>
                    )}
                    <p style={{ margin: '8px 0', color: '#64748b', fontSize: '0.9rem' }}>
                      Reported {item.created_at ? new Date(item.created_at).toLocaleString() : 'date unavailable'}
                    </p>
                    <button
                      type="button"
                      disabled={busyAction === actionId}
                      onClick={() => handleAcceptAlert(alert)}
                      style={{ ...primaryButtonStyle, opacity: busyAction === actionId ? 0.6 : 1 }}
                    >
                      {busyAction === actionId ? 'Accepting...' : 'Accept rescue case'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section style={{ marginBottom: '20px' }} aria-label="Handled rescue cases">
          <div className={styles.caseToolbar}>
            <div>
              <h2 style={{ margin: 0, color: '#1f2937' }}>Rescue case desk</h2>
              <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Review reports, location and treatment progress.</p>
            </div>
            <div className={styles.filters}>
              {[
                ['ALL', 'All cases'],
                ['PENDING', 'Pending'],
                ['ACTIVE', 'In treatment'],
                ['COMPLETED', 'Completed']
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.filterButton} ${caseFilter === value ? styles.activeFilter : ''}`}
                  onClick={() => setCaseFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.caseGrid}>
            {filteredCases.length === 0 ? (
              <div className={styles.emptyState}>No rescue cases match this view.</div>
            ) : filteredCases.map((item) => {
              const status = statusStyle(item.status, item.treatment_status);
              const locationUrl = mapLink(item);
              const evidenceEntries = (item.case_timeline || [])
                .filter((entry) => entry.metadata?.treatment_photo_url || entry.metadata?.treatment_video_url)
                .slice()
                .reverse();
              const latestEvidence = evidenceEntries[0];
              const evidencePhoto = latestEvidence?.metadata?.treatment_photo_url;
              const evidenceVideo = latestEvidence?.metadata?.treatment_video_url;
              const evidenceLocation = latestEvidence?.metadata?.location_verification;
              return (
                <article key={item.case_id} className={styles.caseCard}>
                  <div className={styles.caseTop}>
                    <div>
                      <div style={{ color: '#14532d', fontWeight: 900, fontSize: '1.05rem' }}>{item.case_id}</div>
                      <div style={{ marginTop: '5px', color: '#475569' }}>{item.animal_condition || 'Cow rescue'}</div>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[status.className]}`}>{status.label}</span>
                  </div>

                  <div className={styles.locationRow}>
                    <span aria-hidden="true">📍</span>
                    <span>{caseLocation(item)}</span>
                  </div>
                  {locationUrl && (
                    <a className={styles.mapLink} href={locationUrl} target="_blank" rel="noreferrer">
                      Open exact rescue location
                      <span className={styles.mapTooltip}>Click to get exact location of the rescued cow</span>
                    </a>
                  )}
                  {(evidencePhoto || evidenceVideo || evidenceLocation) && (
                    <div style={{ marginTop: '14px', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                      <strong style={{ display: 'block', color: '#14532d', marginBottom: '8px' }}>Live treatment evidence</strong>
                      {evidencePhoto && (
                        <a href={evidencePhoto} target="_blank" rel="noreferrer">
                          <img
                            src={evidencePhoto}
                            alt={`Live treatment evidence for ${item.case_id}`}
                            style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginBottom: '8px' }}
                          />
                        </a>
                      )}
                      {evidenceVideo && (
                        <video
                          src={evidenceVideo}
                          controls
                          preload="metadata"
                          style={{ width: '100%', maxHeight: '220px', borderRadius: '8px', display: 'block', marginBottom: '8px' }}
                        />
                      )}
                      {evidenceLocation && (
                        <div style={{ color: '#166534', fontSize: '0.82rem' }}>
                          GPS verified: {evidenceLocation.latitude}, {evidenceLocation.longitude}
                          {evidenceLocation.distanceMeters != null ? ` (${evidenceLocation.distanceMeters} m from registered location)` : ''}
                        </div>
                      )}
                    </div>
                  )}

                  {item.status === 'NGO_ASSIGNED' && (
                    <div className={styles.cardUpload}>
                      <strong style={{ display: 'block', marginBottom: '8px', color: '#14532d' }}>Start treatment evidence</strong>
                      <label htmlFor={`card-photo-${item.case_id}`}>
                        Live treatment photo *
                      </label>
                      <input
                        id={`card-photo-${item.case_id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => setTreatmentPhotos((current) => ({
                          ...current,
                          [item.case_id]: event.target.files?.[0] || null
                        }))}
                      />
                      <label htmlFor={`card-video-${item.case_id}`}>
                        Live treatment video *
                      </label>
                      <input
                        id={`card-video-${item.case_id}`}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(event) => setTreatmentVideos((current) => ({
                          ...current,
                          [item.case_id]: event.target.files?.[0] || null
                        }))}
                      />
                      <small>
                        GPS location will be verified at the registered Gaushala.
                      </small>
                      <button
                        type="button"
                        className={styles.cardActionButton}
                        disabled={
                          busyAction === `start-${item.case_id}` ||
                          !treatmentPhotos[item.case_id] ||
                          !treatmentVideos[item.case_id]
                        }
                        onClick={() => handleStartTreatment(item)}
                      >
                        {busyAction === `start-${item.case_id}` ? 'Starting...' : 'Start treatment'}
                      </button>
                    </div>
                  )}

                  {item.status === 'IN_PROGRESS' && item.treatment_status === 'UNDER_TREATMENT' && (
                    <div className={styles.cardUpload}>
                      <strong style={{ display: 'block', marginBottom: '8px', color: '#14532d' }}>Complete treatment evidence</strong>
                      <label htmlFor={`card-completion-photo-${item.case_id}`}>
                        Completion photo *
                      </label>
                      <input
                        id={`card-completion-photo-${item.case_id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => setTreatmentPhotos((current) => ({
                          ...current,
                          [item.case_id]: event.target.files?.[0] || null
                        }))}
                      />
                      <label htmlFor={`card-completion-video-${item.case_id}`}>
                        Live completion video *
                      </label>
                      <input
                        id={`card-completion-video-${item.case_id}`}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(event) => setTreatmentVideos((current) => ({
                          ...current,
                          [item.case_id]: event.target.files?.[0] || null
                        }))}
                      />
                      <small>
                        GPS location will be verified before completion.
                      </small>
                      <button
                        type="button"
                        className={styles.cardActionButton}
                        disabled={
                          busyAction === `complete-${item.case_id}` ||
                          !treatmentPhotos[item.case_id] ||
                          !treatmentVideos[item.case_id]
                        }
                        onClick={() => handleCompleteTreatment(item)}
                      >
                        {busyAction === `complete-${item.case_id}` ? 'Completing...' : 'Mark treatment completed'}
                      </button>
                    </div>
                  )}
                  <p style={{ margin: '12px 0 0', color: '#64748b', fontSize: '0.86rem' }}>
                    Reported {item.created_at ? new Date(item.created_at).toLocaleString() : 'date unavailable'}
                  </p>
                  <div className={styles.cardActions}>
                    <button type="button" className={styles.detailsButton} onClick={() => setSelectedCaseId(item.case_id)}>
                      See full details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {selectedCase && (
          <div
            className={styles.modalBackdrop}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedCaseId(null);
            }}
          >
            <section
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`case-title-${selectedCase.case_id}`}
            >
              <header className={styles.modalHeader}>
                <div>
                  <h2 id={`case-title-${selectedCase.case_id}`} style={{ margin: 0, color: '#14532d' }}>
                    {selectedCase.case_id}
                  </h2>
                  <p style={{ margin: '5px 0 0', color: '#64748b' }}>Complete rescue and treatment record</p>
                </div>
                <button type="button" className={styles.closeButton} aria-label="Close case details" onClick={() => setSelectedCaseId(null)}>×</button>
              </header>

              <div className={styles.modalBody}>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <strong>Incident</strong>
                    <div style={{ marginTop: '6px' }}>{selectedCase.animal_condition || 'Cow rescue'}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Severity</strong>
                    <div style={{ marginTop: '6px' }}>{selectedCase.severity || 'MEDIUM'}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Reported location</strong>
                    <div style={{ marginTop: '6px' }}>{caseLocation(selectedCase)}</div>
                    {mapLink(selectedCase) && (
                      <a href={mapLink(selectedCase)} target="_blank" rel="noreferrer" className={styles.mapLink}>
                        Open exact rescue location
                        <span className={styles.mapTooltip}>Click to get exact location of the rescued cow</span>
                      </a>
                    )}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Current status</strong>
                    <div style={{ marginTop: '6px' }}>{(selectedCase.status || 'REPORTED').replaceAll('_', ' ')}</div>
                    <div>Treatment: {(selectedCase.treatment_status || 'Not started').replaceAll('_', ' ')}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Reported on</strong>
                    <div style={{ marginTop: '6px' }}>{selectedCase.created_at ? new Date(selectedCase.created_at).toLocaleString() : 'Not available'}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Completed on</strong>
                    <div style={{ marginTop: '6px' }}>{selectedCase.completed_at ? new Date(selectedCase.completed_at).toLocaleString() : 'Pending completion'}</div>
                  </div>
                </div>

                {selectedCase.description && (
                  <div className={styles.detailItem} style={{ marginTop: '12px' }}>
                    <strong>Description</strong>
                    <p style={{ margin: '6px 0 0', color: '#475569' }}>{selectedCase.description}</p>
                  </div>
                )}

                {selectedCase.photo_url && (
                  <div style={{ marginTop: '12px' }}>
                    <a href={selectedCase.photo_url} target="_blank" rel="noreferrer" className={styles.detailsButton}>
                      View reported incident photo
                    </a>
                  </div>
                )}

                <h3 style={{ margin: '22px 0 10px', color: '#1f2937' }}>Case history</h3>
                {(selectedCase.case_timeline || []).length === 0 ? (
                  <p style={{ color: '#64748b' }}>No timeline updates are available yet.</p>
                ) : (
                  <ol className={styles.timeline}>
                    {(selectedCase.case_timeline || []).map((entry, index) => {
                      const photoUrl = entry.metadata?.treatment_photo_url;
                      const videoUrl = entry.metadata?.treatment_video_url;
                      const location = entry.metadata?.location_verification;
                      return (
                        <li className={styles.timelineItem} key={`${entry.event}-${entry.created_at || index}`}>
                          <strong>{(entry.event || 'UPDATE').replaceAll('_', ' ')}</strong>
                          {entry.created_at && <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{new Date(entry.created_at).toLocaleString()}</div>}
                          {entry.description && <div style={{ marginTop: '4px' }}>{entry.description}</div>}
                          {photoUrl && <a href={photoUrl} target="_blank" rel="noreferrer">View treatment photo</a>}
                          {videoUrl && <div><a href={videoUrl} target="_blank" rel="noreferrer">View treatment video</a></div>}
                          {location?.valid && <div style={{ color: '#166534', marginTop: '4px' }}>
                            GPS verified at the registered Gaushala{location.distanceMeters != null ? ` · ${location.distanceMeters} m away` : ''}
                          </div>}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrgDashboard;
