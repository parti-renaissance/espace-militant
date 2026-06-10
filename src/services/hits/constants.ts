// ---------- Hit sources (attribution analytics) ----------

export const HIT_SOURCES = {
  PAGE_TIMELINE: 'page_timeline',
  PAGE_EVENTS: 'page_events',
  PAGE_EVENTS_HUB: 'page_events_hub',
  PAGE_EVENTS_PINNED: 'page_events_pinned',
  PAGE_PUBLICATION_EDITION: 'page_publication_edition',
  PAGE_PUBLICATION_READ: 'page_publication_read',
  PAGE_PROFIL: 'page_profil',
  PAGE_FORMATIONS: 'page_formations',
  PAGE_IDEES: 'page_idees',
  PAGE_REFERRALS: 'page_referrals',
  PAGE_EVENT_DETAIL: 'page_event_detail',
  PAGE_NAV: 'page_nav',
  TOI_PRESIDENT: 'toi_president',
  DIRECT_LINK: 'direct_link',
  RELOAD: 'reload',
} as const

export type HitSource = (typeof HIT_SOURCES)[keyof typeof HIT_SOURCES]
