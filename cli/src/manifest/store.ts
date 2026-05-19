import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { Manifest, ManifestEntry } from "./types.js";

export class ManifestStore {
  private readonly file: string;

  constructor(private readonly root: string = join(homedir(), ".dotnet-clean-arch")) {
    this.file = join(root, "manifest.json");
  }

  read(): Manifest {
    if (!existsSync(this.file)) return { v: 1, entries: [] };
    const raw = readFileSync(this.file, "utf8");
    const parsed = JSON.parse(raw) as Manifest;
    if (parsed.v !== 1) {
      throw new Error(`Unsupported manifest version: ${parsed.v}`);
    }
    return parsed;
  }

  append(entry: ManifestEntry): void {
    const m = this.read();
    m.entries.push(entry);
    this.write(m);
  }

  filter(query: Partial<Pick<ManifestEntry, "skill" | "agent" | "scope">>): ManifestEntry[] {
    return this.read().entries.filter(e =>
      (query.skill === undefined || e.skill === query.skill) &&
      (query.agent === undefined || e.agent === query.agent) &&
      (query.scope === undefined || e.scope === query.scope)
    );
  }

  remove(predicate: (e: ManifestEntry) => boolean): void {
    const m = this.read();
    m.entries = m.entries.filter(e => !predicate(e));
    this.write(m);
  }

  private write(m: Manifest): void {
    mkdirSync(this.root, { recursive: true });
    writeFileSync(this.file, JSON.stringify(m, null, 2), "utf8");
  }
}
