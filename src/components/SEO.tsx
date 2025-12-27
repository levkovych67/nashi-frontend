import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  author?: string;
  locale?: string;
  structuredData?: object;
}

const DEFAULT_SEO = {
  title: 'НАШІ - Платформа української культурної спадщини',
  description: 'Відкрийте для себе українську культуру: митці, події, новини та радіо. Інтерактивна карта культурних подій України.',
  keywords: 'Україна, культура, мистецтво, події, митці, українська музика, культурна спадщина',
  ogImage: '/web-app-manifest-512x512.png',
  locale: 'uk_UA',
  author: 'НАШІ',
};

export function SEO({
  title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_SEO.ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  author = DEFAULT_SEO.author,
  locale = DEFAULT_SEO.locale,
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | НАШІ` : DEFAULT_SEO.title;
  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || finalOgTitle;
  const finalTwitterDescription = twitterDescription || finalOgDescription;
  const finalTwitterImage = twitterImage || ogImage;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph meta tags
    updateMetaTag('og:title', finalOgTitle, true);
    updateMetaTag('og:description', finalOgDescription, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:locale', locale, true);

    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}${ogImage}`;
      updateMetaTag('og:image', fullImageUrl, true);
      updateMetaTag('og:image:alt', finalOgTitle, true);
    }

    if (ogUrl) {
      updateMetaTag('og:url', ogUrl, true);
    } else {
      updateMetaTag('og:url', window.location.href, true);
    }

    // Twitter Card meta tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', finalTwitterTitle);
    updateMetaTag('twitter:description', finalTwitterDescription);

    if (finalTwitterImage) {
      const fullImageUrl = finalTwitterImage.startsWith('http')
        ? finalTwitterImage
        : `${window.location.origin}${finalTwitterImage}`;
      updateMetaTag('twitter:image', fullImageUrl);
    }

    // Canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]#structured-data');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.id = 'structured-data';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Remove structured data when component unmounts
      if (structuredData) {
        const script = document.querySelector('script[type="application/ld+json"]#structured-data');
        if (script) {
          script.remove();
        }
      }
    };
  }, [
    fullTitle,
    description,
    keywords,
    author,
    finalOgTitle,
    finalOgDescription,
    ogType,
    ogImage,
    ogUrl,
    locale,
    twitterCard,
    finalTwitterTitle,
    finalTwitterDescription,
    finalTwitterImage,
    canonicalUrl,
    structuredData,
  ]);

  return null;
}
