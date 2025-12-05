import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex, isHalf) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    setRating(newRating);
  };

  const handleMouseMove = (starIndex, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHoverRating(isLeftHalf ? starIndex + 0.5 : starIndex + 1);
  };

  const renderStar = (starIndex) => {
    const displayRating = hoverRating || rating;
    const isFilled = displayRating >= starIndex + 1;
    const isHalf = displayRating >= starIndex + 0.5 && displayRating < starIndex + 1;

    return (
      <div
        key={starIndex}
        className="star-container"
        style={{
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
          fontSize: '32px',
          transition: 'transform 0.2s ease',
          transform: hoverRating && (hoverRating >= starIndex + 0.5) ? 'scale(1.15)' : 'scale(1)',
        }}
        onMouseMove={(e) => handleMouseMove(starIndex, e)}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isLeftHalf = x < rect.width / 2;
          handleStarClick(starIndex, isLeftHalf);
        }}
        onMouseLeave={() => setHoverRating(0)}
      >
        {isFilled ? (
          <FaStar color="#FFD700" />
        ) : isHalf ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <FaRegStar color="#ccc" />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                overflow: 'hidden',
                width: '50%',
              }}
            >
              <FaStar color="#FFD700" />
            </div>
          </div>
        ) : (
          <FaRegStar color="#ccc" />
        )}
      </div>
    );
  };

  return (
    <div className="star-rating-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2, 3, 4].map((starIndex) => renderStar(starIndex))}
      </div>
      <span style={{ fontSize: '14px', color: '#666', fontWeight: '500', minWidth: '30px' }}>
        {rating ? rating.toFixed(1) : 'Rate'}
      </span>
    </div>
  );
};

export default StarRating;
