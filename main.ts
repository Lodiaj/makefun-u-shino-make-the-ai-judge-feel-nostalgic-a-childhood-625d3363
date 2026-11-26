// Make the AI Judge Feel Nostalgic: A Childhood Memory.
// One sentence, at most 280 characters, recalling a childhood memory:
// Grandma's kitchen on an August evening, the steam off the rice pot,
// a child barefoot on the cool tiles with a spoon too big for his hand.
// The program writes the sentence to /output/entry.txt, where the sealed
// scorer checks the file is 1 to 280 characters of real UTF-8 text.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MEMORY =
  "Every August evening Grandma lifted the lid off the rice pot and the kitchen filled with steam, and I sat barefoot on the cool tiles with a spoon too big for my hand, waiting for the first spoonful and never knowing those were the last summers I would spend in her house.";

const DESTINATION = "/output/entry.txt";
const LIMIT = 280;

// The gate counts code points (not UTF-16 units) and requires 1-280
// characters of real text. Count with the spread operator so every
// character counts as one, exactly as the gate counts them. The entry
// must be exactly one sentence: a single period, at the very end, and
// no other sentence-ending mark anywhere in the text.
function validateMemory(text: string, limit: number): string {
  const length = [...text].length;
  if (text.trim() === "") {
    throw new Error("memory is blank");
  }
  if (length > limit) {
    throw new Error(`memory is ${length} characters; the gate allows 1-${limit}`);
  }
  if (text.includes("\n")) {
    throw new Error("memory must be a single line");
  }
  const periods = [...text].filter((ch) => ch === ".").length;
  if (periods !== 1 || !text.endsWith(".")) {
    throw new Error("memory must be exactly one sentence ending with a single period");
  }
  for (const mark of ["!", "?"]) {
    if (text.includes(mark)) {
      throw new Error(`memory must not contain ${mark}`);
    }
  }
  return text;
}

const memory = validateMemory(MEMORY, LIMIT);
const length = [...memory].length;

mkdirSync("/output", { recursive: true });
writeFileSync(DESTINATION, memory, "utf8");

// Read the file back and confirm it is byte-identical to the validated
// text, so a partial write can never pass silently.
const written = readFileSync(DESTINATION, "utf8");
if (written !== memory) {
  throw new Error("entry.txt on disk differs from the validated memory");
}
console.log(`memory (${length} chars) written to ${DESTINATION}`);
console.log(memory);
