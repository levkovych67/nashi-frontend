/**
 * Ukrainian regions (oblasts) geographic bounds and center coordinates
 * Format: [longitude, latitude] for centers
 * Bounds: [[minLng, minLat], [maxLng, maxLat]]
 */

export interface RegionBounds {
  key: string;
  center: [number, number]; // [lng, lat]
  bounds: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
  zoom: number; // Recommended zoom level
}

export const UKRAINE_REGIONS: Record<string, RegionBounds> = {
  KYIV: {
    key: 'KYIV',
    center: [30.5234, 50.4501],
    bounds: [[29.2, 49.8], [31.8, 51.5]],
    zoom: 8,
  },
  LVIV: {
    key: 'LVIV',
    center: [24.0297, 49.8397],
    bounds: [[22.5, 49.0], [25.5, 50.7]],
    zoom: 8,
  },
  ODESA: {
    key: 'ODESA',
    center: [30.7233, 46.4825],
    bounds: [[28.5, 45.2], [32.0, 47.8]],
    zoom: 8,
  },
  KHARKIV: {
    key: 'KHARKIV',
    center: [36.2304, 49.9935],
    bounds: [[35.0, 49.0], [38.0, 51.0]],
    zoom: 8,
  },
  DNIPROPETROVSK: {
    key: 'DNIPROPETROVSK',
    center: [35.0462, 48.4647],
    bounds: [[33.5, 47.5], [36.5, 49.5]],
    zoom: 8,
  },
  DONETSK: {
    key: 'DONETSK',
    center: [37.8028, 48.0159],
    bounds: [[36.5, 46.8], [39.5, 49.2]],
    zoom: 8,
  },
  ZAPORIZHZHIA: {
    key: 'ZAPORIZHZHIA',
    center: [35.1396, 47.8388],
    bounds: [[33.5, 46.5], [37.0, 48.5]],
    zoom: 8,
  },
  LUHANSK: {
    key: 'LUHANSK',
    center: [39.3078, 48.5740],
    bounds: [[37.5, 48.0], [40.2, 49.8]],
    zoom: 8,
  },
  POLTAVA: {
    key: 'POLTAVA',
    center: [34.5514, 49.5883],
    bounds: [[32.5, 48.8], [35.5, 50.5]],
    zoom: 8,
  },
  CHERKASY: {
    key: 'CHERKASY',
    center: [32.0617, 49.4445],
    bounds: [[30.5, 48.5], [33.0, 50.2]],
    zoom: 8,
  },
  CHERNIHIV: {
    key: 'CHERNIHIV',
    center: [31.2893, 51.4982],
    bounds: [[30.0, 50.5], [33.5, 52.4]],
    zoom: 8,
  },
  SUMY: {
    key: 'SUMY',
    center: [34.8008, 50.9077],
    bounds: [[32.5, 50.2], [35.5, 51.9]],
    zoom: 8,
  },
  ZHYTOMYR: {
    key: 'ZHYTOMYR',
    center: [28.6587, 50.2547],
    bounds: [[27.0, 49.5], [30.5, 51.5]],
    zoom: 8,
  },
  VINNYTSIA: {
    key: 'VINNYTSIA',
    center: [28.4682, 49.2331],
    bounds: [[26.5, 48.0], [30.0, 50.0]],
    zoom: 8,
  },
  RIVNE: {
    key: 'RIVNE',
    center: [26.2517, 50.6199],
    bounds: [[24.5, 50.0], [27.5, 51.5]],
    zoom: 8,
  },
  VOLYN: {
    key: 'VOLYN',
    center: [25.3254, 50.7472],
    bounds: [[23.5, 50.2], [26.5, 51.6]],
    zoom: 8,
  },
  KHMELNYTSKYI: {
    key: 'KHMELNYTSKYI',
    center: [26.9871, 49.4229],
    bounds: [[25.5, 48.5], [28.5, 50.5]],
    zoom: 8,
  },
  CHERNIVTSI: {
    key: 'CHERNIVTSI',
    center: [25.9358, 48.2921],
    bounds: [[25.0, 47.5], [27.0, 48.9]],
    zoom: 8,
  },
  TERNOPIL: {
    key: 'TERNOPIL',
    center: [25.5948, 49.5535],
    bounds: [[24.5, 48.8], [26.5, 50.2]],
    zoom: 8,
  },
  IVANO_FRANKIVSK: {
    key: 'IVANO_FRANKIVSK',
    center: [24.7111, 48.9226],
    bounds: [[23.5, 48.0], [26.0, 49.3]],
    zoom: 8,
  },
  ZAKARPATTIA: {
    key: 'ZAKARPATTIA',
    center: [23.2532, 48.6208],
    bounds: [[22.1, 47.9], [24.6, 49.1]],
    zoom: 8,
  },
  KIROVOHRAD: {
    key: 'KIROVOHRAD',
    center: [32.2623, 48.5079],
    bounds: [[30.5, 47.5], [33.5, 49.5]],
    zoom: 8,
  },
  MYKOLAIV: {
    key: 'MYKOLAIV',
    center: [31.9946, 46.9750],
    bounds: [[30.0, 46.0], [33.0, 48.0]],
    zoom: 8,
  },
  KHERSON: {
    key: 'KHERSON',
    center: [32.6178, 46.6354],
    bounds: [[31.0, 45.5], [34.5, 47.5]],
    zoom: 8,
  },
  CRIMEA: {
    key: 'CRIMEA',
    center: [34.1021, 45.0355],
    bounds: [[32.5, 44.4], [36.6, 46.2]],
    zoom: 8,
  },
};

/**
 * Get region bounds by key
 */
export function getRegionBounds(regionKey: string | null): RegionBounds | null {
  if (!regionKey) return null;
  return UKRAINE_REGIONS[regionKey] || null;
}
