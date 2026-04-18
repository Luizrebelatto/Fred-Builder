#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import path from "path";
import { createContext } from "./core/context";
import { createLogger } from "./core/logger";
import { createFsApi } from "./core/fs";
import { PluginRegistry } from "./core/plugin-registry";
import { promptUser } from "./prompts";
import { run } from "./core/runner";

// Import plugins
import navigationReact from "./plugins/navigation-react";
import navigationExpoRouter from "./plugins/navigation-expo-router";
import stateZustand from "./plugins/state-zustand";
import styleNativewind from "./plugins/style-nativewind";

function showBanner() {
  const banner = `
    ______              __  ____        _ __    __
   / ____/_______  ____/ / / __ )__  __(_) /___/ /__  _____
  / /_  / ___/ _ \\/ __  / / __  / / / / / / __  / _ \\/ ___/
 / __/ / /  /  __/ /_/ / / /_/ / /_/ / / / /_/ /  __/ /
/_/   /_/   \\___/\\__,_/ /_____/\\__,_/_/_/\\__,_/\\___/_/
`;

  const dog = `
        / \\__
       (    @\\___
       /         O
      /   (_____/
     /_____/   U
  `;

  console.log(chalk.bold.cyan(banner));
  console.log(chalk.yellow(dog));
  console.log(chalk.gray("   🔨 Create your custom React Native project in seconds!"));
  console.log("");
}

async function main() {
  const program = new Command();

  program
    .name("fred-builder")
    .description("Interactive React Native project generator")
    .option("--preset <preset>", "Start from preset (saas, custom)")
    .option("--dry-run", "Show what would be generated")
    .option("--yes", "Skip prompts and use defaults")
    .option("--no-install", "Skip dependency installation")
    .parse();

  showBanner();

  const opts = program.opts();

  // Create plugin registry
  const registry = new PluginRegistry();
  [navigationReact, navigationExpoRouter, stateZustand, styleNativewind].forEach((p) =>
    registry.register(p)
  );

  // Create context
  const ctx = createContext({
    dryRun: opts.dryRun || false,
    noInstall: opts.noInstall || false,
    preset: opts.preset || "custom",
    logger: createLogger(),
    fs: createFsApi(opts.dryRun || false),
  });

  try {
    // Prompt user
    await promptUser(ctx, registry);

    // Run generation
    await run(registry, ctx);
  } catch (error) {
    ctx.logger.error(`${(error as Error).message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red("Unexpected error:"), error);
  process.exit(1);
});
