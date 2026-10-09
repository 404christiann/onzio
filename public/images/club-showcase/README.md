# Club-site showcase assets

Approved C1a composition, implemented in src/components/platform-showcase.tsx.

Hardware PNGs and display mask are unchanged Monkr assets reused from the approved club-site-c exploration. MIT license included in MONKR-LICENSE.txt. Homepage desktop (1395 x 4944) and phone (375 x 6914) captures were made from https://www.diversecityfc.com/ on 2026-10-09; they are unchanged, independently responsive captures.

Screen surfaces have no iframe, links, forms, or focusable elements. The original Diverse City FC hero and club-reel videos stream muted and inline from their existing Bunny CDN sources, within the capture layers. Original club fonts, affiliation marks and posters were copied from the local onzio-platform project; the hero text and navigation are noninteractive overlays aligned to the source captures. Only video visible in an active device plays. Pause freezes both footage and scrolling, and hidden/offscreen devices suspend playback. A still capture remains visible if video cannot play. Central Icons use the shared component and its included license. The 32-second tour holds three highlights, then crossfades back to the opening. Pause survives visibility changes. Reduced motion remains static with manual highlight selection.

Checks: node --test tests/club-site-tour.test.mjs; targeted ESLint; tsc --noEmit; build; browser verification at desktop, 390px and 320px.
