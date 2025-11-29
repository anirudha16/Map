import React from 'react';

const FiltersPanel = ({ filters, onChange, onReset }) => {
    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="card" style={{
            width: '100%',
            maxWidth: '320px',
            height: 'fit-content',
            position: 'sticky',
            top: 'var(--space-2xl)'
        }}>
            <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-dark)',
                marginBottom: 'var(--space-xl)'
            }}>
                Filters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                {/* Text Search */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <label style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-medium)'
                    }}>
                        Search by name
                    </label>
                    <input
                        type="text"
                        placeholder="Type a place name..."
                        value={filters.searchTerm}
                        onChange={(e) => handleChange('searchTerm', e.target.value)}
                        style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            fontSize: 'var(--font-size-base)',
                            fontFamily: 'var(--font-family)',
                            transition: 'all var(--transition-base)'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Place Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <label style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-medium)'
                    }}>
                        Category
                    </label>
                    <select
                        value={filters.placeType}
                        onChange={(e) => handleChange('placeType', e.target.value)}
                        style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            fontSize: 'var(--font-size-base)',
                            fontFamily: 'var(--font-family)',
                            transition: 'all var(--transition-base)'
                        }}
                    >
                        <option value="">All</option>
                        <option value="Mountain">Mountain</option>
                        <option value="Valley">Valley</option>
                        <option value="Village">Village</option>
                        <option value="City">City</option>
                        <option value="Water source">Water source</option>
                        <option value="Desert">Desert</option>
                        <option value="Forest">Forest</option>
                        <option value="Coast">Coast</option>
                    </select>
                </div>

                {/* Region */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <label style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-medium)'
                    }}>
                        Region
                    </label>
                    <select
                        value={filters.region}
                        onChange={(e) => handleChange('region', e.target.value)}
                        style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            fontSize: 'var(--font-size-base)',
                            fontFamily: 'var(--font-family)',
                            transition: 'all var(--transition-base)'
                        }}
                    >
                        <option value="">All</option>
                        <option value="Central">Central</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>

                {/* Min Rating */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <label style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-medium)'
                    }}>
                        Minimum rating
                    </label>
                    <select
                        value={filters.minRating || ''}
                        onChange={(e) => handleChange('minRating', e.target.value ? Number(e.target.value) : null)}
                        style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            fontSize: 'var(--font-size-base)',
                            fontFamily: 'var(--font-family)',
                            transition: 'all var(--transition-base)'
                        }}
                    >
                        <option value="">Any</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="4.5">4.5+</option>
                    </select>
                </div>

                {/* Has Reviews Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <input
                        type="checkbox"
                        id="hasReviews"
                        checked={filters.hasReviews}
                        onChange={(e) => handleChange('hasReviews', e.target.checked)}
                        style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: 'var(--primary)'
                        }}
                    />
                    <label htmlFor="hasReviews" style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-medium)',
                        cursor: 'pointer'
                    }}>
                        Has reviews only
                    </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                    <button
                        onClick={() => onChange(filters)}
                        style={{
                            width: '100%',
                            padding: 'var(--space-md) var(--space-xl)',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            fontWeight: 'var(--font-weight-medium)',
                            fontSize: 'var(--font-size-base)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.2)';
                        }}
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={onReset}
                        style={{
                            width: '100%',
                            padding: 'var(--space-md) var(--space-xl)',
                            background: 'var(--background)',
                            color: 'var(--text-medium)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontWeight: 'var(--font-weight-medium)',
                            fontSize: 'var(--font-size-base)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--border-light)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--background)';
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FiltersPanel;
