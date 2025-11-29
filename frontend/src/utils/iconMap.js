import L from "leaflet";

const createIcon = (name) =>
  L.icon({
    iconUrl: `/icons/${name}.svg`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
    className: "map-icon",
  });

export const iconMap = {
  water: createIcon("water"),
  desert: createIcon("desert"),
  mountain: createIcon("mountain"),
  vegetation: createIcon("vegetation"),
  settlement: createIcon("settlement"),
  coast: createIcon("coast"),
  religious: createIcon("religious"),
  road: createIcon("road"),
  market: createIcon("market"),
  fort: createIcon("fort"),
  default: createIcon("default"),
};

export const mapArabicToCategory = (placeType) => {
  if (!placeType) return 'default';

  const type = placeType.trim();
  const mapping = {
    // Water
    'بحر': 'water', 'بحيرة': 'water', 'خليج': 'water', 'قناة': 'water', 'سد': 'water',
    'عين': 'water', 'مورد مياه': 'water', 'وادي': 'water', 'سبخة': 'water', 'مملحة': 'water',
    'بئر': 'water',

    // Desert
    'رمال': 'desert', 'منخفض صحراوي': 'desert', 'ممر بين الرمال': 'desert', 'سهل': 'desert', 'هضبة': 'desert',

    // Mountain
    'جبل': 'mountain',

    // Vegetation
    'غابة': 'vegetation', 'مزرعة': 'vegetation', 'مرعى': 'vegetation',

    // Settlement
    'قرية': 'settlement', 'قرة': 'settlement', 'مدينة': 'settlement', 'حي': 'settlement',
    'منزل': 'settlement', 'مخيم': 'settlement', 'موضع': 'settlement',

    // Coast
    'جزيرة': 'coast', 'رأس': 'coast',

    // Religious
    'مسجد': 'religious',

    // Road
    'طريق': 'road',

    // Market
    'سوق': 'market', 'مطعم': 'market',

    // Fort
    'حصن': 'fort', 'قلعة': 'fort',
  };

  return mapping[type] || 'default';
};
