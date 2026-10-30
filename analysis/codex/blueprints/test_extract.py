import unittest
from pathlib import Path
import cv2,numpy as np
from extract import binary_lines,find_side_view,normalize,infer_orientation,SideView,Reject
from build import external_root,make_split

class ExtractionTests(unittest.TestCase):
    def sheet(self):
        sheet=np.full((600,1000,3),255,np.uint8)
        # Original synthetic fixture, no external drawing or copied geometry.
        body=np.array([[120,310],[150,270],[250,265],[325,200],[600,200],[670,265],[810,280],[835,320],[825,340],[125,340]],np.int32)
        cv2.polylines(sheet,[body],True,(0,0,0),2)
        for x in(250,700):cv2.circle(sheet,(x,340),40,(0,0,0),2);cv2.circle(sheet,(x,340),25,(0,0,0),2)
        cv2.rectangle(sheet,(340,212),(590,255),(0,0,0),2)
        # Front/rear views and pale watermark/grid distractors.
        cv2.rectangle(sheet,(80,430),(240,560),(0,0,0),2)
        cv2.rectangle(sheet,(730,440),(890,560),(0,0,0),2)
        watermark=np.full_like(sheet,255);cv2.line(watermark,(0,90),(999,450),(220,220,220),2);sheet=np.minimum(sheet,watermark)
        return sheet
    def test_watermark(self):
        image=np.full((150,300,3),255,np.uint8);image[30:32,30:270]=0;image[80:83,10:290]=210
        ink=binary_lines(image);self.assertTrue(ink[30,50]);self.assertFalse(ink[81,50])
    def test_find_and_normalize(self):
        side=find_side_view(self.sheet());self.assertGreater(side.box[2],600)
        self.assertEqual(len(side.wheels),2)
        x,y,w=normalize(side,'front_left');self.assertEqual(x.shape,(256,512,3));self.assertEqual(y.shape,(256,512));self.assertLess(abs(max(cy+r for _,cy,r in w)-220),1)
        self.assertGreater(np.count_nonzero(x[:,:,0]),2000)
        self.assertGreater(np.count_nonzero(y),100)
        self.assertLessEqual(cv2.boundingRect(x[:,:,0])[2],482)
    def test_flip(self):
        side=find_side_view(self.sheet());a,b,wa=normalize(side,'front_left');c,d,wb=normalize(side,'front_right')
        self.assertLess(abs(wa[0][2]-wb[1][2]),1)
        self.assertLess(abs(np.count_nonzero(a[:,:,0])-np.count_nonzero(c[:,:,0])),100)
    def test_unknown_orientation_rejected(self):
        side=find_side_view(self.sheet())
        with self.assertRaises(Reject):normalize(side,None)
    def test_no_car(self):
        with self.assertRaises(Reject):find_side_view(np.full((300,600,3),255,np.uint8))
    def test_repo_output_rejected(self):
        with self.assertRaises(ValueError):external_root(Path(__file__).parent/'raw')
    def test_make_split(self):
        rows=[{'make':m}for m in ['a','a','b','b','c','d','e']];s=make_split(rows)
        self.assertEqual(len(s),5);self.assertIn('val',s.values());self.assertIn('train',s.values());self.assertEqual(s,make_split(rows[::-1]))
if __name__=='__main__':unittest.main()
