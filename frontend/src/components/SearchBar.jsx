import { useState } from 'react';

const SearchBar = ({
  onCoordinateSearch,
  onNameSearch,
  loading = false,
  error = '',
}) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lat && lng) {
      onCoordinateSearch({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      setLat('');
      setLng('');
      setName('');
    } else if (name.trim()) {
      onNameSearch(name.trim());
      setLat('');
      setLng('');
      setName('');
    }
  };

  return (
    <div className="search-bar">
      {/* <form className="search-row" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            type="number"
            step="0.00001"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g. 40.7128"
          />
        </div>
        <div className="input-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            type="number"
            step="0.00001"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="e.g. -74.0060"
          />
        </div>
        <button type="submit" disabled={loading}>
          Go
        </button>
      </form> */}
      <form className="search-row" onSubmit={handleSubmit}>
        <div className="input-group full-width">
          <label htmlFor="name-search">Search by name</label>
          <input
            id="name-search"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Try 'Central Park'"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default SearchBar;


