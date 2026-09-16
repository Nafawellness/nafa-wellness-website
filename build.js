#!/usr/bin/env node
/**
 * Nafa Wellness — zero-dependency static site builder.
 *
 * Why no framework: this site needs to be easy for a non-technical
 * owner to maintain for years with nothing more than Node.js installed.
 * A hand-rolled build avoids an npm dependency tree that can break or
 * go stale. Content lives in /data/*.json — edit those files and run
 * `node build.js` to regenerate the site in /dist.
 *
 * Templating: a tiny mustache-like engine supporting {{var}},
 * {{#each list}}...{{/each}}, and {{#if cond}}...{{/if}}.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const SRC_DIR = path.join(ROOT, 'src');
const OUT_DIR = path.join(ROOT, 'dist');

function readJSON(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

const site = readJSON('site.json');
const rawServices = readJSON('services.json');
const faq = readJSON('faq.json');
const policies = readJSON('policies.json');
const serviceIcons = require('./src/service-icons.js');

function priceLabel(options) {
  const prices = options.map((o) => o.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min}` : `From $${min}`;
}

const services = rawServices.map((s, i) => ({
  ...s,
  priceLabel: priceLabel(s.options),
  bookUrl: s.noterroBookUrl || site.booking.practitionerBookingUrl,
  iconSvg: serviceIcons[s.slug] || '',
  iconBgClass: i % 2 === 0 ? 'icon-bg-a' : 'icon-bg-b',
  photo: `/images/services/${s.slug}.jpg`,
}));
const massageServices = services.filter((s) => s.category === 'Massages');
const addonServices = services.filter((s) => s.category === 'Add-ons');

// ---- tiny template engine -------------------------------------------------

function get(ctx, key) {
  return key.split('.').reduce((o, k) => (o == null ? o : o[k]), ctx);
}

function render(tpl, ctx) {
  // {{#each key}} ... {{/each}}
  tpl = tpl.replace(/\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, inner) => {
    const arr = get(ctx, key) || [];
    return arr.map((item, i) => render(inner, { ...item, '@index': i, '@first': i === 0, '@last': i === arr.length - 1, '..': ctx })).join('');
  });
  // {{#if key}} ... {{else}} ... {{/if}}
  tpl = tpl.replace(/\{\{#if\s+([\w.]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (_, key, a, b) => {
    return get(ctx, key) ? a : (b || '');
  });
  // {{{raw}}} unescaped
  tpl = tpl.replace(/\{\{\{\s*([\w.@]+)\s*\}\}\}/g, (_, key) => {
    const v = get(ctx, key);
    return v == null ? '' : String(v);
  });
  // {{var}} escaped
  tpl = tpl.replace(/\{\{\s*([\w.@]+)\s*\}\}/g, (_, key) => {
    const v = get(ctx, key);
    if (v == null) return '';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  });
  return tpl;
}

function readPartial(name) {
  return fs.readFileSync(path.join(SRC_DIR, 'partials', name), 'utf8');
}

const partials = {
  head: readPartial('head.html'),
  header: readPartial('header.html'),
  footer: readPartial('footer.html'),
};

function layout(body, ctx) {
  const shell = readPartial('layout.html');
  return render(shell, {
    ...ctx,
    head: render(partials.head, ctx),
    header: render(partials.header, ctx),
    footer: render(partials.footer, ctx),
    body,
  });
}

function writeFile(outPath, content) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
  console.log('  wrote', path.relative(ROOT, outPath));
}

function buildPage(srcName, outPath, ctx) {
  const tpl = fs.readFileSync(path.join(SRC_DIR, 'pages', srcName), 'utf8');
  const body = render(tpl, ctx);
  const html = layout(body, ctx);
  writeFile(path.join(OUT_DIR, outPath), html);
}

// ---- clean output -----------------------------------------------------

fs.rmSync(OUT_DIR, { recursive: true, force: true });

// ---- shared context -----------------------------------------------------

const siteUrl = 'https://nafawellness.com'; // update once domain is confirmed
const base = { site, faq, policies, services, massageServices, addonServices, year: new Date().getFullYear(), siteUrl };

console.log('Building Nafa Wellness site...');

buildPage('index.html', 'index.html', { ...base, featuredServices: services.slice(0, 3), pageTitle: `${site.businessName} — Mobile Massage Therapy in Edmonton, Alberta`, pageDescription: site.positioning, bodyClass: 'page-home', navActive: 'home', canonicalPath: '/' });

buildPage('about.html', 'about/index.html', { ...base, pageTitle: `About Us — ${site.businessName}`, pageDescription: site.story, bodyClass: 'page-about', navActive: 'about', canonicalPath: '/about/' });

buildPage('practitioner.html', 'practitioner/index.html', { ...base, pageTitle: `Meet Aminata Sama Corr — ${site.businessName}`, pageDescription: `Meet ${site.practitionerName}, CRMTA-certified massage therapist at ${site.businessName}.`, bodyClass: 'page-practitioner', navActive: 'practitioner', canonicalPath: '/practitioner/' });

buildPage('services.html', 'services/index.html', { ...base, pageTitle: `Massage Services & Pricing — ${site.businessName}`, pageDescription: 'Browse all mobile massage therapy services, durations, and pricing.', bodyClass: 'page-services', navActive: 'services', canonicalPath: '/services/' });

// individual service detail pages
services.forEach((service, i) => {
  const prevService = services[i - 1];
  const nextService = services[i + 1];
  buildPage('service-detail.html', `services/${service.slug}/index.html`, {
    ...base,
    ...service,
    pageTitle: `${service.name} — ${site.businessName}`,
    pageDescription: service.description,
    bodyClass: 'page-service-detail',
    navActive: 'services',
    canonicalPath: `/services/${service.slug}/`,
  });
});

buildPage('booking.html', 'booking/index.html', { ...base, pageTitle: `Book Online — ${site.businessName}`, pageDescription: 'Book your mobile massage therapy appointment online.', bodyClass: 'page-booking', navActive: 'booking', canonicalPath: '/booking/' });

buildPage('faq.html', 'faq/index.html', { ...base, pageTitle: `FAQ — ${site.businessName}`, pageDescription: 'Answers to common questions about booking and mobile massage therapy.', bodyClass: 'page-faq', navActive: 'faq', canonicalPath: '/faq/' });

buildPage('contact.html', 'contact/index.html', { ...base, pageTitle: `Contact Us — ${site.businessName}`, pageDescription: `Get in touch with ${site.businessName}.`, bodyClass: 'page-contact', navActive: 'contact', canonicalPath: '/contact/' });

buildPage('privacy.html', 'privacy-policy/index.html', { ...base, pageTitle: `Privacy Policy — ${site.businessName}`, pageDescription: 'Privacy policy.', bodyClass: 'page-legal', navActive: '', canonicalPath: '/privacy-policy/' });

buildPage('booking-policy.html', 'booking-cancellation-policy/index.html', { ...base, pageTitle: `Booking & Cancellation Policy — ${site.businessName}`, pageDescription: 'Booking and cancellation policy.', bodyClass: 'page-legal', navActive: '', canonicalPath: '/booking-cancellation-policy/' });

buildPage('404.html', '404.html', { ...base, pageTitle: `Page Not Found — ${site.businessName}`, pageDescription: 'Page not found.', bodyClass: 'page-404', navActive: '', canonicalPath: '/404.html' });

// ---- static assets --------------------------------------------------------

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(path.join(ROOT, 'css'), path.join(OUT_DIR, 'css'));
copyDir(path.join(ROOT, 'js'), path.join(OUT_DIR, 'js'));
copyDir(path.join(ROOT, 'images'), path.join(OUT_DIR, 'images'));
if (fs.existsSync(path.join(ROOT, 'static'))) copyDir(path.join(ROOT, 'static'), OUT_DIR);

// ---- sitemap.xml & robots.txt ---------------------------------------------

const urls = [
  '/', '/about/', '/practitioner/', '/services/', '/booking/', '/faq/', '/contact/',
  '/privacy-policy/', '/booking-cancellation-policy/',
  ...services.map((s) => `/services/${s.slug}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`)
  .join('\n')}\n</urlset>\n`;
writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
writeFile(path.join(OUT_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log('Done. Output in /dist');
