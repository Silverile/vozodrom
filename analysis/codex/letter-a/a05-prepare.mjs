import fs from 'node:fs';
const root='analysis/codex/letter-a';
const chrono='https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology';
const specs=[
['slx--0','SLX','SLX — MY1996–1999','1995–?','SLX','1997 Acura SLX in Cream White-Light Silver Metallic, front left, 08-15-2022.jpg','1997 SUV, original 1996–1997 front'],
['tl--0','TL','I — MY1996–1998','1995–1998','TL I','1st Acura TL.jpg','1996–1998 sedan, original first-generation front'],
['tl--1','TL','II — MY1999–2003','1998–2003','TL II','1999-2001 Acura TL -- 03-21-2012.JPG','1999–2001 3.2TL sedan, pre-facelift'],
['tl--2','TL','III — MY2004–2008','2003–2008','TL III','2004-2006 Acura TL.jpg','2004–2006 standard sedan, pre-facelift'],
['tl--3','TL','IV — MY2009–2014','2008–2014','TL IV','2009 Acura TL.jpg','2009 sedan, original 2009–2011 shield front'],
['tlx--0','TLX','I — MY2015–2020','2014–2020','TLX I','2015 Acura TLX SH-AWD, front 12.30.19.jpg','2015 SH-AWD sedan, pre-facelift'],
['tlx--1','TLX','II — od MY2021','2020–?','TLX II','2021 Acura TLX Technology, front 7.2.22.jpg','2021 Technology sedan, original second-generation front','https://acuranews.com/en-US/releases/2021-acura-tlx-press-kit'],
['tsx--0','TSX','I — MY2004–2008','2003–2008','TSX I','06-08 Acura TSX.jpg','2006–2008 CL9 sedan, facelift'],
['tsx--1','TSX','II — MY2009–2014','2008–2014','TSX II','2009 Acura TSX.jpg','2009 CU2 sedan, pre-facelift'],
['vigor--0','Vigor','Acura Vigor — MY1992–1994','?–?','Vigor','1992 Acura Vigor GS in black, front right.jpg','1992 GS sedan, North American Acura front'],
['zdx--0','ZDX','I — spalovací crossover','2009–2013','ZDX I','2010 Acura ZDX -- 03-15-2010.jpg','2010 YB1 crossover, original front'],
['zdx--1','ZDX','II — elektrické SUV','2024–2025','ZDX II','2024 Acura ZDX A-Spec AWD (United States) front view.jpg','2024 A-Spec AWD electric SUV','https://acuranews.com/en-US/releases/release-50763955e7ef98f595b7e8fb0e005c30-2024-acura-zdx-zdx-type-s-specifications-features']
];
let old=fs.readFileSync(root+'/a04.mjs','utf8');
const start=old.indexOf('const specs=['),end=old.indexOf('\nlet rows=',start);
old=old.slice(0,start)+'const specs='+JSON.stringify(specs)+';'+old.slice(end);
old=old.replaceAll('a-04','a-05').replaceAll('a04-','a05-');
old=old.replace("['https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_'),evidence]","['https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_'),evidence||chrono]");
fs.writeFileSync(root+'/a05.mjs',old);
