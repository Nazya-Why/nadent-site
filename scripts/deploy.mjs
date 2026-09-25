/**
 * Build with the GitHub Pages base path and publish out/ to the gh-pages branch.
 * Usage: npm run deploy   (repo name is read from the git remote)
 * Alternative: CI deploy via docs/github-actions-deploy.yml (needs a token with `workflow` scope).
 */
import { execSync } from "node:child_process";
import { mkdtempSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const remote = execSync("git remote get-url origin").toString().trim();
const [, owner, repo] = remote.match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/) ?? [];
if (!owner) throw new Error(`Cannot parse GitHub remote: ${remote}`);

const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: `/${repo}`,
  NEXT_PUBLIC_SITE_URL: `https://${owner.toLowerCase()}.github.io/${repo}`,
  NEXT_TELEMETRY_DISABLED: "1",
};
run("npm run build", { env });

const dir = mkdtempSync(path.join(tmpdir(), "nadent-pages-"));
cpSync("out", dir, { recursive: true });
const sha = execSync("git rev-parse --short HEAD").toString().trim();
run("git init -q -b gh-pages", { cwd: dir });
run("git add -A", { cwd: dir });
run(`git -c user.name=deploy -c user.email=deploy@localhost commit -q -m "Deploy ${sha}"`, { cwd: dir });
run(`git push -f ${remote} gh-pages`, { cwd: dir });
rmSync(dir, { recursive: true, force: true });
console.log(`Deployed ${sha} → https://${owner.toLowerCase()}.github.io/${repo}/`);
