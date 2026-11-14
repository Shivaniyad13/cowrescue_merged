import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MapPicker.module.css";

const DEFAULT_LAT = 28.6139; // Default Noida/Delhi coords
const DEFAULT_LNG = 77.209;

function addDraggableMarker(map, markerRef, latitude, longitude, onChangeLocation, reverseGeocode) {
  const marker = window.L.marker([latitude, longitude], { draggable: true }).addTo(map);
  marker.on("dragend", () => {
    const position = marker.getLatLng();
    const newLat = position.lat.toFixed(6);
    const newLng = position.lng.toFixed(6);
    onChangeLocation(newLat, newLng);
    reverseGeocode(newLat, newLng);
  });
  markerRef.current = marker;
  return marker;
}

const MapPicker = ({ lat, lng, onChangeLocation, onAddressGeocoded }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const hasCoordinates =
    String(lat ?? "").trim() !== "" &&
    String(lng ?? "").trim() !== "" &&
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;
  const initialLat = hasCoordinates ? parsedLat : DEFAULT_LAT;
  const initialLng = hasCoordinates ? parsedLng : DEFAULT_LNG;

  const triggerReverseGeocode = useCallback(async (latitude, longitude) => {
    if (!onAddressGeocoded) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      if (data && data.address) {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.suburb ||
          data.address.county ||
          "";
        const state =
          data.address.state || data.address.state_district || "";
        const pincode = data.address.postcode || "";
        const address =
          data.display_name ||
          [data.address.road, data.address.suburb, city, state]
            .filter(Boolean)
            .join(", ");
        onAddressGeocoded({ address, city, state, pincode });
      }
    } catch (err) {
      console.warn("Reverse Geocode Warning:", err.message);
    }
  }, [onAddressGeocoded]);

  useEffect(() => {
    let isMounted = true;

    // Dynamically inject Leaflet CSS & JS if not already loaded
    const loadLeaflet = async () => {
      if (window.L) {
        if (isMounted) setMapLoaded(true);
        return;
      }

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          if (isMounted) setMapLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        const checkL = setInterval(() => {
          if (window.L) {
            clearInterval(checkL);
            if (isMounted) setMapLoaded(true);
          }
        }, 100);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.L) return;

    const L = window.L;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current).setView(
        [initialLat, initialLng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", (e) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        const newLat = clickLat.toFixed(6);
        const newLng = clickLng.toFixed(6);
        const marker = markerRef.current || addDraggableMarker(
          map,
          markerRef,
          clickLat,
          clickLng,
          onChangeLocation,
          triggerReverseGeocode
        );
        marker.setLatLng([clickLat, clickLng]);
        onChangeLocation(newLat, newLng);
        triggerReverseGeocode(newLat, newLng);
      });

      mapInstanceRef.current = map;
    }

    if (hasCoordinates) {
      if (markerRef.current) {
        markerRef.current.setLatLng([initialLat, initialLng]);
      } else {
        addDraggableMarker(
          mapInstanceRef.current,
          markerRef,
          initialLat,
          initialLng,
          onChangeLocation,
          triggerReverseGeocode
        );
      }
      mapInstanceRef.current.setView([initialLat, initialLng], 13);
    }
  }, [mapLoaded, initialLat, initialLng, hasCoordinates, onChangeLocation, triggerReverseGeocode]);

  const handleGetCurrentLocation = () => {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude.toFixed(6);
        const currentLng = position.coords.longitude.toFixed(6);

        onChangeLocation(currentLat, currentLng);
        triggerReverseGeocode(currentLat, currentLng);

        if (mapInstanceRef.current && window.L) {
          if (markerRef.current) {
            markerRef.current.setLatLng([currentLat, currentLng]);
          } else {
            addDraggableMarker(
              mapInstanceRef.current,
              markerRef,
              currentLat,
              currentLng,
              onChangeLocation,
              triggerReverseGeocode
            );
          }
          mapInstanceRef.current.setView([currentLat, currentLng], 15);
        }

        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation Error:", err);
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            "Location permission denied. Please click the map to set the exact location."
          );
        } else {
          setGeoError(
            "Unable to retrieve current location. Please click the map to set the exact location."
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={styles.mapPickerWrapper}>
      <div className={styles.mapHeader}>
        <div className={styles.locationInfo}>
          <span className={styles.pinIcon}>📍</span>
          <span>
            Selected Coordinates: <strong>{hasCoordinates ? lat : "—"}</strong>,{" "}
            <strong>{hasCoordinates ? lng : "—"}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className={styles.btnGPS}
          disabled={isLocating}
        >
          {isLocating ? "⏳ Locating..." : "🎯 Use My Current Location"}
        </button>
      </div>

      {geoError && <div className={styles.geoErrorMsg}>⚠️ {geoError}</div>}

      <div className={styles.mapContainer} ref={mapContainerRef}>
        {!mapLoaded && (
          <div className={styles.mapLoading}>
            <span>🗺️</span> Loading Interactive Leaflet Map...
          </div>
        )}
      </div>
      <p className={styles.mapHint}>
        💡 Use GPS or click the map to set the exact location. Drag the marker to refine it.
      </p>
    </div>
  );
};

export default MapPicker;
