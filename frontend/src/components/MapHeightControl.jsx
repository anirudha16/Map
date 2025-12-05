import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

const MapHeightControl = ({ mapRef }) => {
  const map = useMap();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
      mapWrapper.classList.add('map-minimized');
    }
  }, []);

  const handleToggle = () => {
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
      if (isExpanded) {
        mapWrapper.classList.add('map-minimized');
        setIsExpanded(false);
      } else {
        mapWrapper.classList.remove('map-minimized');
        setIsExpanded(true);
      }
      map?.invalidateSize();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '50px',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <button
        onClick={handleToggle}
        title={isExpanded ? 'Collapse map' : 'Expand map'}
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: 'white',
          border: '2px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f5f5f5';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.boxShadow = '0 1px 5px rgba(0,0,0,0.2)';
        }}
      >
        {isExpanded ? '⤡' : '⤢'}
      </button>
    </div>
  );
};

export default MapHeightControl;
