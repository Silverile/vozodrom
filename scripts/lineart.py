"""Turn a side-view car photo into a blueprint-style line drawing (Vozodrom placeholder).

  py -P lineart.py <in.jpg> <out.png> [--flip] [--length MM] [--wheelbase MM] [--height MM]

1. Mask: YOLO finds the car (not a tractor beside it); rembg gives the precise edge.
2. Wheels: two circles found near where the car touches the ground; drawn as clean circles.
3. Silhouette: the mask's bottom and top edges are cleaned (shadow drips, antennas), then the
   outline is smoothed and drawn as the bold line.
4. Details: Canny edges inside the body (doors, windows, trim), minus specks and the wheels.
5. Canvas 1280x800 (16:10), front to the left, ground line and factory-drawing dimensions.
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

args = sys.argv[1:]
src, dst = args[0], args[1]
opt = lambda k: int(args[args.index(k) + 1]) if k in args else None
flip, length_mm, wheelbase_mm, height_mm = "--flip" in args, opt("--length"), opt("--wheelbase"), opt("--height")

img = cv2.imread(src)
if flip:
    img = cv2.flip(img, 1)


def largest(m):
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    return np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)


def filled(m):
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    out = np.zeros_like(m)
    cv2.drawContours(out, cnts, -1, 255, -1)
    return out


from scipy.interpolate import splev, splprep  # noqa: E402


def smooth_path(pts, closed=False, stiffness=1.5):
    """A smooth spline through a pixel path: no steps, no zig-zags. stiffness: higher = smoother."""
    pts = np.asarray(pts, float)
    keep = np.r_[True, np.any(np.diff(pts, axis=0) != 0, axis=1)]  # splprep hates repeated points
    pts = pts[keep]
    if len(pts) < 6:
        return pts
    k = 3 if len(pts) > 8 else 1
    try:
        tck, _ = splprep(pts.T, s=len(pts) * stiffness, per=1 if closed else 0, k=k)
    except Exception:
        return pts
    length = np.sum(np.hypot(*np.diff(pts, axis=0).T))
    u = np.linspace(0, 1, max(8, int(length / 2)))
    return np.stack(splev(u, tck), 1)


# 1. mask (cached: segmentation is the slow part)
cache = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache", os.path.basename(src) + (".flip" if flip else "") + ".birefnet.png")
if os.path.exists(cache):
    mask = cv2.imread(cache, cv2.IMREAD_GRAYSCALE)
else:
    from rembg import new_session, remove
    from ultralytics import YOLO

    r = YOLO("yolo11m-seg.pt")(img, classes=[2, 7], verbose=False, retina_masks=True)[0]  # car, truck
    if r.masks is None:
        sys.exit("no car found")
    i = int(np.argmax([(b[2] - b[0]) * (b[3] - b[1]) for b in r.boxes.xyxy.tolist()]))
    car = cv2.resize((r.masks.data[i].cpu().numpy() > 0.5).astype(np.uint8) * 255, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_NEAREST)
    fine = (np.array(remove(img[:, :, ::-1], session=new_session("birefnet-general")))[:, :, 3] > 128).astype(np.uint8) * 255
    grow = max(9, img.shape[1] // 120)
    mask = cv2.bitwise_and(fine, cv2.dilate(car, np.ones((grow, grow), np.uint8)))
    if mask.sum() < 0.6 * car.sum():  # rembg lost the car (low contrast): use YOLO's mask
        mask = car
    mask = largest(mask)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    k = max(5, int(cv2.boundingRect(mask)[2] / 170))  # drop thin attachments (antennas, posts, ropes)
    mask = filled(largest(cv2.morphologyEx(mask, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))))
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    cv2.imwrite(cache, mask)

x, y, w, h = cv2.boundingRect(mask)
# keep some photo below the mask: it often loses the bottom of the tyres in the shadow
y2 = min(img.shape[0], y + h + int(0.08 * w))
img, mask = img[y:y2, x : x + w], mask[y:y2, x : x + w]
h = y2 - y
CAR_W = 1000  # every car is drawn at the same width, so line weights match
s = CAR_W / w
img = cv2.resize(img, (CAR_W, int(h * s)), interpolation=cv2.INTER_AREA)
mask = cv2.resize(mask, (CAR_W, int(h * s)), interpolation=cv2.INTER_NEAREST)
h = mask.shape[0]
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

cols = np.arange(CAR_W)
has = mask.max(0) > 0
bottom = np.where(has, h - 1 - np.argmax(mask[::-1] > 0, 0), 0)
top = np.where(has, np.argmax(mask > 0, 0), h)

# car parts: a YOLO segmentation model trained on the CC0 "Car Parts" dataset by Humans in the
# Loop (windows, doors, fenders, lights, wheels...). Its part borders give clean panel lines.
PARTS_MODEL = os.environ.get("VOZODROM_PARTS_MODEL", "C:/Workspace/Projects/CF/vozodrom-data/models/carparts-hitl-m120.pt")
parts = []  # (class name, binary mask)
if os.path.exists(PARTS_MODEL):
    from ultralytics import YOLO as _YOLO

    _pm = _YOLO(PARTS_MODEL)
    # two passes, plain and with test-time augmentation: each finds windows the other misses on
    # older cars (the training photos are mostly modern); overlapping finds are merged below
    for _aug in (False, True):
        pr = _pm(img, conf=0.08, retina_masks=True, verbose=False, augment=_aug, imgsz=768)[0]
        if pr.masks is None:
            continue
        for k, c, cf in zip(pr.masks.data.cpu().numpy(), pr.boxes.cls.cpu().numpy().astype(int), pr.boxes.conf.cpu().numpy()):
            k = cv2.resize((k > 0.5).astype(np.uint8) * 255, (CAR_W, h), interpolation=cv2.INTER_NEAREST)
            parts.append((pr.names[c], k, float(cf)))


def fit_part_wheel(k):
    cs, _ = cv2.findContours(k, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    if len(c) >= 5:
        (cx, cy), (a, b), _ = cv2.fitEllipse(c)
        return int(cx), int(cy), int(round(min(a, b) / 2))  # the short axis: the mask's long axis picks up arch shadow
    (cx, cy), rr = cv2.minEnclosingCircle(c)
    return int(cx), int(cy), int(rr)


# one wheel per half of the car (front, rear): the most confident find in each
part_wheels = []
for lo_, hi_ in ((0, 0.5), (0.5, 1.0)):
    cand_ = [(cf, fit_part_wheel(k)) for n_, k, cf in parts if "wheel" in n_]
    cand_ = [(cf, w_) for cf, w_ in cand_ if lo_ * CAR_W <= w_[0] < hi_ * CAR_W]
    if cand_:
        part_wheels.append(max(cand_, key=lambda t: t[0])[1])
if len(part_wheels) != 2:
    part_wheels = []


# 2. wheels. Tyres are dark circles of a known size (tyre diameter / length * CAR_W) and, when
# the wheelbase is known, sit wheelbase / length * CAR_W apart. Candidate circles come from a
# Hough transform; the best-scoring front/rear pair wins. The mask often loses the bottom of
# the tyres in the shadow, so the ground is taken from the tyres, not from the mask.
tyre_mm = opt("--tyre") or 680
r0 = CAR_W * tyre_mm / 2 / length_mm if length_mm else 0.075 * CAR_W
edge_map = cv2.Canny(cv2.GaussianBlur(gray, (5, 5), 1.2), 40, 110)
edge_map = cv2.dilate(edge_map, np.ones((3, 3), np.uint8)).astype(np.float32) / 255
dark = 1 - cv2.GaussianBlur(gray, (7, 7), 0).astype(np.float32) / 255
ang = np.linspace(0, 2 * np.pi, 120, endpoint=False)
H_img = gray.shape[0]


def ring(m, cx, cy, rr):
    xs_ = np.clip((cx + rr * np.cos(ang)).astype(int), 0, CAR_W - 1)
    ys_ = np.clip((cy + rr * np.sin(ang)).astype(int), 0, H_img - 1)
    return float(m[ys_, xs_].mean())


def score(cx, cy, rr):
    return (ring(edge_map, cx, cy, rr) + 0.6 * ring(edge_map, cx, cy, 0.64 * rr)
            + 0.8 * np.mean([ring(dark, cx, cy, k * rr) for k in (0.75, 0.85, 0.95)]))


# extend the image downwards a little: tyres may be cut by the crop
cands = []
blur = cv2.GaussianBlur(gray, (5, 5), 1.5)
for p2 in (30, 22, 16):
    c = cv2.HoughCircles(blur, cv2.HOUGH_GRADIENT, dp=1.2, minDist=r0 * 0.3, param1=110, param2=p2,
                         minRadius=int(r0 * 0.82), maxRadius=int(r0 * 1.18))
    if c is not None:
        cands += [(float(cx), float(cy), float(rr)) for cx, cy, rr in c[0] if cy > H_img * 0.45]
    if len(cands) >= 12:
        break
cands = [(cx, cy, rr, score(cx, cy, rr)) for cx, cy, rr in cands]
front = [c for c in cands if c[0] < CAR_W * 0.45]
rear = [c for c in cands if c[0] > CAR_W * 0.55]
wb = CAR_W * wheelbase_mm / length_mm if (wheelbase_mm and length_mm) else None
best = None
for f in front:
    for q in rear:
        if wb and not (0.9 * wb <= q[0] - f[0] <= 1.1 * wb):
            continue
        if abs(f[1] - q[1]) > 0.25 * r0:
            continue
        sc = f[3] + q[3] - (abs((q[0] - f[0]) / wb - 1) * 2 if wb else 0)
        if best is None or sc > best[0]:
            best = (sc, f, q)
if best:
    wheels = [(int(c[0]), int(c[1]), int(c[2])) for c in best[1:]]
else:  # no pair found: fall back to the mask's lowest points
    g = int(np.percentile(bottom[has], 99.5))
    wheels = [(int(CAR_W * 0.18), g - int(r0), int(r0)), (int(CAR_W * 0.8), g - int(r0), int(r0))]


def refine(cx, cy, rr):
    # local search around the Hough circle: Hough is coarse, the score is what we trust
    best = (score(cx, cy, rr), cx, cy, rr)
    for step in (8, 4, 2, 1):
        improved = True
        while improved:
            improved = False
            _, bx, by, br = best
            for dx, dy, dr in ((step, 0, 0), (-step, 0, 0), (0, step, 0), (0, -step, 0), (0, 0, step), (0, 0, -step)):
                nr = br + dr
                if not (r0 * 0.75 <= nr <= r0 * 1.25):
                    continue
                sc = score(bx + dx, by + dy, nr)
                if sc > best[0] + 1e-4:
                    best = (sc, bx + dx, by + dy, nr)
                    improved = True
    return best[1:]


wheels = [tuple(int(v) for v in refine(*w_)) for w_ in wheels]
if part_wheels and abs(part_wheels[1][0] - part_wheels[0][0]) > 0.35 * CAR_W:
    # the parts model sees the tyres directly; trust it over the circle search. Its masks can
    # swallow some arch shadow, so radii are kept near the catalogue tyre size and, when the two
    # agree within 15 %, made equal (perspective differences that small are noise).
    rr_ = [min(max(w_[2], 0.85 * r0), 1.15 * r0) for w_ in part_wheels]
    if abs(rr_[0] - rr_[1]) < 0.15 * max(rr_):
        rr_ = [sum(rr_) / 2] * 2
    wheels = [(cx, cy + int(round(r_ - rr))) if False else (cx, int(cy + r_ - rr), int(round(rr))) for (cx, cy, r_), rr in zip(part_wheels, rr_)]
    wheels = [(int(a_), int(b_), int(c_)) for a_, b_, c_ in wheels]  # keep the tyre bottom where the model saw it
if "--wheels" in args:  # manual fit after review: "x1,y1,r1,x2,y2,r2" in the 900-px-wide crop
    v = [round(int(t) * CAR_W / 900) for t in args[args.index("--wheels") + 1].split(",")]  # measured at 900 px
    wheels = [tuple(v[:3]), tuple(v[3:])]
ground_y = int(max(cy + rr for _, cy, rr in wheels))
wheels = [(cx, ground_y - rr, rr) for cx, _, rr in wheels]  # both stand on one ground line
r = max(rr for _, _, rr in wheels)

if "--debug" in args:  # the photo with the fitted wheels, to check placement by eye
    dbg = img.copy()
    for cx_, cy_, r_ in wheels:
        cv2.circle(dbg, (cx_, cy_), r_, (0, 0, 255), 2)
    for gx in range(0, CAR_W, 25):
        cv2.line(dbg, (gx, 0), (gx, 6 if gx % 50 else 14), (0, 255, 255), 1)
        if gx % 100 == 0:
            cv2.putText(dbg, str(gx), (gx + 2, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
    for gy in range(0, dbg.shape[0], 25):
        cv2.line(dbg, (0, gy), (6 if gy % 50 else 14, gy), (0, 255, 255), 1)
        if gy % 50 == 0:
            cv2.putText(dbg, str(gy), (16, gy + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
    cv2.imwrite(dst.replace(".png", "-debug.jpg"), dbg)

# 3. silhouette clean-up
in_wheel = np.zeros(CAR_W, bool)
for cx, cy, r in wheels:
    in_wheel[max(0, cx - int(r * 0.85)) : cx + int(r * 0.85)] = True
# bottom edge between and outside the wheels: drop shadow drips (anything hanging below the
# running median of the sill line)
from scipy.ndimage import median_filter, percentile_filter  # noqa: E402

body = ~in_wheel & has  # the sill line is judged on the body only, not on the tyres
sill = np.array(bottom, float)
sill[body] = percentile_filter(bottom[body].astype(float), 30, size=91, mode="nearest")
new_bottom = np.where(in_wheel, bottom, np.minimum(bottom, sill + 2)).astype(int)
# top edge: shave single spikes (antenna stubs, mirrors) above the running median of the roof line
roof = median_filter(top.astype(float), size=41, mode="nearest")
new_top = np.maximum(top, roof - 3).astype(int)
yy = np.arange(h)[:, None]
mask = np.where((yy <= new_bottom[None, :]) & (yy >= new_top[None, :]), mask, 0).astype(np.uint8)
for cx, cy, r in wheels:  # tyres are round and sit on the ground
    cv2.circle(mask, (cx, cy), r, 255, -1)
mask = filled(largest(mask))
# soften the ragged segmentation edge before tracing it (keeps corners, loses the hair)
mask = (cv2.GaussianBlur(mask, (0, 0), 3.0) > 127).astype(np.uint8) * 255

contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
pts = max(contours, key=cv2.contourArea)[:, 0, :].astype(float)
outline = smooth_path(pts, closed=True, stiffness=0.9)

if "--dump" in args:  # crop, mask and wheels for experiments
    np.savez_compressed(dst.replace(".png", "-dump.npz"), img=img, mask=mask, wheels=np.array(wheels), ground_y=ground_y)

# 4. details, drawn from the car parts rather than from raw photo edges:
#    - windows (side windows, windshield, back windshield) as smooth closed frames;
#    - lights, grille and mirrors as smooth closed shapes;
#    - panel lines (door cuts, fender and quarter-panel seams, hood and trunk edges) from the
#      borders between parts, merged into single centre lines and fitted with splines.
from skimage.morphology import skeletonize  # noqa: E402


def trace_chains(binary, min_len):
    """1-px skeleton -> simple chains (cut at junctions) -> smooth splines."""
    skel = skeletonize(binary > 0).astype(np.uint8)
    nb = cv2.filter2D(skel, -1, np.ones((3, 3), np.float32), borderType=cv2.BORDER_CONSTANT) - skel
    skel[(skel > 0) & (nb > 2)] = 0
    n_, lab_ = cv2.connectedComponents(skel, connectivity=8)
    out = []
    for i in range(1, n_):
        ys, xs = np.nonzero(lab_ == i)
        if len(xs) < min_len * 0.6:
            continue
        pix = set(zip(xs.tolist(), ys.tolist()))
        deg = {p_: sum((p_[0] + dx, p_[1] + dy) in pix for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy) for p_ in pix}
        start = min(pix, key=lambda p_: (deg[p_], p_))
        path, seen, cur = [start], {start}, start
        while True:
            nxt = [(cur[0] + dx, cur[1] + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy)]
            nxt = [q for q in nxt if q in pix and q not in seen]
            if not nxt:
                break
            cur = min(nxt, key=lambda q: abs(q[0] - cur[0]) + abs(q[1] - cur[1]))
            path.append(cur)
            seen.add(cur)
        sp = smooth_path(path, stiffness=1.5)
        seg = np.diff(sp, axis=0)
        length = np.sum(np.hypot(*seg.T))
        heading = np.unwrap(np.arctan2(seg[:, 1], seg[:, 0]))
        wiggle = np.sum(np.abs(np.diff(heading))) / max(length, 1) * 100
        if length >= min_len and wiggle < 2.5:
            out.append(sp)
    return out


inner = cv2.erode(mask, np.ones((11, 11), np.uint8))  # stay off the silhouette line
for cx, cy, r in wheels:
    cv2.circle(inner, (cx, cy), int(r * 1.12), 0, -1)
car_area = float((mask > 0).sum())


def closed_shape(k, min_area):
    k = cv2.morphologyEx(k, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    cs, _ = cv2.findContours(k, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    return [smooth_path(c[:, 0, :].astype(float), closed=True, stiffness=2.0) for c in cs if cv2.contourArea(c) > min_area]


GLASS = ("window", "windshield")
SMALL = ("light", "grille", "mirror")
panes, lamps = [], []
glass_union = np.zeros_like(mask)
for name_, k, cf in parts:
    if "wheel" in name_ or "license" in name_:
        continue
    k = cv2.bitwise_and(k, mask)
    if any(t in name_ for t in GLASS):
        k = cv2.erode(k, np.ones((3, 3), np.uint8))
        glass_union |= k
        panes += [(pn, cf) for pn in closed_shape(k, 0.002 * car_area)]
    elif any(t in name_ for t in SMALL):
        lamps += closed_shape(k, 0.0006 * car_area)

# a shape inside a window (a headrest seen through the glass) is not a window
def _inside(a_, b_):
    return cv2.pointPolygonTest(b_.astype(np.float32).reshape(-1, 1, 2), (float(a_[:, 0].mean()), float(a_[:, 1].mean())), False) > 0


# a shape inside a window is a headrest; a weak window around a stronger one is a misfire:
# of two nested shapes the more confident one stays
def _poly_mask(pn):
    m_ = np.zeros_like(mask)
    cv2.fillPoly(m_, [pn.round().astype(np.int32)], 255)
    return m_ > 0


_pm_ = [_poly_mask(pn) for pn, _ in panes]


def _iou(i_, j_):
    return (_pm_[i_] & _pm_[j_]).sum() / max((_pm_[i_] | _pm_[j_]).sum(), 1)


panes = [pn for i_, (pn, cf) in enumerate(panes)
         if not any(j_ != i_ and (_inside(pn, q_) or _inside(q_, pn) or _iou(i_, j_) > 0.3) and (cq, j_) > (cf, i_)
                    for j_, (q_, cq) in enumerate(panes))]

# panel seams: borders of the body panels inside the silhouette, minus the window frames
seams = np.zeros_like(mask)
for name_, k, _ in parts:
    if "wheel" in name_ or "license" in name_ or any(t in name_ for t in GLASS + SMALL):
        continue
    k = cv2.morphologyEx(k, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    seams |= cv2.morphologyEx(k, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
seams &= inner
seams &= cv2.bitwise_not(cv2.dilate(glass_union, np.ones((11, 11), np.uint8)) ^ cv2.erode(glass_union, np.ones((11, 11), np.uint8)))
seams = cv2.dilate(seams, np.ones((5, 5), np.uint8))  # two neighbouring borders merge into one line
strokes = trace_chains(seams, min_len=50)

# 5. canvas
W, H = 1280, 800
SS = 2  # draw at 2x and downsample for smooth lines
ox = (W - CAR_W) // 2
ground = int(H * 0.66)
oy = ground - ground_y
INK = (235, 240, 245)
DIM = (140, 152, 168)

canvas = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
d = ImageDraw.Draw(canvas)
P = lambda px, py: (int(round((px + ox) * SS)), int(round((py + oy) * SS)))
for sp in strokes:
    d.line([P(px, py) for px, py in sp], fill=INK + (200,), width=int(1.6 * SS), joint="curve")
for pn in lamps:
    d.line([P(px, py) for px, py in pn] + [P(*pn[0])], fill=INK + (200,), width=int(1.6 * SS), joint="curve")
for pn in panes:
    d.line([P(px, py) for px, py in pn] + [P(*pn[0])], fill=INK + (240,), width=2 * SS, joint="curve")
d.line([P(px, py) for px, py in outline] + [P(*outline[0])], fill=INK + (255,), width=3 * SS, joint="curve")
for cx, cy, r in wheels:
    for rr, wd, a in ((r, 3, 255), (r * 0.64, 2, 230), (r * 0.18, 2, 200)):
        (x0, y0), (x1, y1) = P(cx - rr, cy - rr), P(cx + rr, cy + rr)
        d.ellipse([x0, y0, x1, y1], outline=INK + (a,), width=wd * SS)

font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 15 * SS)
G = lambda v: int(v * SS)
d.line([(G(ox - 70), G(ground)), (G(ox + CAR_W + 70), G(ground))], fill=DIM + (255,), width=2 * SS)


def hdim(xa, xb, yline, label, ext_from):
    for xv in (xa, xb):
        d.line([(G(xv), G(ext_from)), (G(xv), G(yline + 8))], fill=DIM + (200,), width=SS)
    d.line([(G(xa), G(yline)), (G(xb), G(yline))], fill=DIM + (255,), width=SS)
    for xv, sgn in ((xa, 1), (xb, -1)):  # arrow heads
        d.polygon([(G(xv), G(yline)), (G(xv + 9 * sgn), G(yline - 3.5)), (G(xv + 9 * sgn), G(yline + 3.5))], fill=DIM + (255,))
    tw = d.textlength(label, font=font)
    cx = G((xa + xb) / 2)
    d.rectangle([cx - tw / 2 - G(8), G(yline - 11), cx + tw / 2 + G(8), G(yline + 11)], fill=(0, 0, 0, 0))
    d.text((cx, G(yline)), label, font=font, fill=DIM + (255,), anchor="mm")


if wheelbase_mm:
    (x1, _, _), (x2, _, _) = wheels
    hdim(x1 + ox, x2 + ox, ground + 34, f"{wheelbase_mm}", ground + 4)
if length_mm:
    hdim(ox, ox + CAR_W, ground + 72, f"{length_mm}", ground + 4)
if height_mm:
    xr = ox + CAR_W + 46
    roof_y = int(outline[:, 1].min()) + oy
    for yv in (roof_y, ground):
        d.line([(G(ox + CAR_W + 10), G(yv)), (G(xr + 8), G(yv))], fill=DIM + (200,), width=SS)
    d.line([(G(xr), G(roof_y)), (G(xr), G(ground))], fill=DIM + (255,), width=SS)
    for yv, sgn in ((roof_y, 1), (ground, -1)):
        d.polygon([(G(xr), G(yv)), (G(xr - 3.5), G(yv + 9 * sgn)), (G(xr + 3.5), G(yv + 9 * sgn))], fill=DIM + (255,))
    t = Image.new("RGBA", (G(80), G(26)), (0, 0, 0, 0))
    ImageDraw.Draw(t).text((G(40), G(13)), f"{height_mm}", font=font, fill=DIM + (255,), anchor="mm")
    t = t.rotate(90, expand=True)
    mid = (roof_y + ground) / 2
    d.rectangle([G(xr - 11), G(mid) - t.height / 2 + G(14), G(xr + 11), G(mid) + t.height / 2 - G(14)], fill=(0, 0, 0, 0))
    canvas.alpha_composite(t, (G(xr) - t.width // 2, int(G(mid) - t.height / 2)))

canvas.resize((W, H), Image.LANCZOS).save(dst)
print("ok", dst, "wheels", wheels)
