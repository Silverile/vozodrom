"""Frozen pre-change wheel implementation, for comparison only."""
from pathlib import Path
import cv2,numpy as np

def fit_wheels_baseline(img_bgr,mask,car_w,length_mm,wheelbase_mm,tyre_mm):
    text=(Path(__file__).parent/'baseline-source.py').read_text(encoding='utf-8-sig')
    block=text[text.index('# 2. wheels.'):text.index('# 3. silhouette clean-up')]
    gray=cv2.cvtColor(img_bgr,cv2.COLOR_BGR2GRAY);h=gray.shape[0];has=mask.max(0)>0
    bottom=np.where(has,h-1-np.argmax(mask[::-1]>0,0),0)
    scope=dict(cv2=cv2,np=np,gray=gray,h=h,mask=mask,CAR_W=car_w,length_mm=length_mm,wheelbase_mm=wheelbase_mm,opt=lambda k:tyre_mm if k=='--tyre' else None,args=[],bottom=bottom,has=has)
    exec(block,scope)
    return scope['wheels']
