import type { components } from '@/lib/api/generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];

export interface PinGroup {
  latitude: number;
  longitude: number;
  pins: MapPinDTO[];
  isStack: boolean;
}

/**
 * Groups map pins by their exact coordinates to handle overlapping markers
 * @param pins Array of map pins to group
 * @returns Array of pin groups with location and stack information
 */
export function groupPinsByLocation(pins: MapPinDTO[]): PinGroup[] {
  const groups = new Map<string, MapPinDTO[]>();

  pins.forEach((pin) => {
    if (pin.latitude == null || pin.longitude == null) return;
    
    // Create unique key from coordinates (rounded to 6 decimal places for consistency)
    const lat = pin.latitude.toFixed(6);
    const lng = pin.longitude.toFixed(6);
    const key = `${lat},${lng}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(pin);
  });

  return Array.from(groups.entries()).map(([key, pins]) => {
    const [lat, lng] = key.split(',').map(Number);
    return {
      latitude: lat,
      longitude: lng,
      pins,
      isStack: pins.length > 1,
    };
  });
}
