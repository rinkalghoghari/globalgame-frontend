import Head from 'next/head';

type MetaTagsProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
};

export default function MetaTags({
  title = 'Global Games - Play Free Online Games',
  description = 'Play huge collection of free online games at Global Games. Enjoy the best HTML5 games in various categories!',
  image = '/logo2.png',
  url = 'https://globalgames.store',
  type = 'website',
  siteName = 'Global Games',
  locale = 'en_US',
  twitterCard = 'summary_large_image',
  twitterSite = '@globalgames',
  twitterCreator = '@globalgames',
}: MetaTagsProps) {
  const fullUrl = url.startsWith('http') ? url : `https://globalgames.store${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://globalgames.store/${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#4280BF" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="msapplication-TileColor" content="#4280BF" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Favicon - Handled by layout */}
    </Head>
  );
}
