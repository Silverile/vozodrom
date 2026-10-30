# Photo-frame handoff to Claude

Read-only review of `src/components/CarPhoto.tsx:9–13`; no application files changed.

The current lower fill threshold1.3 does not preserve a five-percent source-image margin in a16:10 frame. With `object-cover`, a4:3 image loses `(1-(4/3)/(16/10))/2 = 8.33%` of its source height at each end. A vehicle framed with5% top/bottom margins can therefore lose part of its roof or wheels. The source photo can pass the whole-car rule while its rendered card fails. Actual page rendering has not been inspected in this turn.

The comment's approximately4% crop claim is incorrect at the lower end. Aspect1.3 loses9.375% per vertical edge;1.4 loses6.25%;1.5 loses3.125%. To cap cropping at5% per edge in this frame, the lower safe ratio is1.44. The current upper1.75 is within the corresponding upper limit of1.777… .

Suggested owner change: raise the lower cover threshold to1.44 and use the existing contained-image/blurred-background path for unknown ratios as well. This uses the already implemented background treatment and avoids blank bars. New photo references may temporarily have no cached aspect, so null should not imply a safe cover crop.

This matters for explicitly documented4:3 fallbacks in the Estrima classic and Exeed ET5 cards, and older4:3 references. No claim is made that every such photograph currently clips: photographs with larger margins may remain safe.
