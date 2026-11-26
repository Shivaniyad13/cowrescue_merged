import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./CowRescueNgoMap.module.css";
import indiaBoundary from "./indiaBoundary";
import {
  getPublicCowRescueNGODetails,
  getPublicCowRescueNGOs,
} from "../../../services/api";

const INDIA_CENTER = [20.5937, 78.9629];
const INDIA_BOUNDS = [[7.965535, 68.176645], [35.49401, 97.402561]];
const OUTSIDE_INDIA_MASK = [[-85, -180], [-85, 180], [85, 180], [85, -180]];
const STATUS_COLORS = {
  PENDING: "#eab308",
  ACCEPTED: "#16a34a",
  REJECTED: "#dc2626",
};
const MARKER_PRIORITY = {
  ACCEPTED: 0,
  PENDING: 1,
  REJECTED: 2,
};

const formatStatus = (status) => status.charAt(0) + status.slice(1).toLowerCase();

const FitIndiaBounds = () => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(INDIA_BOUNDS, { padding: [8, 8] });
  }, [map]);
  return null;
};

const ClosePopupOnSearch = ({ searchVersion }) => {
  const map = useMap();
  useEffect(() => {
    map.closePopup();
  }, [map, searchVersion]);
  return null;
};

const NgoPopupDetails = ({ detail, error, loading, onRetry }) => {
  if (loading) return <p className={styles.popupMessage}>Loading organization details…</p>;
  if (error) {
    return (
      <div className={styles.popupMessage}>
        <p>{error}</p>
        <button type="button" className={styles.retryButton} onClick={onRetry}>Retry</button>
      </div>
    );
  }
  if (!detail) return <p className={styles.popupMessage}>Loading organization details…</p>;

  const address = [
    detail.address,
    detail.city,
    detail.district,
    detail.state,
    detail.pincode,
  ].filter(Boolean).join(", ");

  return (
    <div className={styles.popupDetails}>
      <span
        className={styles.statusBadge}
        style={{ "--status-color": STATUS_COLORS[detail.status] }}
      >
        {formatStatus(detail.status)}
      </span>
      <h3>{detail.name}</h3>
      <p><strong>Organization:</strong> {detail.organizationType}</p>
      {address && <p><strong>Address:</strong> {address}</p>}
      {detail.capacity != null && <p><strong>Capacity:</strong> {detail.capacity}</p>}
      <p>
        <strong>Services:</strong>{" "}
        {[
          detail.hasAmbulance && "Ambulance",
          detail.hasVet && "Veterinary support",
        ].filter(Boolean).join(", ") || "Not specified"}
      </p>
    </div>
  );
};

const CowRescueNgoMap = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [searchVersion, setSearchVersion] = useState(0);
  const [ngoDetails, setNgoDetails] = useState({});
  const [detailErrors, setDetailErrors] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    getPublicCowRescueNGOs({ signal: controller.signal })
      .then((result) => setNgos(Array.isArray(result.data) ? result.data : []))
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retryCount]);

  const filteredNgos = useMemo(() => {
    const query = appliedSearch.trim().toLowerCase();
    if (!query) return ngos;
    return ngos.filter((ngo) =>
      [ngo.name, ngo.organizationType, ngo.city, ngo.district, ngo.state]
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [appliedSearch, ngos]);
  const markersInRenderOrder = useMemo(
    () => [...filteredNgos].sort((left, right) => (
      MARKER_PRIORITY[left.status] - MARKER_PRIORITY[right.status]
    )),
    [filteredNgos]
  );
  const statusCounts = useMemo(
    () => filteredNgos.reduce((counts, ngo) => {
      counts[ngo.status] += 1;
      return counts;
    }, { PENDING: 0, ACCEPTED: 0, REJECTED: 0 }),
    [filteredNgos]
  );

  const fetchNgoDetails = async (ngo, force = false) => {
    const key = `${ngo.kind}:${ngo.id}`;
    if (!force && (ngoDetails[key] || loadingDetails[key])) return;

    setLoadingDetails((previous) => ({ ...previous, [key]: true }));
    setDetailErrors((previous) => ({ ...previous, [key]: "" }));
    try {
      const result = await getPublicCowRescueNGODetails(ngo.kind, ngo.id);
      setNgoDetails((previous) => ({ ...previous, [key]: result.data }));
    } catch (error) {
      setDetailErrors((previous) => ({ ...previous, [key]: error.message }));
    } finally {
      setLoadingDetails((previous) => ({ ...previous, [key]: false }));
    }
  };

  const retryDetails = (ngo) => {
    const key = `${ngo.kind}:${ngo.id}`;
    setDetailErrors((previous) => ({ ...previous, [key]: "" }));
    fetchNgoDetails(ngo, true);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(searchText);
    setSearchVersion((version) => version + 1);
  };

  return (
    <section className={styles.panel} aria-labelledby="ngo-map-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Rescue network</p>
           <h2 id="ngo-map-title">Find registered gaushalas Near you || Search by City or State </h2>
          <h2 id="ngo-map-title">NGO locations across India</h2>
        </div>
        <span className={styles.count}>{filteredNgos.length} locations</span>
      </div>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <label className={styles.visuallyHidden} htmlFor="ngo-map-search">Search NGOs</label>
        <input
          id="ngo-map-search"
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by NGO, city or state"
        />
        <button type="submit">Search</button>
      </form>

      <div className={styles.legend} aria-label="NGO status legend">
        {[
          ["PENDING", "Pending"],
          ["ACCEPTED", "Accepted"],
          ["REJECTED", "Rejected"],
        ].map(([status, label]) => (
          <span key={status}>
            <i style={{ backgroundColor: STATUS_COLORS[status] }} />
            {label} ({statusCounts[status]})
          </span>
        ))}
      </div>

      {loadError && (
        <div className={styles.mapError} role="alert">
          <span>{loadError}</span>
          <button type="button" onClick={() => {
            setLoading(true);
            setLoadError("");
            setRetryCount((count) => count + 1);
          }}>Retry</button>
        </div>
      )}
      {loading && <p className={styles.mapMessage}>Loading NGO locations…</p>}
      {!loading && !loadError && filteredNgos.length === 0 && (
        <p className={styles.mapMessage}>
          {ngos.length ? "No NGOs match that search." : "No NGOs with map locations are available yet."}
        </p>
      )}

      <div className={styles.mapFrame}>
        <MapContainer
          center={INDIA_CENTER}
          zoom={4.5}
          minZoom={3.5}
          maxZoom={18}
          zoomSnap={0.25}
          maxBounds={INDIA_BOUNDS}
          maxBoundsViscosity={1}
          scrollWheelZoom
          zoomControl
          className={styles.map}
          aria-label="Map of Cow Rescue Network organizations in India"
        >
          <FitIndiaBounds />
          <ClosePopupOnSearch searchVersion={searchVersion} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polygon
            positions={[OUTSIDE_INDIA_MASK, indiaBoundary]}
            pathOptions={{
              stroke: false,
              fillColor: "#ecfdf5",
              fillOpacity: 1,
              fillRule: "evenodd",
              interactive: false,
            }}
          />
          <Polygon
            positions={indiaBoundary}
            pathOptions={{
              color: "#15803d",
              weight: 2,
              opacity: 0.9,
              fill: false,
              interactive: false,
            }}
          />
          {markersInRenderOrder.map((ngo) => {
            const key = `${ngo.kind}:${ngo.id}`;
            const isAccepted = ngo.status === "ACCEPTED";
            return (
              <CircleMarker
                key={key}
                center={[ngo.latitude, ngo.longitude]}
                radius={isAccepted ? 7 : 10}
                pathOptions={{
                  color: isAccepted ? "#ffffff" : ngo.status === "PENDING" ? "#854d0e" : "#7f1d1d",
                  weight: isAccepted ? 1.5 : 2,
                  fillColor: STATUS_COLORS[ngo.status],
                  fillOpacity: 0.95,
                }}
                eventHandlers={{ click: () => fetchNgoDetails(ngo) }}
              >
                <Popup>
                  <NgoPopupDetails
                    detail={ngoDetails[key]}
                    error={detailErrors[key]}
                    loading={loadingDetails[key]}
                    onRetry={() => retryDetails(ngo)}
                  />
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
};

export default CowRescueNgoMap;
