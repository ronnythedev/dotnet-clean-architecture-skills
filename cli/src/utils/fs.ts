import {
  cpSync, mkdirSync, lstatSync, existsSync, symlinkSync, rmSync, realpathSync
} from "node:fs";
import { dirname, resolve, sep } from "node:path";

export function copyDir(src: string, dst: string): void {
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(src, dst, { recursive: true, force: true });
}

export function symlinkOrCopyDir(src: string, dst: string): void {
  mkdirSync(dirname(dst), { recursive: true });
  if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
  if (process.platform === "win32") {
    copyDir(src, dst);
    return;
  }
  symlinkSync(src, dst, "dir");
}

/**
 * Removes `target` (file, dir, or symlink) only if it appears to belong to us:
 * - For a symlink: its resolved path must live under `expectedRoot`.
 * - For a real file or directory: its parent directory must equal `expectedRoot`,
 *   meaning the caller is operating in a directory they manage.
 *
 * Returns true if removal happened, false if the safety check failed.
 */
export function removeIfOurs(target: string, expectedRoot: string): boolean {
  if (!existsSync(target) && !isBrokenSymlink(target)) return false;

  const root = realResolve(expectedRoot);

  if (lstatSync(target).isSymbolicLink()) {
    const resolved = safeRealpath(target);
    if (!resolved || !isUnder(resolved, root)) return false;
    rmSync(target, { force: true });
    return true;
  }

  const parent = realResolve(dirname(target));
  if (parent !== root && !isUnder(parent, root)) return false;
  rmSync(target, { recursive: true, force: true });
  return true;
}

function isBrokenSymlink(p: string): boolean {
  try { return lstatSync(p).isSymbolicLink(); } catch { return false; }
}

function safeRealpath(p: string): string | null {
  try { return realpathSync(p); } catch { return null; }
}

/** Resolves p, then follows symlinks where possible. Falls back to plain resolve for non-existent paths. */
function realResolve(p: string): string {
  try { return realpathSync(p); } catch { return resolve(p); }
}

function isUnder(child: string, parent: string): boolean {
  return child === parent || child.startsWith(parent + sep);
}
