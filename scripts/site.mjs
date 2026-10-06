import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const demo = resolve(root, "docs/demo");
if (!demo.startsWith(root + "/") && !demo.startsWith(root + "\\")) throw new Error("Invalid build target");
// Only this generated build directory is replaced. No source, releases or user data.
await rm(demo, { recursive: true, force: true });
await mkdir(demo, { recursive: true });
await cp(resolve(root, "dist"), demo, { recursive: true });
console.log(`Built public demo into docs/demo (${(await readdir(demo)).length} entries).`);
