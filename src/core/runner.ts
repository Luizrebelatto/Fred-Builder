import { execSync } from "child_process";
import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import type { GenerationContext } from "./context";
import type { PluginRegistry } from "./plugin-registry";
import { aggregateDependencies, installDependencies } from "./installer";

export async function run(registry: PluginRegistry, ctx: GenerationContext) {
  try {
    ctx.logger.step("Step 1: Scaffolding base project...");
    await scaffoldBase(ctx);

    ctx.logger.step("Step 2: Selecting plugins...");
    await selectPlugins(ctx, registry);

    ctx.logger.step("Step 3: Gathering plugin configuration...");
    await gatherPluginAnswers(ctx, registry);

    ctx.logger.step("Step 4: Resolving dependencies...");
    registry.validateConflicts(ctx.selectedPlugins);
    const ordered = registry.ordered(ctx.selectedPlugins);

    ctx.logger.step("Step 5: Installing dependencies...");
    const aggregated = aggregateDependencies(ctx, ordered);
    await installDependencies(ctx, aggregated);

    ctx.logger.step("Step 6: Generating files...");
    for (const plugin of ordered) {
      await plugin.generate(ctx);
    }

    ctx.logger.step("Step 7: Finalizing...");
    await finalize(ctx, ordered);

    ctx.logger.success("✅ Project created successfully!");
    printNextSteps(ctx, ordered);
  } catch (error) {
    ctx.logger.error(`${(error as Error).message}`);
    process.exit(1);
  }
}

async function scaffoldBase(ctx: GenerationContext) {
  if (ctx.dryRun) {
    ctx.logger.info(`Would create ${ctx.projectType} project: ${ctx.projectName}`);
    return;
  }

  const spinner = ctx.logger.spinner("Creating base project...");
  try {
    if (ctx.projectType === "expo") {
      execSync(
        `npx create-expo-app@latest ${ctx.projectName} -t expo-template-blank-typescript`,
        { stdio: "inherit" }
      );
    } else {
      execSync(`npx react-native init ${ctx.projectName}`, { stdio: "inherit" });
    }
    ctx.projectPath = path.resolve(process.cwd(), ctx.projectName);
    spinner.succeed();
  } catch (e) {
    spinner.fail();
    throw new Error("Failed to create base project");
  }
}

async function selectPlugins(ctx: GenerationContext, registry: PluginRegistry) {
  if (ctx.selectedPlugins.size > 0) return;

  const byCategory = groupByCategory(registry.all());

  // Navigation: required single-select
  const navAnswers = await inquirer.prompt([
    {
      type: "list",
      name: "nav",
      message: "🧭 Navigation system?",
      choices: byCategory.navigation.map((p) => ({ name: p.name, value: p.id })),
    },
  ]);
  ctx.selectedPlugins.add(navAnswers.nav);

  // State: optional single-select
  const stateAnswers = await inquirer.prompt([
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

  // Style: optional single-select
  const styleAnswers = await inquirer.prompt([
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

  // Data & Quality: optional multi-select
  if (byCategory.data.length > 0) {
    const dataAnswers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "data",
        message: "📊 Data libraries?",
        choices: byCategory.data.map((p) => ({ name: p.name, value: p.id })),
      },
    ]);
    dataAnswers.data.forEach((id: string) => ctx.selectedPlugins.add(id));
  }

  if (byCategory.integration.length > 0) {
    const integAnswers = await inquirer.prompt([
      {
        type: "checkbox",
        name: "integ",
        message: "🔌 Integrations?",
        choices: byCategory.integration.map((p) => ({ name: p.name, value: p.id })),
      },
    ]);
    integAnswers.integ.forEach((id: string) => ctx.selectedPlugins.add(id));
  }

  if (byCategory.quality.length > 0) {
    const qualAnswers = await inquirer.prompt([
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

async function gatherPluginAnswers(ctx: GenerationContext, registry: PluginRegistry) {
  const allPlugins = registry.all();

  for (const plugin of allPlugins) {
    if (!ctx.selectedPlugins.has(plugin.id)) continue;
    if (!plugin.isApplicable(ctx)) continue;

    const questions = plugin.prompts?.(ctx);
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const answers = await inquirer.prompt(questions);
      ctx.answers[plugin.id] = answers;
    }
  }
}

async function finalize(ctx: GenerationContext, _ordered: any[]) {
  if (!ctx.dryRun && !ctx.noInstall) {
    const spinner = ctx.logger.spinner("Initializing git...");
    try {
      execSync("git init", { cwd: ctx.projectPath });
      execSync("git add .", { cwd: ctx.projectPath });
      execSync('git commit -m "Initial commit"', { cwd: ctx.projectPath });
      spinner.succeed();
    } catch {
      spinner.stop();
    }
  }
}

function printNextSteps(ctx: GenerationContext, ordered: any[]) {
  console.log("");
  console.log(chalk.cyan("📋 Next steps:"));
  console.log(chalk.white(`  cd ${ctx.projectName}`));
  console.log(chalk.white("  npx expo start"));

  if (ordered.some((p) => p.postInstall)) {
    console.log("");
    console.log(chalk.cyan("💡 Important:"));
    for (const plugin of ordered) {
      const messages = plugin.postInstall?.(ctx);
      if (messages) {
        messages.forEach((msg) => console.log(chalk.white(`  ${msg}`)));
      }
    }
  }

  console.log("");
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
