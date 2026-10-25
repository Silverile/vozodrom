import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
let snapshot;
export function archive(){return snapshot??=fs.existsSync('analysis/codex/wikidata-snapshot.json.gz')?JSON.parse(gunzipSync(fs.readFileSync('analysis/codex/wikidata-snapshot.json.gz'))):{queries:{}};}
export function rawNames(){return [...new Set([...Object.keys(archive().queries).map(n=>n+'.json'),...(fs.existsSync('analysis/codex/raw')?fs.readdirSync('analysis/codex/raw'):[])])];}
export function readRaw(name){name=name.replace(/\.json$/,'');const path=`analysis/codex/raw/${name}.json`;return fs.existsSync(path)?JSON.parse(fs.readFileSync(path)):archive().queries[name]?.result;}
