import React from 'react';

const ResultsPanel = ({ isLoading, isError, data, sort, onSortChange, onToggleFavorite }) => {
    if (isLoading) {
        return (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ color: 'var(--text-light)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>
                    Loading results...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div className="error-text">Something went wrong while fetching places.</div>
            </div>
        );
    }

    const results = data || [];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {/* Header Card */}
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
                    <div>
                        <h2 style={{
                            fontSize: 'var(--font-size-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--text-dark)',
                            margin: 0
                        }}>
                            {results.length} {results.length === 1 ? 'Result' : 'Results'}
                        </h2>
                        <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-light)',
                            margin: 'var(--space-xs) 0 0 0'
                        }}>
                            Found matching your filters
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <label style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-medium)',
                            fontWeight: 'var(--font-weight-medium)'
                        }}>
                            Sort by
                        </label>
                        <select
                            value={sort}
                            onChange={(e) => onSortChange(e.target.value)}
                            style={{
                                padding: 'var(--space-sm) var(--space-lg)',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                fontSize: 'var(--font-size-sm)',
                                fontFamily: 'var(--font-family)',
                                fontWeight: 'var(--font-weight-medium)',
                                minWidth: '180px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="name_asc">Name (A–Z)</option>
                            <option value="name_desc">Name (Z–A)</option>
                            <option value="rating_desc">Highest rating</option>
                            <option value="reviews_desc">Most reviewed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            {results.length === 0 ? (
                <div className="card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-5xl)',
                    textAlign: 'center'
                }}>
                    <svg style={{ width: '80px', height: '80px', color: 'var(--border-dark)', marginBottom: 'var(--space-xl)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--text-dark)',
                        marginBottom: 'var(--space-sm)'
                    }}>
                        No places found
                    </h3>
                    <p style={{
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--text-light)',
                        marginBottom: 'var(--space-2xl)'
                    }}>
                        Try adjusting your search criteria
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {results.map((place) => (
                        <div
                            key={place.id}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.borderColor = 'var(--primary-light)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow)';
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                            }}
                            onClick={() => console.log("Selected place", place.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-xl)' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--text-dark)',
                                        marginBottom: 'var(--space-md)',
                                        transition: 'color var(--transition-base)'
                                    }}>
                                        {place.Name}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                                        {place.PlaceType && (
                                            <span style={{
                                                padding: 'var(--space-xs) var(--space-md)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: 'var(--font-size-xs)',
                                                fontWeight: 'var(--font-weight-medium)',
                                                background: 'var(--primary-lighter)',
                                                color: 'var(--primary-dark)',
                                                border: '1px solid var(--primary-light)'
                                            }}>
                                                {place.PlaceType}
                                            </span>
                                        )}
                                        {place.Latitude && place.Longitude && (
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)',
                                                color: 'var(--text-light)',
                                                fontFamily: 'monospace',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-xs)'
                                            }}>
                                                <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {place.Latitude.toFixed(4)}, {place.Longitude.toFixed(4)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-xs)' }}>
                                    {onToggleFavorite && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleFavorite(place.id);
                                            }}
                                            style={{
                                                fontSize: '24px',
                                                color: place.isFavorite ? '#FFD700' : '#999',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            title={place.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            {place.isFavorite ? '★' : '☆'}
                                        </button>
                                    )}
                                    {(place.average_rating || place.review_count) && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-xs)' }}>
                                            {place.average_rating && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                                    <span style={{
                                                        fontSize: 'var(--font-size-lg)',
                                                        fontWeight: 'var(--font-weight-bold)',
                                                        color: 'var(--text-dark)'
                                                    }}>
                                                        {place.average_rating.toFixed(1)}
                                                    </span>
                                                    <svg style={{ width: '16px', height: '16px', fill: '#F59E0B' }} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {place.review_count > 0 && (
                                                <span style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: 'var(--text-light)'
                                                }}>
                                                    {place.review_count} {place.review_count === 1 ? 'review' : 'reviews'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultsPanel;
