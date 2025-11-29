import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import LocationPanel from '../components/LocationPanel';
import { getAllLocations, getLocationByName } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SearchTab from '../components/SearchTab';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

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

  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
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
      </header>

      {/* Tab Navigation */}
      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      {/* Home Tab Content */}
      {activeTab === 'home' && (
        <>
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
        </>
      )}

      {/* Search Tab Content */}
      {activeTab === 'search' && (
        <div className="mt-8">
          <SearchBar
            onCoordinateSearch={handleCoordinateSearch}
            onNameSearch={handleNameSearch}
            searchError={searchError}
            searchLoading={searchLoading}
          />
          <SearchTab />
        </div>
      )}

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="profile-card">
          <h2>Profile</h2>
          <div className="profile-row">
            <strong>Email:</strong> {user?.email}
          </div>
          <button className="logout-btn" onClick={signOut}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
