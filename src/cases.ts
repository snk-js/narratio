import fs from "node:fs";
import path from "node:path";
import type { EssayCase } from "./types.js";

const CASES_DIR = path.join(process.cwd(), "corpus", "cases");

function hydrate(raw: EssayCase): EssayCase {
  const text = fs.readFileSync(path.join(process.cwd(), raw.textFile), "utf8").trim();
  return { ...raw, text };
}

export function loadCase(id: string): EssayCase {
  const file = path.join(CASES_DIR, `${id}.json`);
  return hydrate(JSON.parse(fs.readFileSync(file, "utf8")) as EssayCase);
}

export function loadAllCases(): EssayCase[] {
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => hydrate(JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), "utf8")) as EssayCase));
}

/** Optional run tag, set by the repeat-runs harness. When present, results are
 *  written as `<id>.run<N>.json` alongside the canonical `<id>.json`, so repeat
 *  sampling accumulates evidence without disturbing the committed headline run. */
const RUN_TAG = process.env.NARRATIO_RUN_TAG ?? "";

export function saveResult(sub: string, name: string, data: unknown): string {
  const dir = path.join(process.cwd(), "results", sub);
  fs.mkdirSync(dir, { recursive: true });
  const tagged = RUN_TAG ? name.replace(/\.json$/, `.${RUN_TAG}.json`) : name;
  const file = path.join(dir, tagged);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}
