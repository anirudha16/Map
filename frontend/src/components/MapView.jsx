// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet.markercluster';
// import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
// import { getPlaces } from '../services/api';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// // Create a separate component to access the map instance
// const MapController = ({ onMapReady }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (map) {
//       onMapReady(map);
//     }
//   }, [map, onMapReady]);

//   return null;
// };

// const MapView = ({
//   locations = [],
//   onMarkerClick = () => {},
//   onMapReady = () => {},
//   searchMarker = null,
// }) => {
//   const defaultCenter = useMemo(() => {
//     if (locations.length) {
//       return [locations[0].latitude, locations[0].longitude];
//     }
//     return [17.385, 78.4867];
//   }, [locations]);

//   const mapRef = useRef(null);
//   const clusterRef = useRef(null);
//   const [mapReady, setMapReady] = useState(false);

//   const handleMapReady = (map) => {
//     mapRef.current = map;
//     setMapReady(true);
//     onMapReady(map);
//     console.log("✅ Map instance ready!");
//   };
//   useEffect(() => {
//     if (!mapReady || !mapRef.current) {
//       console.log("⏳ Waiting for map... mapReady:", mapReady, "mapRef:", !!mapRef.current);
//       return;
//     }

//     console.log("✅ Map is ready! Enabling bounding box loading...");

//     const map = mapRef.current;

//     async function loadPlacesInsideBox() {
//       const bounds = map.getBounds();

//       const ne = bounds.getNorthEast();
//       const sw = bounds.getSouthWest();

//       const minLon = sw.lng;
//       const minLat = sw.lat;
//       const maxLon = ne.lng;
//       const maxLat = ne.lat;

//       console.log("📦 Current Bounding Box:", { minLon, minLat, maxLon, maxLat });

//       try {
//         const places = await getPlaces(minLon, minLat, maxLon, maxLat); // <- You'll create this API next
//         console.log(`📌 Loaded ${places.length} places inside box`);

//         // Clear all old markers
//         if (clusterRef.current) {
//           clusterRef.current.clearLayers();
//         }

//         // Add new markers
//         places.forEach((p) => {
//           if (!p.Latitude || !p.Longitude) return;

//           const locationData = {
//             id: p.id,
//             name: p.Name,
//             description: p.Description,
//             latitude: p.Latitude,
//             longitude: p.Longitude,
//           };

//           const marker = L.marker([p.Latitude, p.Longitude])
//             .on("click", () => onMarkerClick(locationData));

//           clusterRef.current.addLayer(marker);
//         });
//       } catch (err) {
//         console.error("❌ Failed to load box places:", err);
//       }
//     }

//     // Load immediately
//     loadPlacesInsideBox();

//     // Load when map moves or zooms
//     map.on("moveend", loadPlacesInsideBox);
//     map.on("zoomend", loadPlacesInsideBox);

//     return () => {
//       map.off("moveend", loadPlacesInsideBox);
//       map.off("zoomend", loadPlacesInsideBox);
//     };
//   }, [mapReady, onMarkerClick]);


//   // useEffect(() => {
//   //   if (!mapReady || !mapRef.current) {
//   //     console.log("⏳ Waiting for map... mapReady:", mapReady, "mapRef:", !!mapRef.current);
//   //     return;
//   //   }

//   //   console.log("✅ Map is ready! Loading places...");

//   //   if (!clusterRef.current) {
//   //     clusterRef.current = L.markerClusterGroup({
//   //       chunkedLoading: true,
//   //       maxClusterRadius: 80
//   //     });
//   //     mapRef.current.addLayer(clusterRef.current);
//   //     console.log("✅ Cluster layer created");
//   //   }

//   //   async function loadPlaces() {
//   //     try {
//   //       const places = await getPlaces();
//   //       console.log(`✅ Loading ${places.length} places...`);

//   //       places.forEach((p) => {
//   //         if (!p.Latitude || !p.Longitude) {
//   //           console.log("⚠️ Skipping place without coords:", p.Name);
//   //           return;
//   //         }

//   //         const marker = L.marker([p.Latitude, p.Longitude])
//   //           .bindPopup(`
//   //             <strong>${p.Name || "Unknown"}</strong><br>
//   //             <em>${p.Description || "No description"}</em><br>
//   //             <small>City: ${p.City || "N/A"} | Province: ${p.Province || "N/A"}</small><br>
//   //             <small>Type: ${p.PlaceType || "N/A"} | Book: ${p.Book || "N/A"}</small><br>
//   //             <small>Author: ${p.Author || "N/A"}</small>
//   //           `);

//   //         clusterRef.current.addLayer(marker);
//   //       });

//   //       console.log("✅ Places loaded successfully!");
//   //     } catch (err) {
//   //       console.error("❌ Failed to load places:", err);
//   //     }
//   //   }

//   //   loadPlaces();

//   //   return () => {
//   //     if (clusterRef.current) {
//   //       clusterRef.current.clearLayers();
//   //       console.log("🧹 Cleaned up cluster layers");
//   //     }
//   //   };
//   // }, [mapReady]);
//   async function loadPlaces() {
//     try {
//       const places = await getPlaces();
//       console.log(`✅ Loading ${places.length} places...`);

//       places.forEach((p) => {
//         if (!p.Latitude || !p.Longitude) {
//           console.log("⚠️ Skipping place without coords:", p.Name);
//           return;
//         }

//         // Convert the place data to match your location format
//         const locationData = {
//           id: p.id || `place-${p.Latitude}-${p.Longitude}`,
//           name: p.Name || "Unknown",
//           description: p.Description || "No description",
//           latitude: p.Latitude,
//           longitude: p.Longitude,
//           city: p.City,
//           province: p.Province,
//           placeType: p.PlaceType,
//           book: p.Book,
//           author: p.Author,
//           created_at: p.created_at || new Date().toISOString()
//         };

//         const marker = L.marker([p.Latitude, p.Longitude])
//           .bindPopup(`
//             <strong>${p.Name || "Unknown"}</strong><br>
//             <em>${p.Description || "No description"}</em><br>
//             <small>City: ${p.City || "N/A"} | Province: ${p.Province || "N/A"}</small><br>
//             <small>Type: ${p.PlaceType || "N/A"} | Book: ${p.Book || "N/A"}</small><br>
//             <small>Author: ${p.Author || "N/A"}</small>
//           `)
//           .on('click', () => {
//             // Call the onMarkerClick handler when cluster marker is clicked
//             onMarkerClick(locationData);
//           });

//         clusterRef.current.addLayer(marker);
//       });

//       console.log("✅ Places loaded successfully!");
//     } catch (err) {
//       console.error("❌ Failed to load places:", err);
//     }
//   }

//   loadPlaces();

//   return () => {
//     if (clusterRef.current) {
//       clusterRef.current.clearLayers();
//       console.log("🧹 Cleaned up cluster layers");
//     }
//   };
// }, [mapReady, onMarkerClick]);

//   return (
//     <MapContainer
//       center={defaultCenter}
//       zoom={5}
//       className="map-container"
//       style={{ height: '100%', width: '100%' }}
//     >
//       <MapController onMapReady={handleMapReady} />
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {locations.map((location) => (
//         <Marker
//           key={location.id}
//           position={[location.latitude, location.longitude]}
//           eventHandlers={{
//             click: () => onMarkerClick(location),
//           }}
//         >
//           <Popup>
//             <strong>{location.name}</strong>
//             <p>{location.description}</p>
//           </Popup>
//         </Marker>
//       ))}
//       {searchMarker && (
//         <Marker
//           position={[searchMarker.latitude, searchMarker.longitude]}
//           eventHandlers={{
//             click: () => onMarkerClick(searchMarker),
//           }}
//         >
//           <Popup>
//             <strong>{searchMarker.name || 'Custom point'}</strong>
//             <p>
//               {searchMarker.latitude}, {searchMarker.longitude}
//             </p>
//           </Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// };

// export default MapView;
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { getPlacesInBBox } from '../services/api';   // <-- IMPORTANT: update API
import { iconMap, mapArabicToCategory } from '../utils/iconMap';
import MapHeightControl from './MapHeightControl';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a separate component to access the map instance
const MapController = ({ onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);

  return null;
};

const MIN_FETCH_ZOOM = 10; // CHANGED FOR BOUNDING BOX FETCHING

function filterByZoom(places, zoom) {
  if (zoom < 8) return [];

  if (zoom >= 8 && zoom <= 10) {
    return places.filter(() => Math.random() < 0.12);
  }

  if (zoom >= 11 && zoom <= 13) {
    return places.filter(() => Math.random() < 0.45);
  }

  return places;
}

const MapView = ({
  locations = [],
  onMarkerClick = () => { },
  onMapReady = () => { },
  searchMarker = null,
  selectedLocation = null,
}) => {
  const defaultCenter = useMemo(() => {
    if (locations.length) return [locations[0].latitude, locations[0].longitude];
    return [17.385, 78.4867];
  }, [locations]);

  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const handleMapReady = (map) => {
    mapRef.current = map;
    setMapReady(true);
    onMapReady(map);
    console.log("✅ Map instance ready!");
  };

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    console.log("🌍 Map ready → Bounding Box search enabled");

    const map = mapRef.current;

    // Create a LayerGroup for markers
    if (!markersLayerRef.current) {
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    async function loadPlacesInsideBox() {
      const currentZoom = map.getZoom();

      // Clear current markers first
      markersLayerRef.current.clearLayers();

      if (currentZoom < MIN_FETCH_ZOOM) {
        return;
      }

      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const minLon = sw.lng;
      const minLat = sw.lat;
      const maxLon = ne.lng;
      const maxLat = ne.lat;

      console.log("📦 Bounding Box:", { minLon, minLat, maxLon, maxLat });

      try {
        const fetchedData = await getPlacesInBBox(minLon, minLat, maxLon, maxLat);
        const places = filterByZoom(fetchedData, currentZoom);
        console.log(`📌 Fetched ${places.length} places in visible region`);

        // Add new markers
        places.forEach((p) => {
          if (!p.Latitude || !p.Longitude) return;

          const locationData = {
            id: p.id,
            name: p.Name,
            description: p.Description,
            latitude: p.Latitude,
            longitude: p.Longitude,
          };

          const category = mapArabicToCategory(p.PlaceType);
          const icon = iconMap[category] || iconMap.default;

          const lat = p.Latitude;
          const lon = p.Longitude;

          // 1. Create main marker
          const marker = L.marker([lat, lon], { icon });


          // CLICK-ONLY POPUP
          const clickPopup = L.popup({
            autoClose: true,
            closeOnClick: true,
            className: "hover-info-tooltip",
            offset: L.point(0, -35),
          });

          // Popup HTML
          const tooltipHtml = `
  <div style="
    padding: 8px 10px;
    direction: rtl;
    text-align: right;
    max-width: 220px;
    font-family: system-ui, sans-serif;
  ">
    <div style="font-size: 15px; font-weight: 700; margin-bottom: 4px;">
      ${p.Name}
    </div>

    <div style="
      font-size: 13px;
      color: #444;
      margin-bottom: 8px;
      line-height: 1.4;
      max-height: 50px;
      overflow: hidden;
    ">
      ${(p.Description || "").slice(0, 90)}...
    </div>

    <button 
      id="showMore-${p.id}"
      style="
        background: #6C63FF;
        border: none;
        padding: 5px 12px;
        color: white;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        width: 100px;
      "
    >
      Show More
    </button>
  </div>
`;

          // OPEN POPUP ONLY ON CLICK
          marker.on("click", () => {
            clickPopup
              .setLatLng([lat, lon])
              .setContent(tooltipHtml)
              .openOn(map);

            // Attach Show More button
            setTimeout(() => {
              const btn = document.getElementById(`showMore-${p.id}`);
              if (btn) btn.onclick = () => onMarkerClick(locationData);
            }, 50);
          });


          // Add marker to map layer
          markersLayerRef.current.addLayer(marker);
        });

      } catch (err) {
        console.error("❌ Failed to load bbox places:", err);
      }
    }

    map.on("movestart", () => {
      const tooltipEl = document.querySelector(".hover-info-tooltip");

      // If tooltip exists and mouse is over it → DO NOT CLEAR MARKERS
      if (tooltipEl && tooltipEl.matches(":hover")) {
        console.log("⛔ Prevented clearing markers while hovering tooltip");
        return;
      }

      markersLayerRef.current?.clearLayers();
    });


    // Load when map moves or zooms
    // map.on("moveend", loadPlacesInsideBox);
    map.on("zoomend", loadPlacesInsideBox);

    // Initial fetch
    loadPlacesInsideBox();

    return () => {
      map.off("moveend", loadPlacesInsideBox);
      map.off("zoomend", loadPlacesInsideBox);
    };
  }, [mapReady, onMarkerClick]);

  // Handle map resize when sidebar appears/disappears
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300);
    }
  }, [selectedLocation]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      className="map-container"
      style={{ height: '100%', width: '100%' }}
    >
      <MapController onMapReady={handleMapReady} />
      <MapHeightControl mapRef={mapRef} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Existing static markers (locations[] from props) */}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          eventHandlers={{ click: () => onMarkerClick(location) }}
        >
          <Popup>
            <strong>{location.name}</strong>
            <p>{location.description}</p>
          </Popup>
        </Marker>
      ))}

      {/* Search marker */}
      {searchMarker && (
        <Marker
          position={[searchMarker.latitude, searchMarker.longitude]}
          eventHandlers={{ click: () => onMarkerClick(searchMarker) }}
        >
          <Popup>
            <strong>{searchMarker.name || 'Custom point'}</strong>
            <p>{searchMarker.latitude}, {searchMarker.longitude}</p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
