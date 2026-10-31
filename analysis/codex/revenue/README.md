# Revenue research — 31 October 2026

Research only. No applications, messages, registrations, purchases or publication were performed. No employee names, personal contacts, individual VIN histories or customer data are retained here.

| File | Purpose |
|---|---|
| `affiliate-programmes.md` / `.json` | 19 candidates across credit, insurance, history checks, inspections, leases, STK booking and warranties; published terms separated from unknowns and recommendations |
| `b2b-targets.md` / `.json` / `.csv` | 40 organisation/group prospects, generic company channels, priorities and competitor flags |
| `outreach-cs.md` | Czech partner/B2B drafts for an authorised communication context; nothing sent |
| `sample-vykupni-prehled.json` | Full sample: Octavia, Fabia, Golf, 16 generations; fleet, age-specific and bucket STK rates, mileage quartiles and up to five available defect codes (Golf I has only three) |
| `sample-vykupni-prehled.md` | Human-readable attachment preview with source period and limitations |
| `build-sample.mjs` / `build-research.mjs` | Reproducible local artefact generation; no network calls or contacts |
| `validate-sample.mjs` / `validation.json` | Source hashes, weighted-rate checks, missing-value/quantile checks, counts and generic-mailbox checks |

First four programme enquiries: **Zonky, Ušetřeno.cz, Cebia/eHUB, carVertical**. A fifth, bespoke enquiry can go to **Automato**, whose referral programme is not publicly confirmed. Driveto and Slavia are further published alternatives. Do not assume the network approves a new website or pays every submitted conversion.

First B2B discovery targets: **Automato, AUTO REVIZE, DAVO CAR, AUTO VOLF, AUTO ŠEVČÍK, AUTO KOUTEK, AUTO KOUT CENTRUM, HAVEX-auto, AUTOBOND and AUTO BEZ OBAV**. Priorities are hypotheses about decision speed, not purchase-intent evidence. Regional businesses may still find free source data sufficient; sell useful custom work, not an exclusivity claim. Large insurers, chains and data competitors are lower priority for immediate small revenue.

The sample is a methodological preview, not a production-certified risk or pricing product. Inspection rates describe inspections, not individual vehicle failure probabilities. Current top-defect counts can include a code in multiple severity classes in one inspection. Mileage quartiles come from 10,000-km bin midpoints. Generation attribution requires review before commercial delivery. The register aggregate build date is not its verified snapshot date. The paid value proposition should be scoped custom analysis/checklists with transparent limitations.

The code generation sample is based on local committed aggregates; the source files are not changed. Inspection coverage: **2023-10-12–2026-10-11**. Register aggregation build: **2026-10-27**, source reference date unverified. The JSON records checksums and the repository revision.

Public contact information is not marketing consent. The owner must select a lawful communication route. Use explicitly invited partnership applications or an established authorised context; do not bulk-mail the prospect list. [ÚOOÚ guidance](https://uoou.gov.cz/pravni-ramec/ochrana-osobnich-udaju/sireni-obchodnich-sdeleni). Credit/insurance integration needs approved materials and a properly assessed role; an affiliate label does not settle regulation. [ČNB credit-advertising requirements](https://www.cnb.cz/cs/dohled-financni-trh/ochrana-spotrebitele/spotrebitelsky-uver/).

Verification limits: programme terms are published assertions, not negotiated contracts; some contact routes were established through official search results rather than successful direct opens; deliverability and commercial eligibility were not tested. No willingness-to-pay study, conversion forecast or legal opinion was obtained.

Commands:

```powershell
node analysis/codex/revenue/build-research.mjs
node analysis/codex/revenue/build-sample.mjs
node analysis/codex/revenue/validate-sample.mjs
```
