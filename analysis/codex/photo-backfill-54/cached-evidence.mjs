import fs from 'node:fs';
const d='analysis/codex/photo-backfill-54',p=d+'/candidates.json',a=JSON.parse(fs.readFileSync(p));
const title='File:Ferrari F40 - Flickr - Alexandre Prévot (1).jpg';
if(!a.some(x=>x.title===title))a.push({id:Math.max(...a.map(x=>x.id))+1,makeSlug:'ferrari',lineSlug:'f40',generationIndex:0,title,metadataMethod:'Cached exact Commons file page: original image dimensions, Author row, CC BY-SA 2.0 file-specific licence and Flickr licence review. Full thumbnail personally inspected. Existing photographer watermark retained.',ii:{url:'https://upload.wikimedia.org/wikipedia/commons/a/ab/Ferrari_F40_-_Flickr_-_Alexandre_Pr%C3%A9vot_%281%29.jpg',descriptionurl:'https://commons.wikimedia.org/wiki/File:Ferrari_F40_-_Flickr_-_Alexandre_Pr%C3%A9vot_(1).jpg',width:3000,height:2000,extmetadata:{Artist:{value:'Alexandre Prévot'},LicenseShortName:{value:'CC BY-SA 2.0'},LicenseUrl:{value:'https://creativecommons.org/licenses/by-sa/2.0/'}}}});
fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n');
console.log(a.find(x=>x.title===title).id);
