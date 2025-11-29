import { useState, useMemo } from 'react';

const ARABIC_CATEGORIES = [
    "بئر", "بحر", "بحيرة", "جبل", "جزيرة", "حصن", "حي", "خليج", "رأس", "رمال",
    "ساحل", "سبخة", "سد", "سوق", "سهل", "طريق", "عين", "غابة", "قناة", "قرية",
    "قلعة", "مخيم", "مدينة", "مرعى", "مزرعة", "مسجد", "مطعم", "ممر بين الرمال",
    "مملحة", "منخفض صحراوي", "منزل", "مورد مياه", "موضع", "وادي", "هضبة"
];

const Search = ({ locations = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredLocations = useMemo(() => {
        return locations.filter((location) => {
            const matchesSearch = location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory ? location.placeType === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [locations, searchTerm, selectedCategory]);

    return (
        <div className="search-page" dir="rtl">
            <div className="search-header">
                <h2 className="text-2xl font-bold text-white mb-6">البحث المتقدم</h2>
            </div>

            <div className="search-layout flex flex-col md:flex-row gap-6">
                {/* Filter Sidebar (25%) */}
                <aside className="w-full md:w-1/4 bg-[#11121a] p-4 rounded-xl h-fit">
                    <div className="filter-group mb-6">
                        <label className="block text-gray-400 mb-2 text-sm">البحث بالاسم</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="أدخل اسم المكان..."
                            className="w-full bg-[#060713] border border-[#212237] rounded-lg p-2 text-white focus:outline-none focus:border-[#5c7cfa]"
                        />
                    </div>

                    <div className="filter-group">
                        <label className="block text-gray-400 mb-2 text-sm">الفئة</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-[#060713] border border-[#212237] rounded-lg p-2 text-white focus:outline-none focus:border-[#5c7cfa]"
                        >
                            <option value="">كل الفئات</option>
                            {ARABIC_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </aside>

                {/* Results Area (75%) */}
                <main className="w-full md:w-3/4">
                    <div className="results-header mb-4 text-gray-400 text-sm">
                        تم العثور على {filteredLocations.length} نتيجة
                    </div>

                    <div className="results-grid grid grid-cols-1 gap-4">
                        {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                                <div key={location.id} className="result-card bg-[#11121a] p-4 rounded-xl flex justify-between items-center hover:bg-[#161725] transition-colors">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                                        <p className="text-sm text-gray-400">{location.placeType || 'غير محدد'}</p>
                                        {location.description && (
                                            <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{location.description}</p>
                                        )}
                                    </div>
                                    <div className="text-left ltr">
                                        <span className="text-xs text-[#5c7cfa] bg-[#5c7cfa1a] px-2 py-1 rounded">
                                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 bg-[#11121a] rounded-xl">
                                لا توجد نتائج مطابقة للبحث
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Search;
