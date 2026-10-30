"""In-memory extraction check. No source pixels or derivatives are saved/displayed."""
import sys,json
from pathlib import Path
# Optional existing OpenCV dependency directory for the restricted Codex runtime.
if len(sys.argv)>1:sys.path.insert(0,sys.argv[1])
import cv2,numpy as np
from extract import find_side_view,infer_orientation,Reject
raw=sys.stdin.buffer.read(25*1024*1024+1)
if len(raw)>25*1024*1024:raise ValueError('image too large')
image=cv2.imdecode(np.frombuffer(raw,np.uint8),cv2.IMREAD_COLOR)
if image is None:raise ValueError('cannot decode image')
try:
    side=find_side_view(image)
    print(json.dumps({'status':'side-found','orientationResolved':infer_orientation(side)is not None}))
except Reject as e:
    print(json.dumps({'status':'skipped','reason':str(e)}))
