import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { seoConfig, type SupportedLanguage } from '../config/seo';
import { formatSEO, videoFormats } from '../config/formatSEO';

export const SEOHead: React.FC = () => {
    const { i18n } = useTranslation();
    const { format } = useParams<{ format?: string }>();
    const currentLang = (i18n.language in seoConfig ? i18n.language : 'en') as SupportedLanguage;

    // Check if we're on a format-specific page
    const isFormatPage = format && videoFormats.some(f => f.id === format);

    // Get SEO data based on page type
    let seo;
    if (isFormatPage && format && formatSEO[currentLang]?.[format as keyof typeof formatSEO.en]) {
        seo = formatSEO[currentLang][format as keyof typeof formatSEO.en];
    } else {
        seo = seoConfig[currentLang];
    }

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
            <meta property="og:image" content={`${siteUrl}${seoConfig[currentLang].ogImage}`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={seo.title} />
            <meta property="twitter:description" content={seo.description} />
            <meta property="twitter:image" content={`${siteUrl}${seoConfig[currentLang].ogImage}`} />

            {/* Language Alternates */}
            {Object.keys(seoConfig).map((lang) => (
                <link
                    key={lang}
                    rel="alternate"
                    hrefLang={lang}
                    href={`${siteUrl}${format ? `/convert/${format}` : ''}?lang=${lang}`}
                />
            ))}

            {/* Canonical */}
            <link rel="canonical" href={currentUrl.split('?')[0]} />
        </Helmet>
    );
};
