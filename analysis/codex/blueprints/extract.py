"""CPU-only side-view extraction. Ambiguous views/orientations are rejected.
No source image is displayed or written by this module. Pure arrays in/out.
"""
from dataclasses import dataclass
import cv2
import numpy as np

cv2.setNumThreads(2)

class Reject(ValueError):
    pass

@dataclass
class SideView:
    lines: np.ndarray
    silhouette: np.ndarray
    wheels: list
    box: tuple
    confidence: float


def binary_lines(image, threshold=110):
    if image is None or image.ndim not in (2,3):
        raise Reject('invalid-image')
    gray=cv2.cvtColor(image,cv2.COLOR_BGR2GRAY) if image.ndim==3 else image
    if gray.size<10000 or min(gray.shape)<100:
        raise Reject('image-too-small')
    # Near-black source strokes only. Do not adaptively amplify pale watermarks.
    ink=(gray<threshold).astype(np.uint8)*255
    density=float((ink>0).mean())
    if not .001<density<.35:
        raise Reject('not-a-light-background-line-drawing')
    return ink


def _regions(ink):
    h,w=ink.shape
    joined=cv2.morphologyEx(ink,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    joined=cv2.dilate(joined,np.ones((max(3,h//140),max(3,w//140)),np.uint8))
    n,lab,stats,_=cv2.connectedComponentsWithStats(joined)
    regions=[]
    for x,y,bw,bh,area in stats[1:]:
        if bw>w*.20 and bh>h*.07 and 1.6<bw/max(bh,1)<7 and bw*bh<w*h*.85:
            pad=max(4,w//200)
            regions.append((max(0,x-pad),max(0,y-pad),min(w,x+bw+pad),min(h,y+bh+pad)))
    return regions


def _fill_car(ink, circles):
    # External contours keep the car's concave shape, unlike a convex hull.
    closed=cv2.morphologyEx(ink,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    contours,_=cv2.findContours(closed,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    h,w=ink.shape
    candidates=[]
    for c in contours:
        x,y,bw,bh=cv2.boundingRect(c);a=cv2.contourArea(c)
        if bw>w*.65 and bh>h*.22 and .12*w*h<a<.92*w*h:
            candidates.append((a,c))
    if not candidates:
        raise Reject('outer-car-contour-not-closed')
    mask=np.zeros_like(ink);cv2.drawContours(mask,[max(candidates,key=lambda t:t[0])[1]],-1,255,-1)
    for x,y,r in circles:
        if mask[max(0,min(h-1,round(y-r*.8))),max(0,min(w-1,round(x)))]==0:
            # A detached wheel far below a different view is not car evidence.
            near=cv2.dilate(mask,np.ones((max(3,round(r)),max(3,round(r))),np.uint8))
            if near[min(h-1,round(y)),min(w-1,round(x))]==0:
                raise Reject('wheel-detached-from-body')
        cv2.circle(mask,(round(x),round(y)),round(r),255,-1)
    return mask


def find_side_view(image, threshold=110):
    h0,w0=image.shape[:2];s=min(1.,1600/max(h0,w0))
    work=cv2.resize(image,None,fx=s,fy=s,interpolation=cv2.INTER_AREA) if s!=1 else image
    ink=binary_lines(work,threshold);h,w=ink.shape
    circles=cv2.HoughCircles(255-ink,cv2.HOUGH_GRADIENT,1.,max(8,w*.01),param1=100,param2=20,minRadius=max(5,round(w*.012)),maxRadius=max(8,round(w*.09)))
    if circles is None:
        raise Reject('no-wheel-circles')
    circles=circles[0][:160]
    distance=cv2.distanceTransform(255-ink,cv2.DIST_L2,3)
    angle=np.linspace(0,2*np.pi,120,endpoint=False,dtype=np.float32)
    def support(circle):
        x,y,r=circle
        xs=(x+r*np.cos(angle)).reshape(1,-1);ys=(y+r*np.sin(angle)).reshape(1,-1)
        d=cv2.remap(distance,xs,ys,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=100)
        return float(np.mean(d<2.3))
    circles=np.array([c for c in circles if support(c)>.58])
    if len(circles)<2:raise Reject('wheel-circles-have-insufficient-edge-support')
    hypotheses=[]
    for x0,y0,x1,y1 in _regions(ink):
        bw,bh=x1-x0,y1-y0
        cs=[(float(x-x0),float(y-y0),float(r)) for x,y,r in circles if x0+r*.6<x<x1-r*.6 and y0+bh*.62<y<y1-r*.3 and .035*bw<r<.14*bw and .10*bh<r<.32*bh and y+r>y1-.18*bh]
        for i,a in enumerate(cs):
            for b in cs[i+1:]:
                left,right=sorted([a,b]);r=(left[2]+right[2])/2;dx=right[0]-left[0]
                if not (3.5*r<dx<17*r and .65<left[2]/right[2]<1.5 and abs(left[1]-right[1])<r*.40):continue
                if not (.12*bw<left[0]<.40*bw and .60*bw<right[0]<.88*bw):continue
                try:mask=_fill_car(ink[y0:y1,x0:x1],[left,right])
                except Reject:continue
                # The widest coherent two-wheel view wins, then alignment/size.
                confidence=bw/w-.10*abs(left[1]-right[1])/r+.12*r/bw
                hypotheses.append(SideView(ink[y0:y1,x0:x1],mask,[left,right],(x0/s,y0/s,bw/s,bh/s),confidence))
    if not hypotheses:
        raise Reject('no-coherent-two-wheel-side-view')
    hypotheses.sort(key=lambda c:c.confidence,reverse=True)
    best=hypotheses[0]
    # Same region with a different rim is one hypothesis; prefer outer circles.
    same=[p for p in hypotheses if p.box==best.box and all(np.hypot(a[0]-b[0],a[1]-b[1])<max(a[2],b[2])*.30 for a,b in zip(p.wheels,best.wheels))]
    if same:best=max(same,key=lambda p:sum(c[2]for c in p.wheels))
    independent=[p for p in hypotheses if p.box!=best.box and p.confidence>best.confidence-.025]
    for p in independent:
        a=best.box;b=p.box
        ix=max(0,min(a[0]+a[2],b[0]+b[2])-max(a[0],b[0]));iy=max(0,min(a[1]+a[3],b[1]+b[3])-max(a[1],b[1]));iou=ix*iy/(a[2]*a[3]+b[2]*b[3]-ix*iy+1e-6)
        if iou<.4:raise Reject('multiple-equally-plausible-side-views')
    return best


def infer_orientation(side):
    """Only label pronounced hatchback-like asymmetry; most sedans need review.

    Returns front_left, front_right or None. No shorter-overhang default.
    The candidate remains explicitly provisional until independently reviewed.
    """
    m=side.silhouette>0;h,w=m.shape;top=np.where(m.any(0),np.argmax(m,axis=0),h)
    (x1,y1,r1),(x2,y2,r2)=side.wheels
    roof=float(np.percentile(top[int(x1):int(x2)],15));belt=min(y1-r1*.7,y2-r2*.7)
    cabin=np.where((top<roof+.22*max(1,belt-roof))&(np.arange(w)>x1)&(np.arange(w)<x2))[0]
    if len(cabin)<w*.12:return None
    l,r=int(cabin.min()),int(cabin.max())
    # A nearly vertical rear end plus a long sloping windscreen is a strong cue.
    left=np.where(top[:l]>belt)[0];right=np.where(top[r:]>belt)[0]
    if not len(left)or not len(right):return None
    run_l=l-left[-1];run_r=right[0]
    if max(run_l,run_r)<w*.10 or min(run_l,run_r)>w*.035:return None
    if max(run_l,run_r)/max(1,min(run_l,run_r))<3:return None
    return 'front_left' if run_l>run_r else 'front_right'


def normalize(side, orientation, width=512, height=256, car_width=480, ground=220):
    if orientation not in ('front_left','front_right'):
        raise Reject('orientation-unknown')
    lines=side.lines.copy();mask=side.silhouette.copy();wheels=list(side.wheels)
    if orientation=='front_right':
        lines=cv2.flip(lines,1);mask=cv2.flip(mask,1);wheels=sorted([(lines.shape[1]-1-x,y,r)for x,y,r in wheels])
    x,y,w,h=cv2.boundingRect(mask)
    scale=car_width/w
    ground_src=max(cy+r for _,cy,r in wheels)
    roof_src=y
    if (ground_src-roof_src)*scale>ground-12:
        raise Reject('car-too-tall-for-fixed-width-canvas')
    tx=(width-car_width)/2-x*scale;ty=ground-ground_src*scale
    transform=np.array([[scale,0,tx],[0,scale,ty]],np.float32)
    # Drop outside dimensions/text using the actual silhouette, not a rectangle.
    support=cv2.dilate(mask,np.ones((3,3),np.uint8))
    clean=cv2.bitwise_and(lines,support)
    target=cv2.warpAffine(clean,transform,(width,height),flags=cv2.INTER_AREA)
    target=(target>96).astype(np.uint8)*255
    silhouette=cv2.warpAffine(mask,transform,(width,height),flags=cv2.INTER_NEAREST)
    wheel=np.zeros((height,width),np.uint8);normalized=[]
    for cx,cy,r in wheels:
        xx,yy,rr=cx*scale+tx,cy*scale+ty,r*scale
        cv2.circle(wheel,(round(xx),round(yy)),round(rr),255,-1);normalized.append((xx,yy,rr))
    outer=cv2.morphologyEx(silhouette,cv2.MORPH_GRADIENT,np.ones((3,3),np.uint8))
    # RGB semantics: R=silhouette, G=wheels, B=outer contour (PNG saved in BGR).
    input_rgb=np.dstack([silhouette,wheel,outer])
    return input_rgb,target,normalized
