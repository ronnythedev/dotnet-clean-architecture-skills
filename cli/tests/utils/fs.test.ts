import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { copyDir, symlinkOrCopyDir, removeIfOurs } from "../../src/utils/fs.js";
import { createTmpDir, removeTmpDir } from "../helpers/tmp-dir.js";

describe("fs utils", () => {
  let tmp: string;

  beforeEach(() => { tmp = createTmpDir(); });
  afterEach(() => { removeTmpDir(tmp); });

  it("copyDir recursively copies a directory", () => {
    const src = join(tmp, "src");
    mkdirSync(join(src, "nested"), { recursive: true });
    writeFileSync(join(src, "a.txt"), "alpha");
    writeFileSync(join(src, "nested", "b.txt"), "beta");

    const dst = join(tmp, "dst");
    copyDir(src, dst);

    expect(readFileSync(join(dst, "a.txt"), "utf8")).toBe("alpha");
    expect(readFileSync(join(dst, "nested", "b.txt"), "utf8")).toBe("beta");
  });

  it("symlinkOrCopyDir creates a symlink on non-Windows", () => {
    if (process.platform === "win32") return;
    const src = join(tmp, "src");
    mkdirSync(src);
    writeFileSync(join(src, "x.txt"), "x");

    const dst = join(tmp, "linked");
    symlinkOrCopyDir(src, dst);

    expect(lstatSync(dst).isSymbolicLink()).toBe(true);
    expect(readFileSync(join(dst, "x.txt"), "utf8")).toBe("x");
  });

  it("removeIfOurs removes a symlink that resolves into the expected root", () => {
    const src = join(tmp, "src");
    mkdirSync(src);
    const link = join(tmp, "link");
    symlinkSync(src, link, "dir");

    expect(removeIfOurs(link, tmp)).toBe(true);
    expect(existsSync(link)).toBe(false);
  });

  it("removeIfOurs refuses to remove a symlink resolving outside expected root", () => {
    const outside = createTmpDir("outside-");
    const link = join(tmp, "link");
    symlinkSync(outside, link, "dir");

    expect(removeIfOurs(link, tmp)).toBe(false);
    expect(existsSync(link)).toBe(true);

    removeTmpDir(outside);
  });

  it("removeIfOurs removes a real directory when its parent matches expected root", () => {
    const dir = join(tmp, "dir");
    mkdirSync(dir);
    writeFileSync(join(dir, "f"), "");

    expect(removeIfOurs(dir, tmp)).toBe(true);
    expect(existsSync(dir)).toBe(false);
  });
});
