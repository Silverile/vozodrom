# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a private buyer of a used car in the Czech Republic. Their fear is being cheated on mileage, accident history, price or by a fraudulent seller, and their job is to choose a model and generation worth buying and to judge one specific car before contacting the seller.

Secondary, confirmed by existing features: sellers placing listings (private now, dealers later), owners keeping their cars in a garage with a logbook, and staff (moderators, admins) running moderation and catalogue corrections.

## Product Purpose

Vozodrom (vozodrom.cz) is a Czech car portal: listings of used cars, a catalogue of makes, model lines and generations, data from the public vehicle register and technical inspections (STK), and an owners' community. A buyer should be able to see, for the car they are looking at, what owners of the same generation experienced and what the real data says.

Status: a prototype. Real user listings and accounts exist; catalogue figures in places, reviews, forum and part of the listings are test data, and pages say so.

## Positioning

An owners' community: owners keep their cars in a garage and write logbooks (what they repaired, changed and paid, at what mileage), comment and follow each other's cars. This sits next to listings and next to per-generation data from the Czech register and STK, so a buyer reading about a generation sees real owners' entries and real figures, and listings of that generation. Sauto and Bazoš are listing boards; Autohled is strong on new cars and VIN checks without private listings.

## Operating Context

- Buyers arrive from search or listings, compare generations in the catalogue, read STK/register figures and owners' logbooks, then contact a seller through on-site chat.
- Sellers fill a catalogue-driven form (make → model → year → generation → engine), upload photos, pass an automatic review; flagged listings go to a moderator.
- Owners add cars to /garaz/ and write logbook entries; public pages live under /deniky/.
- Admins correct catalogue texts in /admin/obsah/ and publish with a deploy; moderators handle DSA notices and community reports.
- One-person project without a budget; the catalogue data is maintained with Codex.

## Capabilities and Constraints

- Language and market: the interface is Czech only; the market is the Czech Republic (CZK, regions/kraje, STK, the Czech register).
- No fabricated data: unknown values stay empty, test data is labelled as test data, and there are no invented reviews, customers, guarantees or claims.
- Both a dark and a light theme are required, with the switch in the header.
- Stack in place: Next.js App Router on Cloudflare Workers (OpenNext), Postgres (Neon), R2 for photos. The Worker has a 64 MiB uncompressed size limit; catalogue model cards are served as static files, not bundled.
- Catalogue: 200+ makes and thousands of model lines with generations, engines, dimensions per body, Commons photos and front line drawings; every figure has a source and unconfirmed values stay null.
- Undecided: the pilot segment (mass-market Škoda generations is the leading candidate), paid products and partner links.

## Brand Commitments

- Name: Vozodrom, wordmark "vozodrom" with a section sub-brand (AUTO, DENÍKY, DÍLY…).
- The guarantee-style claim "Ojetina bez překvapení" is not used; wording stays concrete (records with a date and a source, what the data is missing, what to check at a viewing).
- Project icon pack (traced line icons) is the interface icon set.

## Evidence on Hand

- Real: user listings and accounts on production; Czech register and STK aggregates per generation (src/data/stats, listing-stats.json); catalogue with sources (src/data/catalog/model-cards); front drawings (public/front); docs in docs/ (architecture, data, API, operations, strategy).
- Test data: catalogue demo figures, reviews, forum and generated listings, labelled on the pages.
- Absent, never to be invented: testimonials, customer logos, press, user counts, guarantees, partner deals.

## Product Principles

1. Owners first: a generation's page and a listing are richer with what real owners wrote and paid.
2. Facts with a source; a gap is shown as a gap, never filled with a guess.
3. Built for Czech buyers: Czech words, Czech units, Czech register and STK.
4. Small and real before broad: prove one living segment before adding features.
