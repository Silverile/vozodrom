import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const url='https://cdn.skoda-storyboard.com/2018/08/09-Skoda-4R-limousina.jpg';
const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('HTTP '+r.status);
const p=path.join(os.tmpdir(),'vozodrom-step9-4r.jpg');fs.writeFileSync(p,Buffer.from(await r.arrayBuffer()));console.log(p);
