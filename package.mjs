import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['build.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['verify.mjs'],{stdio:'inherit'});
const root=path.resolve('dist');
const files=await fs.readdir(root,{recursive:true});
for(const file of files){const full=path.join(root,file);if((await fs.stat(full)).isFile()&&/\.(html|json|js)$/i.test(file)){const text=await fs.readFile(full,'utf8');if(/SSECH|SSEXCH|TENEXCH/.test(text))throw Error(`Unapproved product in ${file}`);}}
console.log('Source and static package checks complete. Archive dist with index.html at ZIP root.');
