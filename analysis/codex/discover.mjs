for (const search of ['automobile manufacturer','motorcycle manufacturer','truck manufacturer','bus manufacturer','tractor manufacturer','construction equipment manufacturer','trailer manufacturer','tire manufacturer','automobile model','motorcycle model','car body style','vehicle model series']) {
 const u='https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&limit=3&search='+encodeURIComponent(search);
 const r=await (await fetch(u)).json(); console.log(search,JSON.stringify(r.search?.map(x=>({id:x.id,label:x.label,description:x.description}))));
}
