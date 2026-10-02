import React, { useEffect } from 'react';

export const SEO = ({
  title = "SQIZZY — Peanut Butter. Rethought.",
  description = "Shake. Squeeze. Drizzle. 100% slow-roasted peanuts in an anti-drip squeeze bottle. Zero stirring, zero mess.",
  canonical = "",
  schema = null
}) => {
  useEffect(() => {
    // Title
    const formattedTitle = title.includes('SQIZZY') ? title : `${title} | SQIZZY`;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMeta = (attr, key, val) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    // Standard Meta
    setMeta('name', 'description', description);
    setMeta('name', 'title', formattedTitle);

    // Open Graph
    setMeta('property', 'og:title', formattedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', 'https://sqizzy.vercel.app/og-image.jpg?v=2');

    // Twitter Card
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', 'https://sqizzy.vercel.app/og-image.jpg?v=2');

    // Canonical
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }

    // JSON-LD Structured Data
    if (schema) {
      const scriptId = 'sqizzy-structured-data';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }
  }, [title, description, canonical, schema]);

  return null;
};
