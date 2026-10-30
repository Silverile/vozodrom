"""Wheel circles for an already cropped/scaled, near-side-view car (front left).

No learned models, downloads, global state or reference-car coordinates. Requires
numpy and OpenCV. mask is a soft prior: tyre pixels may be absent from it.
Return float circles in input pixels, sorted left to right. Do not flatten their
centres to a common ground line: perspective makes that geometrically wrong.
"""
import cv2
import numpy as np


def fit_wheels(img_bgr, mask, car_w, length_mm=None, wheelbase_mm=None, tyre_mm=None):
    image = np.asarray(img_bgr)
    if image.ndim != 3 or image.shape[2] != 3 or min(image.shape[:2]) < 24:
        raise ValueError('img_bgr must be a nonempty HxWx3 BGR image')
    if image.dtype != np.uint8:
        raise ValueError('img_bgr must use uint8 pixels')
    if mask is not None and np.asarray(mask).shape != image.shape[:2]:
        raise ValueError('mask must have the same height/width as the image')
    if mask is not None:
        mask=(np.asarray(mask)>0).astype(np.uint8)*255
    if car_w <= 0 or abs(car_w-image.shape[1]) > 1:
        raise ValueError('car_w must be the cropped/scaled image width')
    if any(v is not None and v <= 0 for v in (length_mm, wheelbase_mm, tyre_mm)):
        raise ValueError('physical dimensions must be positive or None')
    if length_mm and wheelbase_mm and wheelbase_mm >= length_mm:
        raise ValueError('wheelbase must be shorter than length')
    # Work at a canonical 900 pixels; map the result back to caller coordinates.
    scale = 900./car_w
    if scale != 1:
        image = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        if mask is not None:
            mask = cv2.resize(np.asarray(mask), (image.shape[1],image.shape[0]), interpolation=cv2.INTER_NEAREST)
    h,w = image.shape[:2]
    r0 = w*tyre_mm/(2*length_mm) if length_mm and tyre_mm else w*.075
    wb = w*wheelbase_mm/length_mm if wheelbase_mm and length_mm else None
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY).astype(np.float32)/255
    blur = cv2.GaussianBlur(gray,(0,0),1.1)
    gx = cv2.Sobel(blur,cv2.CV_32F,1,0,ksize=3)/8
    gy = cv2.Sobel(blur,cv2.CV_32F,0,1,ksize=3)/8
    mag = np.hypot(gx,gy)
    # Distance to an edge lets candidates settle between Hough's integer bins.
    edge = cv2.Canny((blur*255).astype(np.uint8),35,100)
    dist = cv2.distanceTransform(255-edge,cv2.DIST_L2,3)
    angle = np.linspace(0,2*np.pi,144,endpoint=False).astype(np.float32)
    ux,uy = np.cos(angle),np.sin(angle)
    # The upper tyre is frequently hidden by the body; bottom may merge with shadow.
    visible = (uy > -.45) & (np.abs(ux) > .28)
    side = np.abs(ux) > .72

    def sample(a,x,y,r):
        return cv2.remap(a,(x+r*ux).reshape(1,-1),(y+r*uy).reshape(1,-1),cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)[0]

    def score(x,y,r):
        if not (.80*r0 <= r <= 1.30*r0 and .37*h < y < h-r*.25 and r*.8 < x < w-r*.8):
            return -100.
        radial = sample(gx,x,y,r)*ux + sample(gy,x,y,r)*uy
        # Angular bins limit the influence of one rope, sill or paving line.
        outward = np.maximum(radial,0)
        bins = np.array_split(np.where(visible,outward,0),12)
        outer = np.mean([min(float(np.max(b)),.15) for b in bins])/.08
        align = np.exp(-sample(dist,x,y,r)/2.2)
        ring_edge = float(np.mean(align[visible]))
        inner = sample(blur,x,y,.88*r)
        outside = sample(blur,x,y,1.08*r)
        contrast = float(np.mean(np.clip(outside[side]-inner[side],-.18,.4)))
        dark = float(np.mean(1-inner[visible]))
        # A wheel rim must be concentric, but its radius is not a fixed fraction.
        rim_scores=[]
        for k in (.42,.48,.54,.60,.66,.72,.78,.84):
            e=np.exp(-sample(dist,x,y,k*r)/1.7)
            radial_inner=np.abs(sample(gx,x,y,k*r)*ux+sample(gy,x,y,k*r)*uy)
            # A complete concentric rim, supported in all quadrants, fixes the
            # centre more reliably than an incomplete outer tyre in shadow.
            quadrants=[float(np.mean(v)) for v in np.array_split(e,4)]
            rim_scores.append(.65*float(np.mean(e))+.35*min(quadrants)+2*float(np.mean(radial_inner)))
        rim=max(rim_scores)
        prior = ((r/r0-1)/.32)**2
        return 1.2*ring_edge + .7*outer + 1.2*contrast + .25*dark + 3.0*rim - .08*prior

    # Hough on raw and locally normalized images supplies both rim and tyre seeds.
    seeds=[]
    raw = (blur*255).astype(np.uint8)
    clahe=cv2.createCLAHE(2.,(8,8)).apply(raw)
    for g in (raw,clahe):
        circles=cv2.HoughCircles(g,cv2.HOUGH_GRADIENT,1.25,max(8,r0*.30),param1=100,param2=24,minRadius=max(7,int(r0*.35)),maxRadius=int(r0*1.40))
        if circles is not None:
            for x,y,r in circles[0]:
                if .38*h < y < h-r0*.2 and (.07*w<x<.4*w or .59*w<x<.94*w):
                    seeds.append((float(x),float(y),float(r)))
    contours,_=cv2.findContours(edge,cv2.RETR_LIST,cv2.CHAIN_APPROX_NONE)
    for contour in contours:
        if len(contour)<30: continue
        (x,y),(a,b),theta=cv2.fitEllipse(contour)
        if min(a,b)<r0*.55 or max(a,b)>r0*2.5 or min(a,b)/max(a,b)<.72:continue
        if .38*h<y<h-r0*.2 and (.07*w<x<.4*w or .59*w<x<.94*w):
            seeds.append((float(x),float(y),r0))
    # Mask's lower lobes supply extra seeds only; they never truncate the search.
    if mask is not None and np.any(mask):
        m=np.asarray(mask)>0
        bottom=np.where(m.any(0),h-1-np.argmax(m[::-1],axis=0),0).astype(np.float32)
        smooth=cv2.GaussianBlur(bottom.reshape(1,-1),(0,0),max(2,r0*.25))[0]
        for lo,hi in ((.10,.36),(.62,.90)):
            ix=np.arange(int(lo*w),int(hi*w),max(4,int(r0*.20)))
            for x in sorted(ix,key=lambda i:smooth[i],reverse=True)[:8]:
                seeds.append((float(x),float(smooth[x]-r0),r0))
    # Include a sparse image-based grid when Hough fails on low contrast tyres.
    if not seeds:
        seeds=[(w*x,h*y,r0) for x in (.16,.22,.28,.70,.77,.84) for y in (.58,.70,.82)]
    candidates=[]
    for x,y,r in seeds:
        radii=np.arange(.81*r0,1.30*r0,max(2,r0*.07))
        values=[(score(x,y,float(rr)),x,y,float(rr)) for rr in radii]
        candidates.append(max(values))
    # Nonmax suppression before expensive centre/radius refinement.
    chosen=[]
    for c in sorted(candidates,reverse=True):
        if all(np.hypot(c[1]-d[1],c[2]-d[2])>r0*.22 for d in chosen):
            chosen.append(c)
        if len(chosen)>=22: break
    refined=[]
    for initial in chosen:
        best=initial
        for step in (max(2.,r0*.08),2.,.75):
            for iteration in range(12):
                _,x,y,r=best
                trial=[(score(x+dx,y+dy,r+dr),x+dx,y+dy,r+dr) for dx,dy,dr in ((step,0,0),(-step,0,0),(0,step,0),(0,-step,0),(0,0,step),(0,0,-step))]
                new=max([best]+trial)
                if new[0]<=best[0]+1e-5: break
                best=new
        refined.append(best)
    front=[c for c in refined if c[1]<w*.45]
    rear=[c for c in refined if c[1]>w*.55]
    if not front or not rear:
        raise ValueError('No plausible wheel pair; supply a nearer side view or inspect manually')
    pairs=[]
    for f in front:
        for r in rear:
            separation=r[1]-f[1]
            if wb and not .78*wb < separation < 1.22*wb: continue
            if abs(f[2]-r[2]) > .65*r0: continue
            penalty=(abs(separation/wb-1)*2 if wb else 0)+.60*abs(f[2]-r[2])/r0
            pairs.append((f[0]+r[0]-penalty,f,r))
    if not pairs:
        raise ValueError('Wheel candidates disagree with supplied wheelbase; inspect manually')
    best=max(pairs,key=lambda c:c[0])
    result=[]
    lower=(uy>.12)&(np.abs(ux)>.25)
    for candidate in best[1:]:
        _,x,y,oldr=candidate
        def tyre_radius_score(r):
            radial=sample(gx,x,y,r)*ux+sample(gy,x,y,r)*uy
            transition=sample(blur,x,y,r+2.5)-sample(blur,x,y,r-2.5)
            support=np.exp(-sample(dist,x,y,r)/1.7)
            # Ignore the occluded upper arc: the wheel arch is not the tyre.
            return (2.5*float(np.mean(np.maximum(radial[lower],0)))+
                    .7*float(np.mean(np.clip(transition[lower],-.1,.3)))+
                    .10*float(np.mean(support[lower]))-.025*((r/r0-1)/.3)**2)
        radii=np.arange(max(.80*r0,oldr*.82),min(1.30*r0,oldr*1.15),.5)
        radius=max(radii,key=tyre_radius_score) if len(radii) else oldr
        result.append((float(x/scale),float(y/scale),float(radius/scale)))
    return result
