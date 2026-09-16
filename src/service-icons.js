/**
 * Original, hand-authored minimalist line-art icons — one per service.
 * Not photographs: a deliberate choice given no source of real client/
 * studio photography was available. Each icon is drawn to loosely evoke
 * its treatment (a wave for relaxation, stacked stones for hot stone,
 * etc.) in a single consistent line style so it reads as part of the
 * Nafa Wellness brand system rather than generic stock art.
 *
 * All icons share viewBox="0 0 48 48", stroke="currentColor",
 * fill="none", stroke-width 1.6, round caps/joins — colour is applied
 * via the wrapping .service-visual class in css/style.css.
 */
const S = 'stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

module.exports = {
  'deep-tissue-massage': `<svg viewBox="0 0 48 48" ${S}><path d="M6 30c4-9 9-9 13 0s9 9 13 0 9-9 13 0"/><circle cx="24" cy="14" r="2.6" fill="currentColor" stroke="none"/><path d="M24 17v6"/></svg>`,

  'relaxation-massage': `<svg viewBox="0 0 48 48" ${S}><path d="M7 15c4.5-4 9-4 13.5 0s9 4 13.5 0"/><path d="M7 24c4.5-4 9-4 13.5 0s9 4 13.5 0"/><path d="M7 33c4.5-4 9-4 13.5 0s9 4 13.5 0"/></svg>`,

  'hot-stone-massage': `<svg viewBox="0 0 48 48" ${S}><ellipse cx="24" cy="35" rx="15" ry="6"/><ellipse cx="24" cy="24" rx="10.5" ry="5"/><ellipse cx="24" cy="14.5" rx="6.5" ry="4"/></svg>`,

  'pre-post-natal-massage': `<svg viewBox="0 0 48 48" ${S}><path d="M16 10c-9 6-9 22 0 28"/><circle cx="27" cy="24" r="6.5"/><path d="M27 20.5v7M23.7 24h6.6"/></svg>`,

  'lymphatic-massage': `<svg viewBox="0 0 48 48" ${S}><path d="M24 8c8 11 11 17 11 22a11 11 0 0 1-22 0c0-5 3-11 11-22z"/><path d="M19 30a5.5 5.5 0 0 0 5.5 5.5"/></svg>`,

  'sports-massage': `<svg viewBox="0 0 48 48" ${S}><path d="M6 27l7.5-13 6 10 6-16 6 19 7.5-9 3 5"/></svg>`,

  'madero-lymphatic-massage': `<svg viewBox="0 0 48 48" ${S}><line x1="4" y1="24" x2="10" y2="24"/><rect x="10" y="17" width="28" height="14" rx="7"/><line x1="38" y1="24" x2="44" y2="24"/><path d="M17 19.5v9M24 17.5v13M31 19.5v9"/></svg>`,

  'cupping-massage': `<svg viewBox="0 0 48 48" ${S}><circle cx="17" cy="18" r="8"/><circle cx="31" cy="18" r="8"/><circle cx="24" cy="31" r="8"/></svg>`,

  'extended-facial-massage': `<svg viewBox="0 0 48 48" ${S}><circle cx="24" cy="23" r="13"/><path d="M18 27c3.5 3.2 8.5 3.2 12 0"/><path d="M18.5 18.5h.01M29.5 18.5h.01"/></svg>`,

  'extended-foot-massage': `<svg viewBox="0 0 48 48" ${S}><ellipse cx="23" cy="31" rx="9.5" ry="13.5"/><circle cx="15" cy="14.5" r="2.1"/><circle cx="19.5" cy="10" r="2.3"/><circle cx="25" cy="8" r="2.5"/><circle cx="30.5" cy="10" r="2.3"/><circle cx="34.5" cy="14.5" r="2.1"/></svg>`,
};
