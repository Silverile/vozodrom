# Line drawings (reference set)

Blueprint-style placeholders for model generations that have no usable photo. They are drawn by `scripts/lineart.py` from a side-view photo on Wikimedia Commons. Every drawing is a derivative of its source photo, so it keeps that photo's licence and attribution.

| File | Model | Source photo | Licence | Author |
|---|---|---|---|---|
| gaz12.png | GAZ-12 ZIM | [GAZ-12 in Donetsk (side view)](https://commons.wikimedia.org/wiki/File:GAZ-12_in_Donetsk_(side_view).jpg) | CC BY-SA 3.0 | Andrey Butko |
| gaz13.png | GAZ-13 Čajka | [Arkhangelskoye … GAZ 13 Chaika IMG 9616](https://commons.wikimedia.org/wiki/File:Arkhangelskoye_Vadim_Zadorozhnys_Vehicle_Museum_GAZ_13_Chaika_IMG_9616_2150.jpg) | CC BY-SA 4.0 | Alexxx1979 |
| gaz14.png | GAZ-14 Čajka | [Pfingsttreffen Puetnitz 2018 (1X7A2447)](https://commons.wikimedia.org/wiki/File:Pfingsttreffen_Puetnitz_2018,_Ribnitz-Damgarten_(1X7A2447).jpg) | CC BY-SA 4.0 | Matti Blume |
| gaz21.png | GAZ-21 Volha | [GAZ-21 (2nd series) "Volga" in Nizhny Novgorod (side view)](https://commons.wikimedia.org/wiki/File:GAZ-21_(2nd_series)_%22Volga%22_in_Nizhny_Novgorod,_11_June_2009_(side_view).jpg) | Public domain | DL24 |

## Commands used

The `--wheels` values were measured by hand from the `--debug` overlay, because the automatic wheel fit missed on three of the four photos.

```
py -P scripts/lineart.py gaz12.jpg gaz12.png --flip --length 5530 --wheelbase 3200 --height 1660 --tyre 760 --wheels 158,213,55,684,218,58
py -P scripts/lineart.py gaz13.jpg gaz13.png --length 5600 --wheelbase 3250 --height 1620 --tyre 760 --wheels 157,222,58,696,207,55
py -P scripts/lineart.py gaz14.jpg gaz14.png --flip --length 6114 --wheelbase 3450 --height 1525 --tyre 730 --wheels 184,182,61,708,168,52
py -P scripts/lineart.py gaz21.jpg gaz21.png --flip --length 4810 --wheelbase 2700 --height 1620 --tyre 720 --wheels 141,262,63,657,260,65
```

The script needs these packages: `opencv-python-headless`, `rembg[cpu]`, `ultralytics`, `scipy`, `scikit-image` and `pillow`. On the first run it downloads its models: BiRefNet (~900 MB) and yolo11m-seg.
