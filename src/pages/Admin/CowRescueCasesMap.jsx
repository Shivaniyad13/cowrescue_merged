import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./CowRescueCasesMap.module.css";

const INDIA_BOUNDS = [[7.965535, 68.176645], [35.49401, 97.402561]];

const statusColor = (status) => {
  if (status === "COMPLETED" || status === "RESCUED") return "#16a34a";
  if (status === "CANCELLED" || status === "PARTNER_REJECTED") return "#dc2626";
  if (status === "REPORTED" || status === "PARTNER_ALERTED") return "#f59e0b";
  return "#2563eb";
};

const FitIndiaBounds = () => {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(INDIA_BOUNDS, { padding: [12, 12] });
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
};

const CasePopup = ({ caseData, onOpenHistory }) => {
  const alerts = caseData.case_alerts || [];
  const assignedNgo = caseData.ngos;

  return (
    <div className={styles.popup}>
      <strong>{caseData.case_id}</strong>
      <div>Status: <b>{caseData.status || "REPORTED"}</b></div>
      <div>Reported by: {caseData.reporter_name || "—"}</div>
      <div>
        Assigned gaushala: {assignedNgo?.name || "Not assigned"}
        {caseData.ngo_response && ` (${caseData.ngo_response})`}
      </div>
      {alerts.some((alert) => alert.response) && (
        <div className={styles.responses}>
          {alerts.filter((alert) => alert.response).map((alert) => (
            <div key={alert.id}>
              {alert.ngos_case_alerts_ngo_idTongos?.name || "Gaushala"}: {alert.response}
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={() => onOpenHistory(caseData)}>
        View full case history
      </button>
    </div>
  );
};

const CowRescueCasesMap = ({ cases, onOpenHistory }) => {
  const mappedCases = useMemo(
    () => cases
      .filter((caseData) => (
        caseData.latitude !== null &&
        caseData.latitude !== undefined &&
        caseData.latitude !== "" &&
        caseData.longitude !== null &&
        caseData.longitude !== undefined &&
        caseData.longitude !== ""
      ))
      .map((caseData) => ({
        ...caseData,
        mapLatitude: Number(caseData.latitude),
        mapLongitude: Number(caseData.longitude),
      }))
      .filter((caseData) => (
        Number.isFinite(caseData.mapLatitude) &&
        Number.isFinite(caseData.mapLongitude)
      )),
    [cases]
  );

  return (
    <section className={styles.wrapper} aria-label="Cow rescue case map">
      <div className={styles.summary}>
        <strong>{mappedCases.length} mapped cases</strong>
        {mappedCases.length < cases.length && (
          <span>{cases.length - mappedCases.length} cases have no map coordinates.</span>
        )}
        <span>Select a marker to see its current status and gaushala responses.</span>
      </div>
      <div className={styles.mapFrame}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={4}
          minZoom={3}
          maxZoom={18}
          scrollWheelZoom
          className={styles.map}
          aria-label="Reported cow rescue cases in India"
        >
          <FitIndiaBounds />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mappedCases.map((caseData) => (
            <CircleMarker
              key={caseData.case_id}
              center={[caseData.mapLatitude, caseData.mapLongitude]}
              radius={8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: statusColor(caseData.status),
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <CasePopup caseData={caseData} onOpenHistory={onOpenHistory} />
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default CowRescueCasesMap;
