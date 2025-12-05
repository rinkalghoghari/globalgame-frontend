/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://globalgames.store',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  outDir: 'public',
  exclude: ['/server-sitemap.xml', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    additionalSitemaps: [
      'https://globalgames.store/server-sitemap.xml',
    ],
  },
};
