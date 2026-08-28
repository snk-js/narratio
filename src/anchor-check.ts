/** Mechanical provenance check: does the adapter's claimed anchor actually
 *  exist, verbatim, in the source essay? No model involved — this layer is
 *  deterministic and cannot be sweet-talked. */

/** Normalize typographic variance that does not change identity of a quote:
 *  curly vs straight quotes, dash variants, whitespace runs, case. */
export function normalize(s: string): string {
  return s
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function anchorExists(essayText: string, anchor: string): boolean {
  if (anchor.trim().length === 0) return false;
  return normalize(essayText).includes(normalize(anchor));
}

/** For reporting: locate the anchor in the original text (offsets in the
 *  normalized space are close enough for display purposes). */
export function checkAnchors(essayText: string, anchors: string[]): boolean[] {
  return anchors.map((a) => anchorExists(essayText, a));
}
