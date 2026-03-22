import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "./App.css";

interface Station {
  aqi: string;
  lat: number;
  lon: number;
  uid: number;
  station: { name: string };
}

// 🔹 Map controller
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 6, { duration: 1.2 });
  }, [center, map]);

  return null;
}

// 🔹 AQI utils
const parseAQI = (aqi: string) => {
  const val = parseInt(aqi);
  return isNaN(val) ? 0 : val;
};

const getColor = (aqi: number) => {
  if (aqi > 300) return "#7f1d1d"; // deep red
  if (aqi > 200) return "#be123c"; // rose
  if (aqi > 150) return "#ef4444"; // red
  if (aqi > 100) return "#f97316"; // orange
  if (aqi > 50) return "#eab308"; // yellow
  return "#22c55e"; // green
};

const getHealthAdvice = (aqi: number) => {
  if (aqi > 300) return "Hazardous: Avoid all outdoor activity.";
  if (aqi > 200) return "Very Unhealthy: Stay indoors.";
  if (aqi > 150) return "Unhealthy: Wear a mask.";
  if (aqi > 100) return "Sensitive groups at risk.";
  if (aqi > 50) return "Moderate air quality.";
  return "Air quality is good.";
};

// 🔹 Legend
const Legend = () => (
  <div className="legend">
    <h4>AQI Levels</h4>
    {[
      ["#00e400", "Good"],
      ["#f7e400", "Moderate"],
      ["#ff7e00", "Sensitive"],
      ["#ff0000", "Unhealthy"],
      ["#99004c", "Very Unhealthy"],
      ["#7e0023", "Hazardous"],
    ].map(([color, label]) => (
      <div key={label}>
        <span style={{ background: color }} /> {label}
      </div>
    ))}
  </div>
);

export default function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const token = import.meta.env.VITE_WAQI_API_TOKEN;

  // 🔹 Fetch global data
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.waqi.info/v2/map/bounds/?latlng=-90,-180,90,180&token=${token}`,
        );
        const data = await res.json();
        if (data.status === "ok") setStations(data.data);
      } catch {
        console.error("Failed to fetch AQI");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobal();
  }, [token]);

  // 🔹 Debounced search
  useEffect(() => {
    if (!search) return;

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.waqi.info/v2/search/?token=${token}&keyword=${search}`,
        );
        const data = await res.json();

        if (data.status === "ok" && data.data.length > 0) {
          const first = data.data[0];
          setMapCenter([first.station.geo[0], first.station.geo[1]]);
        }
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search, token]);

  // 🔹 Geolocation (with error handling)
  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Location access denied"),
    );
  };

  // 🔹 Memoized worst stations (performance boost)
  const worstStations = useMemo(() => {
    return stations
      .filter((s) => s.aqi !== "-")
      .sort((a, b) => parseAQI(b.aqi) - parseAQI(a.aqi))
      .slice(0, 15);
  }, [stations]);

  return (
    <div className="main-layout">
      <div className="sidebar">
        <h2>🌍 AQI Dashboard</h2>

        <input
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        <button onClick={locateUser} className="locate-btn">
          📍 My Location
        </button>

        {loading && <p>Loading...</p>}

        <div className="leaderboard">
          <h3>🚨 Worst Cities</h3>

          {worstStations.map((s, i) => (
            <div
              key={s.uid}
              className={`rank-item ${selected === s.uid ? "active" : ""}`}
              onClick={() => {
                setMapCenter([s.lat, s.lon]);
                setSelected(s.uid);
              }}
            >
              <span>
                #{i + 1} {s.station.name.slice(0, 22)}
              </span>
              <b style={{ color: getColor(parseAQI(s.aqi)) }}>{s.aqi}</b>
            </div>
          ))}
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={3} className="map-view">
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
        <MapController center={mapCenter} />
        <Legend />

        <MarkerClusterGroup chunkedLoading>
          {stations.map((s) => {
            const aqi = parseAQI(s.aqi);
            const isSelected = selected === s.uid;

            return (
              <CircleMarker
                className="marker"
                key={s.uid}
                center={[s.lat, s.lon]}
                radius={isSelected ? 12 : 7}
                fillColor={getColor(aqi)}
                color={isSelected ? "#fff" : "#000"}
                weight={isSelected ? 2 : 0.5}
                fillOpacity={0.85}
                eventHandlers={{
                  click: () => setSelected(s.uid),
                }}
              >
                <Popup>
                  <b>{s.station.name}</b>
                  <br />
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "8px",
                      background: getColor(aqi),
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    AQI {s.aqi}
                  </span>
                  <br />
                  <small>{getHealthAdvice(aqi)}</small>
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
