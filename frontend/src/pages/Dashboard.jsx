

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import LocationPanel from '../components/LocationPanel';
import { getAllLocations, getLocationByName } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SearchTab from '../components/SearchTab';
import Profile from './Profile';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const {
    data: locations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations,
  });

  const handleCoordinateSearch = ({ lat, lng }) => {
    setSearchError('');
    setSelectedLocation({
      id: 'custom-point',
      name: 'Custom coordinates',
      description: 'Pinned from search box',
      latitude: lat,
      longitude: lng,
      created_at: new Date().toISOString(),
      isVirtual: true,
    });
    setSearchMarker({
      id: 'custom-point',
      latitude: lat,
      longitude: lng,
      name: 'Custom coordinates',
    });

    if (mapInstance) {
      mapInstance.flyTo([lat, lng], 13, { duration: 1.4 });
    }
  };

  const handleNameSearch = async (name) => {
    try {
      setSearchLoading(true);
      setSearchError('');
      const data = await getLocationByName(name);

      if (!data || data.length === 0) {
        setSearchError('No locations found.');
        return;
      }

      const [firstMatch] = data;
      setSelectedLocation(firstMatch);
      setSearchMarker(null);

      if (mapInstance) {
        mapInstance.flyTo(
          [firstMatch.latitude, firstMatch.longitude],
          14,
          { duration: 1.4 }
        );
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        setSearchError(err.response?.data?.error || 'Invalid search request.');
      } else if (status === 500) {
        setSearchError('Server error. Try again later.');
      } else {
        setSearchError(err.response?.data?.error || 'Search failed');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const sortedLocations = useMemo(
    () => (locations ? [...locations] : []),
    [locations]
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Map Explorer</h1>
          <p className="subtle-text">Find places and share experiences</p>
        </div>
        {user && (
          <div className="user-badge">
            <span>{user.email}</span>
            <button onClick={signOut}>Logout</button>
          </div>
        )}
      </div>

      <div className="tab-bar">
        {[
          ["home", "Home"],
          ["search", "Search"],
          ["profile", "Profile"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'home' && (
          <div className={`home-map-layout ${selectedLocation ? 'has-sidebar' : ''}`}>
            <div className="home-map-area">
              <div className="map-wrapper">
                {isLoading && <p>Loading map...</p>}
                {isError && <p className="error-text">{error.message}</p>}
                {sortedLocations && (
                  <MapView
                    locations={sortedLocations}
                    onMarkerClick={(location) => {
                      setSelectedLocation(location);
                      if (mapInstance) {
                        mapInstance.flyTo(
                          [location.latitude, location.longitude],
                          14,
                          { duration: 1.2 }
                        );
                      }
                    }}
                    onMapReady={setMapInstance}
                    searchMarker={searchMarker}
                    selectedLocation={selectedLocation}
                  />
                )}
              </div>
            </div>
            {selectedLocation && (
              <div className="home-sidebar">
                <LocationPanel
                  location={selectedLocation}
                  onClose={() => setSelectedLocation(null)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <SearchBar
              onCoordinateSearch={handleCoordinateSearch}
              onNameSearch={handleNameSearch}
              searchError={searchError}
              searchLoading={searchLoading}
            />
            <SearchTab />
          </div>
        )}

        {activeTab === 'profile' && <Profile />}
      </div>
    </div>
  );
};

export default Dashboard;
