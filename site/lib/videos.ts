export interface VideoMeta {
  slug: string
  episode: number
  title: string
  kicker: string
  duration: string
  date: string
  tldr: string
  src?: string
  tiktokUrl?: string
  articleSlug?: string
}

export const VIDEOS: VideoMeta[] = [
  {
    slug: 'ep5-canadian-wages',
    episode: 5,
    title: 'For the First Time in Canadian History, Men Over 65 Out-Earn Men 25-34.',
    kicker: 'economics',
    duration: '0:42',
    date: 'May 2026',
    tldr: 'For the first time in recorded Canadian data, men over 65 have higher median earnings than men aged 25-34. The pattern reflects two simultaneous shifts: older workers staying employed longer at peak earnings, and younger men entering a labor market where real wages for non-degree holders have stagnated. The generational earnings inversion is a new development with no historical precedent in the data.',
    tiktokUrl: 'https://www.tiktok.com/@pointofmu_/video/7641213916537965832',
    articleSlug: '2026-05-canadian-wages',
  },
  {
    slug: 'ep7-nba-sutva',
    episode: 7,
    title: 'The Mid-Range Shot Is Dead. So Why Are Teams Making More of Them?',
    kicker: 'measurement',
    duration: '1:37',
    date: 'June 12, 2026',
    tldr: 'Analytics teams eliminated the mid-range shot. The teams that kept shooting it are hitting it at record rates. The correlation with league-wide analytics adoption is r = 0.73 across 24 seasons. The mechanism borrows from a concept in causal inference: when one group\'s strategy changes the environment everyone operates in, the other group inherits better conditions without doing anything differently.',
    src: '/videos/ep7-nba-sutva.mp4',
    articleSlug: '2026-06-nba-sutva',
  },
  {
    slug: 'ep8-marriage-squeeze',
    episode: 8,
    title: 'College Women Kept Marrying. Everyone Else Didn\'t.',
    kicker: 'economics',
    duration: '2:01',
    date: 'June 22, 2026',
    tldr: 'The college gender gap didn\'t hurt college women\'s marriage rates. It shifted who was available to non-college women through two distinct channels. College women adapted by matching with high-earning men without degrees. The share of college-educated women in cross-education marriages quadrupled. A new NBER paper documents the mechanism across 50 birth cohorts.',
    src: '/videos/ep8-marriage-squeeze.mp4',
    articleSlug: '2026-06-marriage-market-squeeze',
  },
  {
    slug: 'ep9-finishing-luck',
    episode: 9,
    title: 'The Striker Who \'Found a New Level\' Almost Never Really Did',
    kicker: 'measurement',
    duration: '2:05',
    date: 'July 14, 2026',
    tldr: 'Jude Bellingham and Erling Haaland both beat their own expected goals by a wide margin in one season, then gave most of it back the next. Tested across 5,498 player-seasons in six European leagues, the chances a player gets are a stable trait, r = 0.80 year over year, while whether he outscores them is close to a coin flip, r = 0.07. One player in the sample never reverts: Lionel Messi.',
    src: '/videos/ep9-finishing-luck.mp4',
    articleSlug: '2026-07-finishing-luck-regression',
  },
  {
    slug: 'ep14-tiktok-micro-influencer-engagement',
    episode: 14,
    title: 'Do Micro-Influencers Actually Engage More?',
    kicker: 'measurement',
    duration: '1:51',
    date: 'September 2026',
    tldr: 'Every growth deck has a slide claiming small accounts engage better than big ones. I checked it against 1,000 TikTok profiles, then again on Twitter/X and Instagram. Engagement rate falls by a fixed fraction every time followers multiply by ten, holding across all three platforms. I also tested the part almost nobody checks: whether follower concentration itself behaves like a true power law. That one came back close to a coin flip.',
    src: '/videos/ep14-tiktok-micro-influencer-engagement.mp4',
    articleSlug: '2026-09-tiktok-micro-influencer-engagement',
  },
]

export function getVideo(slug: string): VideoMeta | undefined {
  return VIDEOS.find(v => v.slug === slug)
}
