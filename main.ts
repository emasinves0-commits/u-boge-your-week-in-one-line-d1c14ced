// "Your Week in One Line" — writes a single-line entry to /output/entry.txt.
// Deterministic, no network, no arguments.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = `${OUTPUT_DIR}/entry.txt`;
const MAX_CHARS = 100;

// The week: a duel won (the win), a $0 final lost (the fail),
// and a 3AM re-pair after the wallet was unpaired (the chaos).
const ENTRY = "Round 1300: won the duel, lost the $0 final, re-paired at 3AM.";

// Validate before writing: one line, 1..100 characters, no trailing newline.
function validate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) throw new Error(`length ${chars} out of range 1-${MAX_CHARS}`);
  if (/[\r\n]/.test(text)) throw new Error("entry must be a single line");
}

validate(ENTRY);
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, ENTRY, "utf8");

// Read back and confirm the file is byte-identical to the entry.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== ENTRY) throw new Error("read-back mismatch");
console.log(`ok: ${[...written].length} chars written to ${OUTPUT_FILE}`);
