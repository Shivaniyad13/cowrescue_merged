import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const OrgDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const [treatmentPhotos, setTreatmentPhotos] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [bankForm, setBankForm] = useState({ bank_account_number: '', bank_ifsc: '' });
  const [revealedAccount, setRevealedAccount] = useState('');
  const [bankVisible, setBankVisible] = useState(false);
  const [bankBusy, setBankBusy] = useState(false);
  const [bankError, setBankError] = useState('');
  const [bankMessage, setBankMessage] = useState('');

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
    if (!photo) {
      setActionError('Choose a treatment photo before starting treatment.');
      return;
    }
    const formData = new FormData();
    formData.append('treatmentPhoto', photo);
    return runAction(
      `start-${item.case_id}`,
      (token) => startNgoTreatment(token, item.case_id, formData)
    );
  };

  const handleCompleteTreatment = (item) => {
    if (!window.confirm(`Mark treatment for ${item.case_id} as completed?`)) return;
    return runAction(
      `complete-${item.case_id}`,
      (token) => completeNgoTreatment(token, item.case_id)
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

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#14532d' }}>Welcome, {ngo.name}</h1>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>{ngo.city || 'Location not set'}{ngo.state ? `, ${ngo.state}` : ''}</p>
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

        <section aria-label="Rescue case summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {[
            ['Assigned cases', stats.totalCases],
            ['Active cases', stats.activeCases],
            ['Completed cases', stats.completedCases]
          ].map(([label, value]) => (
            <div key={label} style={cardStyle}>
              <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{label}</div>
              <strong style={{ display: 'block', marginTop: '8px', color: '#14532d', fontSize: '1.8rem' }}>{value}</strong>
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

        <section style={{ ...cardStyle, marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 16px', color: '#1f2937' }}>Rescue cases handled by your organization</h2>
          {cases.length === 0 ? (
            <p style={{ margin: 0, color: '#64748b' }}>
              No cases have been assigned yet. Accept an incoming alert to start handling a case.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 8px' }}>Case ID</th>
                    <th style={{ padding: '12px 8px' }}>Incident</th>
                    <th style={{ padding: '12px 8px' }}>Location</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((item) => (
                    <tr key={item.case_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{item.case_id}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <div>{item.animal_condition || 'Cow rescue'}</div>
                        <small style={{ color: '#64748b' }}>{item.description}</small>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {caseLocation(item)}
                        {mapLink(item) && <> · <a href={mapLink(item)} target="_blank" rel="noreferrer">Map</a></>}
                      </td>
                      <td style={{ padding: '12px 8px' }}>{(item.status || 'REPORTED').replaceAll('_', ' ')}</td>
                      <td style={{ padding: '12px 8px' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-label="Case workflow and progress" style={{ display: 'grid', gap: '16px' }}>
          {cases.map((item) => {
            const actionId = item.status === 'NGO_ASSIGNED'
              ? `start-${item.case_id}`
              : `complete-${item.case_id}`;
            const timeline = item.case_timeline || [];
            return (
              <article key={item.case_id} style={cardStyle}>
                <h2 style={{ margin: '0 0 8px', color: '#14532d' }}>{item.case_id} - Case workflow</h2>
                <p style={{ margin: '4px 0 14px', color: '#475569' }}>
                  Current status: {(item.status || 'REPORTED').replaceAll('_', ' ')}
                  {item.treatment_status ? ` · Treatment: ${item.treatment_status.replaceAll('_', ' ')}` : ''}
                </p>

                {item.status === 'NGO_ASSIGNED' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor={`photo-${item.case_id}`} style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                      Upload a treatment progress photo to start treatment
                    </label>
                    <input
                      id={`photo-${item.case_id}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => setTreatmentPhotos((current) => ({
                        ...current,
                        [item.case_id]: event.target.files?.[0] || null
                      }))}
                    />
                    <button
                      type="button"
                      disabled={busyAction === actionId || !treatmentPhotos[item.case_id]}
                      onClick={() => handleStartTreatment(item)}
                      style={{ ...primaryButtonStyle, display: 'block', marginTop: '10px', opacity: busyAction === actionId || !treatmentPhotos[item.case_id] ? 0.6 : 1 }}
                    >
                      {busyAction === actionId ? 'Saving...' : 'Start treatment'}
                    </button>
                  </div>
                )}

                {item.status === 'IN_PROGRESS' && item.treatment_status === 'UNDER_TREATMENT' && (
                  <button
                    type="button"
                    disabled={busyAction === actionId}
                    onClick={() => handleCompleteTreatment(item)}
                    style={{ ...primaryButtonStyle, marginBottom: '16px', opacity: busyAction === actionId ? 0.6 : 1 }}
                  >
                    {busyAction === actionId ? 'Saving...' : 'Mark treatment completed'}
                  </button>
                )}

                {item.status === 'COMPLETED' && (
                  <p style={{ color: '#166534', fontWeight: 600 }}>Treatment workflow completed.</p>
                )}

                <h3 style={{ margin: '8px 0', fontSize: '1rem' }}>Progress history</h3>
                {timeline.length === 0 ? (
                  <p style={{ margin: 0, color: '#64748b' }}>No workflow updates have been recorded yet.</p>
                ) : (
                  <ol style={{ margin: 0, paddingLeft: '22px', color: '#475569' }}>
                    {timeline.map((entry, index) => {
                      const photoUrl = entry.metadata?.treatment_photo_url;
                      return (
                        <li key={`${entry.event}-${entry.created_at || index}`} style={{ marginBottom: '10px' }}>
                          <strong>{(entry.event || 'UPDATE').replaceAll('_', ' ')}</strong>
                          {entry.created_at && <> · {new Date(entry.created_at).toLocaleString()}</>}
                          {entry.description && <div>{entry.description}</div>}
                          {photoUrl && <div><a href={photoUrl} target="_blank" rel="noreferrer">View treatment photo</a></div>}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default OrgDashboard;
