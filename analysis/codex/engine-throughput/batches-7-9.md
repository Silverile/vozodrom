# Engine sweep: batches 7-9

150 fleet-ranked lines researched; 43 enriched; 337 engine rows added. 106 had no usable, unambiguously attributed table; 1 was already covered. Sources and per-line reasons: batch-7.json to batch-9.json.

Generation additions/removals, date changes, facelifts, drawing/stats moves and listing-id changes: **0**. No statistics rebuild is required. Generation chronology is **not** certified complete by an engine-table visit.

Presentation cleanup against aa5df828a122105eb7d44c3e9a4de10ad5d09419: 213 annotated names shortened with full cleaned old text retained in noteCs; 215 unnamed rows: 215 labeled from stored facts, 0 empty rows removed. No unnamed rows remain. Equal display-name/power rows may merge after shortening. See presentation-cleanup.json and name-cleanup.json.

Wave progress: wave 1: 410/478; wave 2: 0/630; wave 3: 0/3701. Next batch: 10. Importer now advances to the next wave automatically after all current-wave lines are visited. 'Visited' means an engine-source attempt, not a complete card.

Structural follow-ups (not applied): BMW 3 missing E21 and duplicate technical sheets; undifferentiated Jumper family; Peugeot 307 family vs CC production end. Full facts, URLs and migration cautions: generation-structure-followups.json.

Validation: run validate-engine-throughput.mjs for source/generated card hashes and exact unchanged generation metadata, listing IDs, drawings/holds/stats; audit-engine-throughput.mjs checks all public engine labels and attribution evidence. Test scripts cover names, duplicate powers, markets, attribution and presentation. Application build/publication remains with Claude.
