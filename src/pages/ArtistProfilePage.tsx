import { useParams, Link } from 'react-router-dom';
import { useArtistBySlug } from '@/lib/api/hooks/useArtists';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { MapPin, Calendar, ExternalLink, Music, Users } from 'lucide-react';
import { useState } from 'react';

export function ArtistProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: artist, isLoading, error } = useArtistBySlug(slug || '');
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading mb-4">Артиста не знайдено</h1>
        <Button asChild>
          <Link to="/artists">Повернутися до списку</Link>
        </Button>
      </div>
    );
  }

  const images = artist.imageUrls || [];
  const currentImage = images[selectedImage];

  // Structured data for artist
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    description: artist.biography || artist.pressRelease,
    genre: artist.style,
    foundingDate: artist.foundationYear?.toString(),
    image: images[0],
    location: artist.city
      ? {
          '@type': 'Place',
          name: artist.city,
        }
      : undefined,
  };

  return (
    <>
      <SEO
        title={artist.name || 'Артист'}
        description={
          artist.biography || artist.pressRelease || `Профіль артиста ${artist.name} на платформі НАШІ`
        }
        keywords={`${artist.name}, український артист, ${artist.style || 'українська музика'}, ${artist.musicTags?.join(', ') || ''}`}
        ogImage={images[0]}
        structuredData={structuredData}
      />
      <div className="min-h-screen">
      {/* Hero Image */}
      {currentImage && (
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-accent/10">
          <img
            src={currentImage}
            alt={artist.name || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Main Content */}
        <div className="bg-background/80 backdrop-blur-md rounded-card border border-accent/20 p-6 md:p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{artist.name}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {artist.style && (
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{artist.style}</span>
                </div>
              )}
              {artist.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{artist.city}</span>
                </div>
              )}
              {artist.foundationYear && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{artist.foundationYear}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {artist.musicTags && artist.musicTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {artist.musicTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-secondary text-secondary-foreground font-medium text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-soft overflow-hidden border-2 transition-all ${
                    idx === selectedImage ? 'border-accent' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Biography */}
          {artist.biography && (
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">Біографія</h2>
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{artist.biography}</p>
            </div>
          )}

          {/* Press Release */}
          {artist.pressRelease && (
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">Прес-реліз</h2>
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{artist.pressRelease}</p>
            </div>
          )}

          {/* Demo Tracks */}
          {artist.demoTrackUrls && artist.demoTrackUrls.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">Демо-треки</h2>
              <div className="space-y-3">
                {artist.demoTrackUrls.map((url, idx) => (
                  <audio key={idx} controls className="w-full">
                    <source src={url} type="audio/mpeg" />
                    Ваш браузер не підтримує аудіо елемент.
                  </audio>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {artist.members && artist.members.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Учасники
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artist.members.map((member, idx) => (
                  <div key={idx} className="border border-accent/20 rounded-soft p-4">
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                    {member.city && <p className="text-xs text-muted-foreground/70 mt-1">{member.city}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {artist.socialLinks && artist.socialLinks.length > 0 && (
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-4">Соціальні мережі</h2>
              <div className="flex flex-wrap gap-3">
                {artist.socialLinks.map((link, idx) => (
                  <Button key={idx} variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.platform}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
