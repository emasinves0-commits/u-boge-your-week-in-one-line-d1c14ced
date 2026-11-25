// "Your Week in One Line" — writes a single-line entry to /output/entry.txt.
// Deterministic, no network, no arguments.
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

// Default is /output (the gate's location). ENTRY_OUTPUT_DIR is an optional
// override so the program can be tested without touching a shared /output.
const OUTPUT_DIR = process.env.ENTRY_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = `${OUTPUT_DIR}/entry.txt`;
const MIN_CHARS = 1;
const MAX_CHARS = 100;

// The week: a duel won (the win), a $0 final lost (the fail),
// and a 3AM re-pair after the wallet was unpaired (the chaos).
const ENTRY = "Round 1300: won the duel, lost the $0 final, re-paired at 3AM.";

// Validate before writing. Every error reports the measured numbers.
function validate(text: string): void {
  const chars = [...text].length;
  const bytes = Buffer.byteLength(text, "utf8");
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`length ${chars} chars (${bytes} bytes) outside ${MIN_CHARS}-${MAX_CHARS}`);
  }
  const control = text.search(/[\u0000-\u001f\u007f]/); // includes \r and \n
  if (control !== -1) {
    throw new Error(`control/newline char U+${text.charCodeAt(control).toString(16).padStart(4, "0")} at index ${control} of ${chars}`);
  }
  if (text !== text.trim()) {
    throw new Error(`leading/trailing whitespace: trimmed length ${text.trim().length} != ${chars}`);
  }
}

validate(ENTRY);
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, ENTRY, "utf8");

// Read back as raw bytes: must equal the entry exactly (no BOM, no newline).
const expected = Buffer.from(ENTRY, "utf8");
const actual = readFileSync(OUTPUT_FILE);
const size = statSync(OUTPUT_FILE).size;
if (size !== expected.length || !actual.equals(expected)) {
  throw new Error(`read-back mismatch: file ${size} bytes vs expected ${expected.length}`);
}
console.log(`ok: ${[...ENTRY].length} chars, ${size} bytes written to ${OUTPUT_FILE}`);
