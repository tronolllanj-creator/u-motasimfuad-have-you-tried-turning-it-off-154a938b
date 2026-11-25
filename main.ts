// Generates required directories and files for the project.
// Enforces a strict 199-character output length limit.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

interface Candidate {
  text: string;
  score: number;
}

// Exact candidates array with specified scores and text
const CANDIDATES: Candidate[] = [
  { score: 47, text: "Sir I completely understand that your tax deadline is in one hour, but have you tried unplugging your modem and singing a gentle lullaby to it until the blinking lights turn blue?" },
  { score: 46, text: "I know your daughter's wedding livestream is buffering right at the vows, but let us look at the bright side, buffering is just time pausing to appreciate romance." },
  { score: 45, text: "Your mortgage payment is frozen on the submit screen, which is honestly very relatable because sometimes I also just want to freeze and pretend Monday is optional." },
  { score: 46, text: "The boarding gate closes in three minutes and your flight confirmation will not load, but have you considered that maybe destiny wants you to start a new life in baggage claim?" },
  { score: 45, text: "I hear that your baby monitor has gone completely black right when you finally got them to sleep, but think of it as a fun audio-only podcast about mystery noises." },
  { score: 48, text: "Your remote job interview starts in five minutes and your camera refuses to turn on, which is actually a blessing because pants are a social construct anyway." }
];

/**
 * Picks the best candidate.
 * Sorting rules: score descending, then shorter text length first.
 */
function pickBest(candidates: Candidate[]): Candidate {
  const sorted = [...candidates].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.text.length - b.text.length;
  });

  return sorted[0];
}

/**
 * Validates that the text is between 1 and 199 characters and is not purely whitespace.
 */
function validateText(text: string): void {
  if (typeof text !== 'string') {
    throw new Error('Candidate text must be a string.');
  }
  if (text.length < 1 || text.length > 199) {
    throw new Error(`Candidate text length (${text.length}) is out of bounds (1-199).`);
  }
  if (text.trim().length === 0) {
    throw new Error('Candidate text cannot be only whitespace.');
  }
}

async function main(): void {
  // 1. Pick the best candidate
  const best = pickBest(CANDIDATES);

  // 2. Validate the winning text
  validateText(best.text);

  // 3. Determine output directory
  const outputDirEnv = process.env.MAKEFUN_OUTPUT_DIR;
  const outputDirPath = resolve(outputDirEnv ? outputDirEnv : './output');

  // 4. Ensure output directory exists
  await mkdir(outputDirPath, { recursive: true });

  // 5. Write winning line to entry.txt with NO trailing newline
  const filePath = join(outputDirPath, 'entry.txt');
  await writeFile(filePath, best.text, 'utf8');

  // 6. Print the chosen line and its character count
  console.log(best.text);
  console.log(`Character count: ${best.text.length}`);
}

main().catch((err: unknown) => {
  console.error('Error executing main:', err);
  process.exit(1);
});
