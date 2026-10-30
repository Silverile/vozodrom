# Photo backfill, delivery 54

Three Ferrari generation photographs were selected after contact-sheet and full-thumbnail inspection: 328 GTB, 360 Modena and F40. Original images are referenced, not stored. Dimensions, author and file-specific licence are retained in candidates.json and the numbered patches. The F40 selection uses a cached exact Commons file page and its Flickr licence review; the photographer's visible watermark is retained.

The category pass hit HTTP 429. Further bulk requests were stopped; the fetch helper now aborts on that response. Focused fallback used cached file pages and individual original-URL thumbnails, which remained readable. This is an incomplete search, not a conclusion that no suitable photos exist. Tight, rear, detail, scenery and insecurely identified candidates were rejected; report.json records the decisions. Review binaries are temporary and removed before handoff.

Reapply with `node analysis/codex/merge-photo-patches-54.mjs`, then run `node analysis/codex/photo-backfill-54/validate.mjs`. The merger preserves earlier batches and refuses to overwrite an existing differing photograph.
