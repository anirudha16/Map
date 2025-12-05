
// import { useState, useMemo } from "react";

// const ARABIC_CATEGORIES = [
//     "بئر", "بحر", "بحيرة", "جبل", "جزيرة", "حصن", "حي", "خليج", "رأس", "رمال",
//     "ساحل", "سبخة", "سد", "سوق", "سهل", "طريق", "عين", "غابة", "قناة", "قرية",
//     "قلعة", "مخيم", "مدينة", "مرعى", "مزرعة", "مسجد", "مطعم", "ممر بين الرمال",
//     "مملحة", "منخفض صحراوي", "منزل", "مورد مياه", "موضع", "وادي", "هضبة"
// ];

// const Search = ({ locations = [] }) => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");

//     const filteredLocations = useMemo(() => {
//         return locations.filter((location) => {
//             const matchesSearch =
//                 location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.description?.toLowerCase().includes(searchTerm.toLowerCase());

//             const matchesCategory = selectedCategory
//                 ? location.placeType === selectedCategory
//                 : true;

//             return matchesSearch && matchesCategory;
//         });
//     }, [locations, searchTerm, selectedCategory]);

//     return (
//         <div className="search-container page-content">
//             {/* MAIN SEARCH BAR */}
//             <div className="search-card">
//                 <label>Search by name</label>
//                 <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
//                     <input
//                         type="text"
//                         className="search-input-main"
//                         placeholder="Try 'Central Park'"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />

//                     <button className="search-btn-main">Search</button>
//                 </div>
//             </div>

//             {/* FILTERS + RESULTS LAYOUT */}
//             <div className="search-layout">
//                 {/* LEFT FILTER PANEL */}
//                 <aside className="filter-card">
//                     <label>Search by name</label>
//                     <input
//                         className="filter-input"
//                         placeholder="Enter place name…"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />

//                     <div style={{ marginTop: "20px" }}>
//                         <label>Category</label>
//                         <select
//                             className="filter-select"
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                         >
//                             <option value="">All</option>
//                             {ARABIC_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                     {cat}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <button className="apply-btn">Apply Filters</button>
//                     <button className="reset-btn" onClick={() => {
//                         setSearchTerm("");
//                         setSelectedCategory("");
//                     }}>
//                         Reset
//                     </button>
//                 </aside>

//                 {/* RESULTS PANEL */}
//                 <main className="results-panel">
//                     <div className="results-header-box">
//                         <div className="results-count">
//                             {filteredLocations.length} Results
//                         </div>

//                         <select className="sort-select">
//                             <option>Name (A–Z)</option>
//                             <option>Name (Z–A)</option>
//                         </select>
//                     </div>

//                     {/* RESULTS LIST */}
//                     {filteredLocations.length > 0 ? (
//                         filteredLocations.map((location) => (
//                             <div key={location.id} className="result-card">
//                                 <div>
//                                     <div className="result-title">{location.name}</div>
//                                     <div className="result-coords">
//                                         {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
//                                     </div>
//                                     {location.description && (
//                                         <div className="result-description">
//                                             {location.description}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="result-card">No matching results</div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Search;
import { useState, useMemo } from "react";

const CATEGORY_OPTIONS = [
    "All",
    "City",
    "Mountain",
    "Valley",
    "Village",
    "Forest",
    "Desert",
    "Coast",
    "Water source",
    "Restaurant",
    "Mosque",
    "Hub"
];

const REGION_OPTIONS = [
    "All",
    "Central",
    "North",
    "South",
    "East",
    "West"
];

const RATING_OPTIONS = [
    "Any",
    "3+",
    "4+",
    "4.5+"
];

const Search = ({ locations = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [region, setRegion] = useState("");
    const [rating, setRating] = useState("");
    const [hasReviewsOnly, setHasReviewsOnly] = useState(false);
    const [sortBy, setSortBy] = useState("name-asc");

    const filtered = useMemo(() => {
        let result = locations.filter((loc) => {
            const matchText =
                loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchCategory = category ? loc.placeType === category : true;
            const matchRegion = region ? loc.region === region : true;
            const matchRating = rating ? parseFloat(loc.rating || 0) >= parseFloat(rating) : true;
            const matchReviews = hasReviewsOnly ? (loc.reviewCount || 0) > 0 : true;

            return matchText && matchCategory && matchRegion && matchRating && matchReviews;
        });

        if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));

        return result;
    }, [locations, searchTerm, category, region, rating, hasReviewsOnly, sortBy]);

    return (
        <div className="search-container page-content">
            <div className="search-layout-wrapper">
                {/* LEFT SIDEBAR FILTERS */}
                <aside className="filters-card">
                    <h2 className="filters-title">Filters</h2>

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

                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="filter-select"
                        >
                            {CATEGORY_OPTIONS.map((cat) => (
                                <option key={cat} value={cat === "All" ? "" : cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Region</label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="filter-select"
                        >
                            {REGION_OPTIONS.map((reg) => (
                                <option key={reg} value={reg === "All" ? "" : reg}>
                                    {reg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Rating</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="filter-select"
                        >
                            {RATING_OPTIONS.map((rat) => (
                                <option key={rat} value={rat === "Any" ? "" : rat.slice(0, -1)}>
                                    {rat}
                                </option>
                            ))}
                        </select>
                    </div>

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

                    <button className="filters-button">Apply Filters</button>
                </aside>

                {/* RIGHT SIDE RESULTS */}
                <main className="results-section">
                    <div className="results-header">
                        <h3 className="results-count">{filtered.length} Results</h3>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-dropdown"
                        >
                            <option value="name-asc">Name (A–Z)</option>
                            <option value="name-desc">Name (Z–A)</option>
                        </select>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="results-list">
                            {filtered.map((loc) => (
                                <div key={loc.id} className="results-card">
                                    <h3 className="result-title">{loc.name}</h3>
                                    <p className="result-category">{loc.placeType || "Not specified"}</p>
                                    {loc.description && (
                                        <p className="result-description">{loc.description}</p>
                                    )}
                                    <span className="result-coords">
                                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                                    </span>
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
