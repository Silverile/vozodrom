# STK defect rebuild comparison

Baseline: f49ffd9edb6fa1a4df2feeb385f6e26bb2dd6589. Full source period: 2023-10-12–2026-10-11, 1094 daily files.

Each three-level defect code is now counted once per regular inspection, with its maximum severity retained. Year/type matching uses current cards and ignores announced-only generation start dates. Register was reaggregated as well, so restored/moved cohorts are reported separately from the defect-only correction.

Validated 2774 STK statistic groups and 12941 published defect rows; 5101 shared published rows differ (including severity proportions).

Line entries appeared/disappeared: 68/0. Generation entries appeared/disappeared: 433/4. Existing group non-defect changes: 218. See comparison.json for every key and coverage transition.

## Octavia III

Inspections before/after: 572765 / 572765.

| Code | Czech label | Before | After | Change pp |
|---|---|---:|---:|---:|
| 3.2.1 | Prasklé nebo poškrábané zasklení nebo některé zasklení chybí | 4.05% | 4.05% | 0 |
| 4.1.1 | Stav a funkce světlometů | 2.20% | 2.19% | -0.01 |
| 2.1.3 | Stav pákového mechanismu řízení | 1.46% | 1.45% | -0.01 |
| 4.7.1 | Stav a funkce osvětlení zadní tabulky registrační značky | 0.97% | 0.97% | 0 |
| 6.2.10 | Kryty kol a systémy proti rozstřiku | 0.65% | 0.65% | 0 |

## Fabia II

Inspections before/after: 441518 / 441518.

| Code | Czech label | Before | After | Change pp |
|---|---|---:|---:|---:|
| 4.1.1 | Stav a funkce světlometů | 8.59% | 8.51% | -0.08 |
| 2.1.3 | Stav pákového mechanismu řízení | 5.11% | 5.08% | -0.03 |
| 4.7.1 | Stav a funkce osvětlení zadní tabulky registrační značky | 4.59% | 4.59% | 0 |
| 3.2.1 | Prasklé nebo poškrábané zasklení nebo některé zasklení chybí | 4.10% | 4.10% | 0 |
| 1.1.6 | Ovladač parkovací brzdy, ovládací páka, západka parkovací brzdy, elektrická parkovací… | 3.18% | 3.17% | -0.01 |

## Golf VII

Inspections before/after: 134136 / 134136.

| Code | Czech label | Before | After | Change pp |
|---|---|---:|---:|---:|
| 4.1.1 | Stav a funkce světlometů | 3.58% | 3.56% | -0.02 |
| 3.2.1 | Prasklé nebo poškrábané zasklení nebo některé zasklení chybí | 3.01% | 3.01% | 0 |
| 2.1.3 | Stav pákového mechanismu řízení | 1.11% | 1.11% | 0 |
| 4.7.1 | Stav a funkce osvětlení zadní tabulky registrační značky | 0.57% | 0.57% | 0 |
| 6.2.10 | Kryty kol a systémy proti rozstřiku | 0.53% | 0.53% | 0 |

## Station feasibility

Raw inspection XML contains Stanice with Cislo, Kraj, ORP and Obec children (verified structurally on a raw record). Station-level analyses are technically possible; the current aggregate intentionally drops station dimensions. Separate aggregation, station/reference-history reconciliation, denominator and case-mix review are required. No station ranking was produced.

## Consumer guide data

The shared sample retains its existing hierarchy and adds topDefects[].share, fixed-age mileageForGuide (5/8/10/12/15), facelifts, engines and technicalSources. Missing ages stay null. occurrencesPerInspection remains only as a deprecated numeric alias. Corrected rates describe inspection prevalence, not failure prediction for an individual car.
