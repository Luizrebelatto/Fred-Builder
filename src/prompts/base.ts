import inquirer from "inquirer";
import type { GenerationContext } from "../core/context";

export async function askBasePrompts(ctx: GenerationContext) {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "📱 Project name?",
      default: "my-app",
      validate: (input: string) => {
        if (!input.trim()) return "Project name is required";
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(input)) {
          return "Use only letters, numbers, hyphens, and underscores";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "projectType",
      message: "📦 Project type?",
      choices: [
        { name: "Expo (recommended)", value: "expo" },
        { name: "React Native CLI (bare)", value: "bare" },
      ],
      default: "expo",
    },
    {
      type: "list",
      name: "preset",
      message: "🚀 Start from a preset?",
      choices: [
        { name: "✨ SaaS app (routing + state + styling)", value: "saas" },
        { name: "🛠  Custom (pick everything)", value: "custom" },
      ],
      default: "custom",
    },
  ]);

  ctx.projectName = answers.projectName;
  ctx.projectType = answers.projectType;
  ctx.preset = answers.preset;
}
