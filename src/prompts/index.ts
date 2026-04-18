import type { GenerationContext } from "../core/context";
import type { PluginRegistry } from "../core/plugin-registry";
import { askBasePrompts } from "./base";

export async function promptUser(ctx: GenerationContext, registry: PluginRegistry) {
  await askBasePrompts(ctx);

  // Apply preset if not custom
  if (ctx.preset && ctx.preset !== "custom") {
    applyPreset(ctx, ctx.preset, registry);
  }

  // If custom, ask plugin selection
  if (ctx.preset === "custom") {
    await selectPlugins(ctx, registry);
  }

  // Gather per-plugin answers
  const allPlugins = registry.all();
  for (const plugin of allPlugins) {
    if (!ctx.selectedPlugins.has(plugin.id)) continue;
    if (!plugin.isApplicable(ctx)) continue;

    const questions = plugin.prompts?.(ctx);
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const inquirer = await import("inquirer");
      const answers = await inquirer.default.prompt(questions);
      ctx.answers[plugin.id] = answers;
    }
  }
}

function applyPreset(
  ctx: GenerationContext,
  presetName: string,
  registry: PluginRegistry
) {
  const presets: Record<string, { plugins: string[]; answers?: Record<string, any> }> = {
    saas: {
      plugins: [
        "navigation-expo-router",
        "state-zustand",
        "style-nativewind",
      ],
      answers: {
        "navigation-expo-router": { strategy: "advanced" },
      },
    },
  };

  const preset = presets[presetName];
  if (!preset) {
    ctx.logger.warn(`Unknown preset: ${presetName}`);
    return;
  }

  // Check all plugins exist
  for (const pluginId of preset.plugins) {
    if (!registry.get(pluginId)) {
      ctx.logger.error(`Preset references unknown plugin: ${pluginId}`);
      process.exit(1);
    }
  }

  preset.plugins.forEach((id) => ctx.selectedPlugins.add(id));
  if (preset.answers) {
    Object.assign(ctx.answers, preset.answers);
  }

  ctx.logger.info(`Applied preset: ${presetName}`);
}

async function selectPlugins(ctx: GenerationContext, registry: PluginRegistry) {
  const inquirer = await import("inquirer");
  const byCategory = groupByCategory(registry.all());

  // Navigation: required single-select
  const navAnswers = await inquirer.default.prompt([
    {
      type: "list",
      name: "nav",
      message: "🧭 Navigation system?",
      choices: byCategory.navigation.map((p) => ({ name: p.name, value: p.id })),
    },
  ]);
  ctx.selectedPlugins.add(navAnswers.nav);

  // State: optional single-select
  if (byCategory.state.length > 0) {
    const stateAnswers = await inquirer.default.prompt([
      {
        type: "list",
        name: "state",
        message: "🗃️  State management?",
        choices: [
          ...byCategory.state.map((p) => ({ name: p.name, value: p.id })),
          { name: "None", value: null },
        ],
      },
    ]);
    if (stateAnswers.state) ctx.selectedPlugins.add(stateAnswers.state);
  }

  // Style: optional single-select
  if (byCategory.style.length > 0) {
    const styleAnswers = await inquirer.default.prompt([
      {
        type: "list",
        name: "style",
        message: "🎨 Styling?",
        choices: [
          ...byCategory.style.map((p) => ({ name: p.name, value: p.id })),
          { name: "None", value: null },
        ],
      },
    ]);
    if (styleAnswers.style) ctx.selectedPlugins.add(styleAnswers.style);
  }

  // Data: optional multi-select
  if (byCategory.data.length > 0) {
    const dataAnswers = await inquirer.default.prompt([
      {
        type: "checkbox",
        name: "data",
        message: "📊 Data libraries?",
        choices: byCategory.data.map((p) => ({ name: p.name, value: p.id })),
      },
    ]);
    dataAnswers.data.forEach((id: string) => ctx.selectedPlugins.add(id));
  }

  // Integration: optional multi-select
  if (byCategory.integration.length > 0) {
    const integAnswers = await inquirer.default.prompt([
      {
        type: "checkbox",
        name: "integ",
        message: "🔌 Integrations?",
        choices: byCategory.integration.map((p) => ({ name: p.name, value: p.id })),
      },
    ]);
    integAnswers.integ.forEach((id: string) => ctx.selectedPlugins.add(id));
  }

  // Quality: optional multi-select
  if (byCategory.quality.length > 0) {
    const qualAnswers = await inquirer.default.prompt([
      {
        type: "checkbox",
        name: "qual",
        message: "✨ Code quality?",
        choices: byCategory.quality.map((p) => ({ name: p.name, value: p.id })),
      },
    ]);
    qualAnswers.qual.forEach((id: string) => ctx.selectedPlugins.add(id));
  }
}

function groupByCategory(plugins: any[]) {
  const groups: Record<string, any[]> = {
    navigation: [],
    state: [],
    style: [],
    data: [],
    integration: [],
    quality: [],
  };

  for (const plugin of plugins) {
    if (groups[plugin.category]) {
      groups[plugin.category].push(plugin);
    }
  }

  return groups;
}
