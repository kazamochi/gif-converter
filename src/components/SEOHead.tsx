import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { seoConfig, type SupportedLanguage } from '../config/seo';

export const SEOHead: React.FC = () => {
    const { i18n } = useTranslation();
    const currentLang = (i18n.language in seoConfig ? i18n.language : 'en') as SupportedLanguage;
    const seo = seoConfig[currentLang];

    const siteUrl = window.location.origin;
    const currentUrl = window.location.href;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{seo.title}</title>
            <meta name="title" content={seo.title} />
            <meta name="description" content={seo.description} />
            <meta name="keywords" content={seo.keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={`${siteUrl}${seo.ogImage}`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={seo.title} />
            <meta property="twitter:description" content={seo.description} />
            <meta property="twitter:image" content={`${siteUrl}${seo.ogImage}`} />

            {/* Language Alternates */}
            {Object.keys(seoConfig).map((lang) => (
                <link
                    key={lang}
                    rel="alternate"
                    hrefLang={lang}
                    href={`${siteUrl}?lang=${lang}`}
                />
            ))}

            {/* Canonical */}
            <link rel="canonical" href={siteUrl} />
        </Helmet>
    );
};
