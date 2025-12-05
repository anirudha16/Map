
// import { useState, useMemo } from "react";

// const CATEGORY_OPTIONS = [
//     "All",
//     "City",
//     "Mountain",
//     "Valley",
//     "Village",
//     "Forest",
//     "Desert",
//     "Coast",
//     "Water source",
//     "Restaurant",
//     "Mosque",
//     "Hub"
// ];

// const REGION_OPTIONS = [
//     "All",
//     "Central",
//     "North",
//     "South",
//     "East",
//     "West"
// ];

// const RATING_OPTIONS = [
//     "Any",
//     "3+",
//     "4+",
//     "4.5+"
// ];

// const Search = ({ locations = [] }) => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [category, setCategory] = useState("");
//     const [region, setRegion] = useState("");
//     const [rating, setRating] = useState("");
//     const [hasReviewsOnly, setHasReviewsOnly] = useState(false);
//     const [sortBy, setSortBy] = useState("name-asc");

//     const filtered = useMemo(() => {
//         let result = locations.filter((loc) => {
//             const matchText =
//                 loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 loc.description?.toLowerCase().includes(searchTerm.toLowerCase());

//             const matchCategory = category ? loc.placeType === category : true;
//             const matchRegion = region ? loc.region === region : true;
//             const matchRating = rating ? parseFloat(loc.rating || 0) >= parseFloat(rating) : true;
//             const matchReviews = hasReviewsOnly ? (loc.reviewCount || 0) > 0 : true;

//             return matchText && matchCategory && matchRegion && matchRating && matchReviews;
//         });

//         if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
//         if (sortBy === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));

//         return result;
//     }, [locations, searchTerm, category, region, rating, hasReviewsOnly, sortBy]);

//     return (
//         <div className="search-container page-content">
//             <div className="search-layout-wrapper">
//                 {/* LEFT SIDEBAR FILTERS */}
//                 <aside className="filters-card">
//                     <h2 className="filters-title">Filters</h2>

//                     <div className="filter-group">
//                         <label className="filter-label">Search by name</label>
//                         <input
//                             type="text"
//                             placeholder="Type a place name..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="filter-input"
//                         />
//                     </div>

//                     <div className="filter-group">
//                         <label className="filter-label">Category</label>
//                         <select
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                             className="filter-select"
//                         >
//                             {CATEGORY_OPTIONS.map((cat) => (
//                                 <option key={cat} value={cat === "All" ? "" : cat}>
//                                     {cat}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="filter-group">
//                         <label className="filter-label">Region</label>
//                         <select
//                             value={region}
//                             onChange={(e) => setRegion(e.target.value)}
//                             className="filter-select"
//                         >
//                             {REGION_OPTIONS.map((reg) => (
//                                 <option key={reg} value={reg === "All" ? "" : reg}>
//                                     {reg}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="filter-group">
//                         <label className="filter-label">Rating</label>
//                         <select
//                             value={rating}
//                             onChange={(e) => setRating(e.target.value)}
//                             className="filter-select"
//                         >
//                             {RATING_OPTIONS.map((rat) => (
//                                 <option key={rat} value={rat === "Any" ? "" : rat.slice(0, -1)}>
//                                     {rat}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="filter-group checkbox-group">
//                         <label className="checkbox-label">
//                             <input
//                                 type="checkbox"
//                                 checked={hasReviewsOnly}
//                                 onChange={(e) => setHasReviewsOnly(e.target.checked)}
//                                 className="checkbox-input"
//                             />
//                             <span>Has reviews only</span>
//                         </label>
//                     </div>

//                     <button className="filters-button">Apply Filters</button>
//                 </aside>

//                 {/* RIGHT SIDE RESULTS */}
//                 <main className="results-section">
//                     <div className="results-header">
//                         <h3 className="results-count">{filtered.length} Results</h3>
//                         <select
//                             value={sortBy}
//                             onChange={(e) => setSortBy(e.target.value)}
//                             className="sort-dropdown"
//                         >
//                             <option value="name-asc">Name (A–Z)</option>
//                             <option value="name-desc">Name (Z–A)</option>
//                         </select>
//                     </div>

//                     {filtered.length > 0 ? (
//                         <div className="results-list">
//                             {filtered.map((loc) => (
//                                 <div key={loc.id} className="results-card">
//                                     <h3 className="result-title">{loc.name}</h3>
//                                     <p className="result-category">{loc.placeType || "Not specified"}</p>
//                                     {loc.description && (
//                                         <p className="result-description">{loc.description}</p>
//                                     )}
//                                     <span className="result-coords">
//                                         {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="results-empty">No matching results</div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Search;
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { fetchUserFavorites, toggleFavorite } from "../services/favorites";

const Search = () => {
    const { user } = useAuth();

    // FILTER STATES
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [region, setRegion] = useState("All");
    const [rating, setRating] = useState("Any");
    const [hasReviewsOnly, setHasReviewsOnly] = useState(false);
    const [sortBy, setSortBy] = useState("name-asc");

    // OPTIONS FROM DATABASE
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);

    // RESULTS FROM SUPABASE
    const [results, setResults] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // ================================
    // FETCH UNIQUE CATEGORIES (PlaceType)
    // ================================
    const fetchCategories = async () => {
        const { data } = await supabase
            .from("places")
            .select("PlaceType")
            .not("PlaceType", "is", null);

        const unique = [...new Set(data.map((item) => item.PlaceType))];
        setCategories(["All", ...unique]);
    };

    // ================================
    // FETCH UNIQUE REGIONS (City)
    // ================================
    const fetchRegions = async () => {
        const { data } = await supabase
            .from("places")
            .select("City")
            .not("City", "is", null);

        const unique = [...new Set(data.map((item) => item.City))];
        setRegions(["All", ...unique]);
    };

    // ================================
    // MAIN FILTER QUERY (Supabase View)
    // ================================
    const fetchFilteredPlaces = async () => {
        let query = supabase.from("places_with_reviews").select("*");

        // TEXT SEARCH
        if (searchTerm.trim() !== "") {
            query = query.ilike("Name", `%${searchTerm}%`);
        }

        // CATEGORY FILTER
        if (category !== "All") {
            query = query.eq("PlaceType", category);
        }

        // REGION FILTER
        if (region !== "All") {
            query = query.eq("City", region);
        }

        // RATING FILTER
        if (rating !== "Any") {
            query = query.gte("avg_rating", Number(rating));
        }

        // HAS REVIEWS ONLY
        if (hasReviewsOnly) {
            query = query.gt("review_count", 0);
        }

        const { data, error } = await query;

        if (error) {
            console.error("❌ Error fetching places:", error);
            return;
        }

        // SORTING
        if (sortBy === "name-asc") {
            data.sort((a, b) => a.Name.localeCompare(b.Name));
        } else if (sortBy === "name-desc") {
            data.sort((a, b) => b.Name.localeCompare(a.Name));
        }

        const resultsWithFavorites = data.map(place => ({
            ...place,
            isFavorite: favorites.includes(place.id),
        }));
        setResults(resultsWithFavorites);
    };

    // ================================
    // FETCH AND MERGE FAVORITES
    // ================================
    const loadFavorites = async () => {
        if (!user?.email) {
            setFavorites([]);
            return;
        }
        const favIds = await fetchUserFavorites(user.email);
        setFavorites(favIds);
    };

    const handleToggleFavorite = async (placeId) => {
        if (!user?.email) {
            console.warn('User not logged in');
            return;
        }
        const isAlreadyFavorite = favorites.includes(placeId);
        try {
            await toggleFavorite(placeId, user.email, isAlreadyFavorite);
            setFavorites(prev =>
                isAlreadyFavorite
                    ? prev.filter(id => id !== placeId)
                    : [...prev, placeId]
            );
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    // RUN FILTERS WHEN ANY FILTER CHANGES
    useEffect(() => {
        fetchFilteredPlaces();
    }, [searchTerm, category, region, rating, hasReviewsOnly, sortBy, favorites]);

    // FETCH FAVORITES WHEN USER CHANGES
    useEffect(() => {
        loadFavorites();
    }, [user?.email]);

    // FETCH DROPDOWN OPTIONS ON PAGE LOAD
    useEffect(() => {
        fetchCategories();
        fetchRegions();
    }, []);

    return (
        <div className="search-container page-content">
            <div className="search-layout-wrapper">
                
                {/* ================= LEFT FILTERS SIDEBAR ================= */}
                <aside className="filters-card">
                    <h2 className="filters-title">Filters</h2>

                    {/* SEARCH INPUT */}
                    <div className="filter-group">
                        <label className="filter-label">Search by name</label>
                        <input
                            type="text"
                            placeholder="Type a place name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input"
                        />
                    </div>

                    {/* CATEGORY DROPDOWN */}
                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="filter-select"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* REGION DROPDOWN */}
                    <div className="filter-group">
                        <label className="filter-label">Region</label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="filter-select"
                        >
                            {regions.map((reg) => (
                                <option key={reg} value={reg}>
                                    {reg}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* RATING FILTER */}
                    <div className="filter-group">
                        <label className="filter-label">Rating</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="filter-select"
                        >
                            <option value="Any">Any</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="4.5">4.5+</option>
                        </select>
                    </div>

                    {/* HAS REVIEWS ONLY */}
                    <div className="filter-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={hasReviewsOnly}
                                onChange={(e) => setHasReviewsOnly(e.target.checked)}
                                className="checkbox-input"
                            />
                            <span>Has reviews only</span>
                        </label>
                    </div>
                </aside>

                {/* ================= RIGHT RESULTS LIST ================= */}
                <main className="results-section">
                    <div className="results-header">
                        <h3 className="results-count">{results.length} Results</h3>

                        {/* SORTING */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-dropdown"
                        >
                            <option value="name-asc">Name (A–Z)</option>
                            <option value="name-desc">Name (Z–A)</option>
                        </select>
                    </div>

                    {/* RESULTS */}
                    {results.length > 0 ? (
                        <div className="results-list">
                            {results.map((loc) => (
                                <div key={loc.id} className="results-card" style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 className="result-title">{loc.Name}</h3>
                                            <p className="result-category">{loc.PlaceType || "Not specified"}</p>

                                            {loc.Description && (
                                                <p className="result-description">{loc.Description}</p>
                                            )}

                                            <span className="result-coords">
                                                {loc.Latitude?.toFixed(4)}, {loc.Longitude?.toFixed(4)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(loc.id);
                                            }}
                                            style={{
                                                fontSize: '24px',
                                                color: loc.isFavorite ? '#FFD700' : '#999',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                padding: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '44px',
                                                minHeight: '44px',
                                            }}
                                            title={loc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            {loc.isFavorite ? '★' : '☆'}
                                        </button>
                                    </div>

                                    {loc.avg_rating > 0 && (
                                        <p className="result-rating">
                                            ⭐ {loc.avg_rating.toFixed(1)} ({loc.review_count})
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="results-empty">No matching results</div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Search;
