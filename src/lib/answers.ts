import raw from "@/content/answers.json";
import type { Answer } from "./types";

// The shape of every entry is checked by scripts/validate-content.mjs,
// which runs before each build and fails it on a malformed entry.
export const answers = raw as Answer[];
