import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

// Custom colored-dot markers via divIcon — avoids the classic Leaflet +
// bundler broken-default-marker-image problem entirely.
function dotIcon(color, label) {
  return divIcon({
    className: "",
    html: `<div style="
        background:${color};
        width:16px;height:16px;border-radius:9999px;
        border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);
      " title="${label}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const farmerIcon = divIcon({
  className: "",
  html: `<div style="
      background:#3E2F23;width:20px;height:20px;border-radius:9999px;
      border:3px solid #E4A73B;box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 11);
    }
  }, [points, map]);
  return null;
}

export default function MapView({ farmerLocation, markets, bestMarketId }) {
  const { t } = useLanguage();
  const points = [
    [farmerLocation.latitude, farmerLocation.longitude],
    ...markets.map((m) => [m.latitude ?? m.lat, m.longitude ?? m.lng]),
  ].filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

  return (
    <div className="overflow-hidden rounded-xl2 border-2 border-soil/10 shadow-soft">
      <MapContainer
        center={[farmerLocation.latitude, farmerLocation.longitude]}
        zoom={9}
        style={{ height: "360px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />

        <Marker position={[farmerLocation.latitude, farmerLocation.longitude]} icon={farmerIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {markets.map((m) => {
          const lat = m.latitude ?? m.lat;
          const lng = m.longitude ?? m.lng;
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          const isBest = m.marketId === bestMarketId;
          return (
            <Marker
              key={m.marketId ?? m.name}
              position={[lat, lng]}
              icon={dotIcon(isBest ? "#E4A73B" : "#3E7C93", m.name)}
            >
              <Popup>
                <strong>{m.name}</strong>
                {m.price && (
                  <>
                    <br />
                    KSh {m.price.toLocaleString()} /{m.unit || "bag"}
                    <br />
                    {m.distanceKm} km {t("away")}
                    {isBest && (
                      <>
                        <br />
                        <span style={{ color: "#C78A24", fontWeight: 700 }}>★ {t("bestMarket")}</span>
                      </>
                    )}
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
