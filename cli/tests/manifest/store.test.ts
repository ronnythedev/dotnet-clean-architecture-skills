import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { ManifestStore } from "../../src/manifest/store.js";
import { createTmpDir, removeTmpDir } from "../helpers/tmp-dir.js";

describe("ManifestStore", () => {
  let tmp: string;
  let store: ManifestStore;

  beforeEach(() => {
    tmp = createTmpDir();
    store = new ManifestStore(join(tmp, ".dotnet-clean-arch"));
  });
  afterEach(() => removeTmpDir(tmp));

  it("read() returns empty manifest when file doesn't exist", () => {
    expect(store.read()).toEqual({ v: 1, entries: [] });
  });

  it("append() persists an entry", () => {
    store.append({
      v: 1,
      installedAt: "2026-05-19T00:00:00Z",
      skill: "x",
      agent: "claude-code",
      scope: "global",
      method: "copy",
      target: "/abs/path"
    });

    const m = store.read();
    expect(m.entries).toHaveLength(1);
    expect(m.entries[0]!.skill).toBe("x");
  });

  it("filter() returns matching entries", () => {
    store.append({ v: 1, installedAt: "t", skill: "a", agent: "claude-code", scope: "global", method: "copy", target: "/p1" });
    store.append({ v: 1, installedAt: "t", skill: "b", agent: "cursor", scope: "project", method: "copy", target: "/p2" });

    expect(store.filter({ agent: "claude-code" })).toHaveLength(1);
    expect(store.filter({ skill: "b" })[0]!.target).toBe("/p2");
  });

  it("remove() drops matching entries from the manifest", () => {
    store.append({ v: 1, installedAt: "t", skill: "a", agent: "claude-code", scope: "global", method: "copy", target: "/p1" });
    store.remove(e => e.target === "/p1");

    expect(store.read().entries).toEqual([]);
  });

  it("manifest file lives at <root>/manifest.json", () => {
    store.append({ v: 1, installedAt: "t", skill: "a", agent: "claude-code", scope: "global", method: "copy", target: "/p" });
    expect(existsSync(join(tmp, ".dotnet-clean-arch", "manifest.json"))).toBe(true);
  });
});
