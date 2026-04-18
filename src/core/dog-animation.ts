import chalk from "chalk";

const FRAMES = [
  ["       __", "   (___()'`;", "   /,    /`", '   \\\\"--\\\\'],
  ["       __", "   (___()'`;", "   /`    /,", '   \\\\--"\\\\'],
];

export async function playDogAnimation(durationMs = 2500, fps = 6): Promise<void> {
  if (!process.stdout.isTTY) return;

  const frameDelay = Math.round(1000 / fps);
  const totalFrames = Math.round(durationMs / frameDelay);
  const width = Math.max(20, (process.stdout.columns || 60) - 15);
  const height = FRAMES[0].length;

  process.stdout.write("\n".repeat(height));

  for (let i = 0; i < totalFrames; i++) {
    const x = i % width;
    const frame = FRAMES[i % FRAMES.length];

    process.stdout.write(`\x1b[${height}A`);
    for (const line of frame) {
      process.stdout.write("\x1b[2K\r" + " ".repeat(x) + chalk.blue(line) + "\n");
    }

    await new Promise((r) => setTimeout(r, frameDelay));
  }
}
