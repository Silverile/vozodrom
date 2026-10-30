"""Deterministic geometry tests; synthetic results are not real-photo acceptance."""
import sys,json
from pathlib import Path
root=Path(__file__).parent;sys.path.insert(0,str(root/'deps'))
import cv2,numpy as np
from wheels import fit_wheels
out=[]
for name,radii,centres,occlusion in [('plain',(60,60),((170,240),(710,240)),False),('perspective',(62,52),((180,240),(720,224)),False),('shadow-mask-loss',(60,60),((170,240),(710,240)),True)]:
    image=np.full((380,900,3),190,np.uint8);mask=np.zeros((380,900),np.uint8)
    cv2.rectangle(image,(15,100),(880,235),(95,110,130),-1);cv2.rectangle(mask,(15,100),(880,235),255,-1)
    for (x,y),r in zip(centres,radii):
        cv2.circle(image,(x,y),r,(20,20,20),-1);cv2.circle(image,(x,y),int(r*.64),(205,205,205),-1);cv2.circle(image,(x,y),int(r*.20),(70,70,70),-1);cv2.circle(mask,(x,y),r,255,-1)
    if occlusion:
        mask[260:]=0;cv2.line(image,(0,290),(899,290),(28,28,28),5);cv2.line(image,(145,80),(225,320),(40,30,150),5)
    found=fit_wheels(image,mask,900,5000,3000,667);ce=[float(np.linalg.norm(np.array(c[:2])-t)/r)for c,t,r in zip(found,centres,radii)];re=[abs(c[2]-r)/r for c,r in zip(found,radii)];out.append({'case':name,'found':found,'centerError':ce,'radiusError':re,'pass':all(x<.04 for x in ce)and all(x<.08 for x in re)})
print(json.dumps(out,indent=2));(root/'synthetic-results.json').write_text(json.dumps(out,indent=2))

assert all(case["pass"] for case in out), "synthetic geometry regression"
