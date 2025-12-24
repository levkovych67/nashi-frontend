/**
 * Social media platform types matching the API schema
 */
export type SocialPlatform = 
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'SPOTIFY'
  | 'APPLE_MUSIC'
  | 'YOUTUBE'
  | 'SOUNDCLOUD'
  | 'TIKTOK'
  | 'TELEGRAM'
  | 'WEBSITE'
  | 'OTHER';

/**
 * Platform detection patterns
 * Order matters - more specific domains should come first
 */
const platformPatterns: Array<{ platform: SocialPlatform; patterns: string[] }> = [
  {
    platform: 'APPLE_MUSIC',
    patterns: ['music.apple.com'],
  },
  {
    platform: 'INSTAGRAM',
    patterns: ['instagram.com', 'instagr.am', 'www.instagram.com'],
  },
  {
    platform: 'FACEBOOK',
    patterns: ['facebook.com', 'fb.com', 'fb.watch', 'www.facebook.com'],
  },
  {
    platform: 'SPOTIFY',
    patterns: ['spotify.com', 'open.spotify.com', 'www.spotify.com'],
  },
  {
    platform: 'YOUTUBE',
    patterns: ['youtube.com', 'youtu.be', 'www.youtube.com', 'm.youtube.com'],
  },
  {
    platform: 'SOUNDCLOUD',
    patterns: ['soundcloud.com', 'www.soundcloud.com'],
  },
  {
    platform: 'TIKTOK',
    patterns: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
  },
  {
    platform: 'TELEGRAM',
    patterns: ['t.me', 'telegram.me', 'telegram.org'],
  },
];

/**
 * Detects the social media platform from a URL
 * @param url - The URL string to analyze
 * @returns The detected platform type
 */
export function detectSocialPlatform(url: string): SocialPlatform {
  if (!url || typeof url !== 'string') {
    return 'OTHER';
  }

  // Normalize URL: remove protocol, trim whitespace
  const normalizedUrl = url.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '');

  // Check each platform pattern
  for (const { platform, patterns } of platformPatterns) {
    for (const pattern of patterns) {
      if (normalizedUrl.includes(pattern)) {
        return platform;
      }
    }
  }

  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (urlObj.hostname) {
      return 'WEBSITE';
    }
  } catch {
    // Not a valid URL
  }

  return 'OTHER';
}

/**
 * Platform display names for UI
 */
export const platformLabels: Record<SocialPlatform, string> = {
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  SPOTIFY: 'Spotify',
  APPLE_MUSIC: 'Apple Music',
  YOUTUBE: 'YouTube',
  SOUNDCLOUD: 'SoundCloud',
  TIKTOK: 'TikTok',
  TELEGRAM: 'Telegram',
  WEBSITE: 'Website',
  OTHER: 'Інше',
};
