// import { useMemo, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import MapView from '../components/MapView';
// import SearchBar from '../components/SearchBar';
// import { getAllLocations, getLocationByName } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import Profile from './Profile';
// import Search from './Search'; // ← using the Arabic full search page

// const Dashboard = () => {
//   const { user, signOut } = useAuth();
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [searchMarker, setSearchMarker] = useState(null);
//   const [mapInstance, setMapInstance] = useState(null);
//   const [searchError, setSearchError] = useState('');
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('home');

//   const {
//     data: locations,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['locations'],
//     queryFn: getAllLocations,
//   });

//   const handleCoordinateSearch = ({ lat, lng }) => {
//     setSearchError('');
//     setSelectedLocation({
//       id: 'custom-point',
//       name: 'Custom coordinates',
//       description: 'Pinned from search box',
//       latitude: lat,
//       longitude: lng,
//       created_at: new Date().toISOString(),
//       isVirtual: true,
//     });
//     setSearchMarker({
//       id: 'custom-point',
//       latitude: lat,
//       longitude: lng,
//       name: 'Custom coordinates',
//     });

//     if (mapInstance) {
//       mapInstance.flyTo([lat, lng], 13, { duration: 1.4 });
//     }
//   };

//   const handleNameSearch = async (name) => {
//     try {
//       setSearchLoading(true);
//       setSearchError('');
//       const data = await getLocationByName(name);

//       if (!data || data.length === 0) {
//         setSearchError('No locations found.');
//         return;
//       }

//       const [firstMatch] = data;
//       setSelectedLocation(firstMatch);
//       setSearchMarker(null);

//       if (mapInstance) {
//         mapInstance.flyTo(
//           [firstMatch.latitude, firstMatch.longitude],
//           14,
//           { duration: 1.4 }
//         );
//       }
//     } catch (err) {
//       const status = err.response?.status;
//       if (status === 400) {
//         setSearchError(err.response?.data?.error || 'Invalid search request.');
//       } else if (status === 500) {
//         setSearchError('Server error. Try again later.');
//       } else {
//         setSearchError(err.response?.data?.error || 'Search failed');
//       }
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const sortedLocations = useMemo(
//     () => (locations ? [...locations] : []),
//     [locations]
//   );

//   return (
//     <>
//       {/* -------------------------------------- */}
//       {/*           MATERIAL YOU HEADER          */}
//       {/* -------------------------------------- */}
//       <div className="app-header">
//         <div>
//           <div className="header-title">Map Explorer</div>
//           <div className="header-sub">Find places and share experiences</div>
//         </div>

//         {user && (
//           <div className="header-user">
//             <span>{user.email}</span>
//             <button onClick={signOut}>Logout</button>
//           </div>
//         )}
//       </div>

//       {/* -------------------------------------- */}
//       {/*             FLOATING TABS               */}
//       {/* -------------------------------------- */}
//       <div className="app-tabs">
//         {[
//           ['home', 'Home'],
//           ['search', 'Search'],
//           ['profile', 'Profile'],
//         ].map(([key, label]) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={`app-tab-btn ${activeTab === key ? 'active' : ''}`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* -------------------------------------- */}
//       {/*            PAGE CONTENT BELOW HEADER    */}
//       {/* -------------------------------------- */}
//       <div className="page-content">
//         {activeTab === 'home' && (
//           <div className={`home-map-layout ${selectedLocation ? 'has-sidebar' : ''}`}>
//             <div className="home-map-area">
//               <div className="map-wrapper">
//                 {isLoading && <p>Loading map...</p>}
//                 {isError && <p className="error-text">{error.message}</p>}

//                 {sortedLocations && (
//                   <MapView
//                     locations={sortedLocations}
//                     onMarkerClick={(location) => {
//                       setSelectedLocation(location);
//                       if (mapInstance) {
//                         mapInstance.flyTo(
//                           [location.latitude, location.longitude],
//                           14,
//                           { duration: 1.2 }
//                         );
//                       }
//                     }}
//                     onMapReady={setMapInstance}
//                     searchMarker={searchMarker}
//                     selectedLocation={selectedLocation}
//                   />
//                 )}
//               </div>
//             </div>

//             {selectedLocation && (
//               <div className="home-sidebar">
//                 <LocationPanel
//                   location={selectedLocation}
//                   onClose={() => setSelectedLocation(null)}
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* -------------------------------------- */}
//         {/*               SEARCH PAGE               */}
//         {/* -------------------------------------- */}
//         {activeTab === 'search' && (
//           <div>
//             <SearchBar
//               onCoordinateSearch={handleCoordinateSearch}
//               onNameSearch={handleNameSearch}
//               searchError={searchError}
//               searchLoading={searchLoading}
//             />

//             {/* Arabic full-page search (advanced) */}
//             <Search locations={sortedLocations} />
//           </div>
//         )}

//         {/* -------------------------------------- */}
//         {/*               PROFILE PAGE              */}
//         {/* -------------------------------------- */}
//         {activeTab === 'profile' && <Profile />}
//       </div>
//     </>
//   );
// };

// export default Dashboard;
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import LocationPanel from "../components/LocationPanel";
import { getAllLocations, getLocationByName } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Profile from "./Profile";
import Search from "./Search";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("home");

  const { data: locations, isLoading, isError, error } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations,
  });

  const handleCoordinateSearch = ({ lat, lng }) => {
    setSearchError("");

    setSelectedLocation({
      id: "custom-point",
      name: "Custom coordinates",
      description: "Pinned from search bar",
      latitude: lat,
      longitude: lng,
      isVirtual: true,
    });

    setSearchMarker({
      id: "custom",
      latitude: lat,
      longitude: lng,
    });

    mapInstance?.flyTo([lat, lng], 13, { duration: 1.2 });
  };

  const handleNameSearch = async (name) => {
    try {
      setSearchLoading(true);
      setSearchError("");

      const data = await getLocationByName(name);

      if (!data || !data.length) {
        setSearchError("No locations found.");
        return;
      }

      const match = data[0];
      setSelectedLocation(match);
      setSearchMarker(null);

      mapInstance?.flyTo([match.latitude, match.longitude], 14, {
        duration: 1.2,
      });
    } catch (err) {
      setSearchError("Search failed.");
    } finally {
      setSearchLoading(false);
    }
  };

  const sortedLocations = useMemo(
    () => (locations ? [...locations] : []),
    [locations]
  );

  return (
    <>
      {/* ---------------- HEADER ---------------- */}
      <div className="app-header">
        <div>
          <div className="header-title">Map Explorer</div>
          <div className="header-sub">Find places and share experiences</div>
        </div>

        {user && (
          <div className="header-user">
            <span>{user.email}</span>
            <button onClick={signOut}>Logout</button>
          </div>
        )}
      </div>

      {/* ---------------- TABS ---------------- */}
      <div className="app-tabs">
        {[
          ["home", "Home"],
          ["search", "Search"],
          ["profile", "Profile"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`app-tab-btn ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- PAGE CONTENT ---------------- */}
      <div className="page-content page-content-compact">
        {/* HOME TAB */}
        {activeTab === "home" && (
          <>
            <SearchBar
              onCoordinateSearch={handleCoordinateSearch}
              onNameSearch={handleNameSearch}
              searchError={searchError}
              searchLoading={searchLoading}
            />

            <div className="home-map-layout">
              <div className="home-map-area">
                <div className="map-wrapper">
                  {isLoading && <p>Loading map...</p>}
                  {isError && <p className="error-text">{error.message}</p>}

                  <MapView
                    locations={sortedLocations}
                    onMarkerClick={(loc) => {
                      setSelectedLocation(loc);
                      mapInstance?.flyTo(
                        [loc.latitude, loc.longitude],
                        14,
                        { duration: 1.2 }
                      );
                    }}
                    searchMarker={searchMarker}
                    selectedLocation={selectedLocation}
                    onMapReady={setMapInstance}
                  />
                </div>
              </div>

              {selectedLocation && (
                <div className="home-sidebar">
                  <LocationPanel
                    location={selectedLocation}
                    onClose={() => setSelectedLocation(null)}
                    expandedFromPopup={selectedLocation?.expandedFromPopup}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <Search locations={sortedLocations} />
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="profile-tab-container">
            <Profile />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
