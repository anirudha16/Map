import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FiltersPanel from './search/FiltersPanel';
import ResultsPanel from './search/ResultsPanel';
import { searchPlaces } from '../services/api';

const SearchTab = () => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        placeType: '',
        region: '',
        minRating: null,
        hasReviews: false,
    });

    const [sort, setSort] = useState('name_asc');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['advanced-search', filters, sort],
        queryFn: () => searchPlaces({ ...filters, sort }),
        keepPreviousData: true,
    });

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            placeType: '',
            region: '',
            minRating: null,
            hasReviews: false,
        });
        setSort('name_asc');
    };

    return (
        <div style={{
            display: 'flex',
            gap: 'var(--space-2xl)',
            padding: 'var(--space-2xl) 0',
            maxWidth: '1400px',
            margin: '0 auto',
            animation: 'fadeIn var(--transition-slow)'
        }}>
            <FiltersPanel
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
            />
            <ResultsPanel
                isLoading={isLoading}
                isError={isError}
                data={data}
                sort={sort}
                onSortChange={setSort}
            />
        </div>
    );
};

export default SearchTab;
