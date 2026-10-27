import { execSync } from 'node:child_process';
import { existsSync, unlinkSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const zipPath = resolve('luxury-lighting-deploy.zip');

if (existsSync(zipPath)) {
  unlinkSync(zipPath);
}

// Using tar on dist ensures forward-slash (/) paths in ZIP entries,
// which is required for Linux/cPanel/LiteSpeed web servers.
const cmd = `powershell -NoProfile -Command "Push-Location dist; tar -a -c -f '${zipPath.replace(/\\/g, '\\\\')}' * .htaccess; Pop-Location"`;
execSync(cmd, { stdio: 'inherit' });

const stat = statSync(zipPath);
console.log(`Successfully created ${zipPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB) with forward-slash paths.`);
