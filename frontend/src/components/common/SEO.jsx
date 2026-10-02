import React, { useEffect } from 'react';

export const SEO = ({
  title = "SQIZZY — Peanut Butter. Rethought.",
  description = "Shake. Squeeze. Drizzle. 100% slow-roasted peanuts in an anti-drip squeeze bottle. Zero stirring, zero mess.",
  canonical = "",
  schema = null
}) => {
  useEffect(() => {
    // Title
    document.title = title.includes('SQIZZY') ? title : `${title} | SQIZZY`;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

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
