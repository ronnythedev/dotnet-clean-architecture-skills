export interface ManifestEntry {
  /** Version of manifest format. */
  v: 1;
  /** ISO timestamp. */
  installedAt: string;
  /** Skill frontmatter name. */
  skill: string;
  /** Agent id. */
  agent: string;
  /** "global" or "project". */
  scope: "global" | "project";
  /** "copy" or "symlink". */
  method: "copy" | "symlink";
  /** Absolute path that was written. */
  target: string;
}

export interface Manifest {
  v: 1;
  entries: ManifestEntry[];
}
