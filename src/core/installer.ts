import { execSync } from "child_process";
import type { Plugin, PluginDependencies } from "./plugin";
import type { GenerationContext } from "./context";

export interface AggregatedDeps {
  packages: string[];
  devPackages: string[];
  expoPackages: string[];
}

export function aggregateDependencies(
  ctx: GenerationContext,
  plugins: Plugin[]
): AggregatedDeps {
  const aggregated: AggregatedDeps = {
    packages: [],
    devPackages: [],
    expoPackages: [],
  };

  for (const plugin of plugins) {
    const deps = plugin.dependencies(ctx);

    if (deps.packages) {
      aggregated.packages.push(...deps.packages);
    }
    if (deps.devPackages) {
      aggregated.devPackages.push(...deps.devPackages);
    }
    if (deps.expoPackages) {
      aggregated.expoPackages.push(...deps.expoPackages);
    }
  }

  // Remove duplicates
  aggregated.packages = [...new Set(aggregated.packages)];
  aggregated.devPackages = [...new Set(aggregated.devPackages)];
  aggregated.expoPackages = [...new Set(aggregated.expoPackages)];

  return aggregated;
}

export async function installDependencies(
  ctx: GenerationContext,
  deps: AggregatedDeps
) {
  if (ctx.dryRun || ctx.noInstall) {
    ctx.logger.info("Skipping installation (dry-run or --no-install)");
    return;
  }

  const pm = ctx.packageManager;

  // expo install for SDK packages
  if (deps.expoPackages.length > 0 && ctx.projectType === "expo") {
    const spinner = ctx.logger.spinner(`Installing Expo packages: ${deps.expoPackages.join(", ")}`);
    try {
      execSync(`npx expo install ${deps.expoPackages.join(" ")}`, {
        cwd: ctx.projectPath,
        stdio: "inherit",
      });
      spinner.succeed();
    } catch (e) {
      spinner.fail("Failed to install Expo packages");
      throw e;
    }
  }

  // Regular npm packages
  if (deps.packages.length > 0) {
    const spinner = ctx.logger.spinner(`Installing packages: ${deps.packages.join(", ")}`);
    try {
      const cmd = pm === "npm" ? "install" : "add";
      execSync(`${pm} ${cmd} ${deps.packages.join(" ")}`, {
        cwd: ctx.projectPath,
        stdio: "inherit",
      });
      spinner.succeed();
    } catch (e) {
      spinner.fail("Failed to install packages");
      throw e;
    }
  }

  // Dev packages
  if (deps.devPackages.length > 0) {
    const spinner = ctx.logger.spinner(`Installing dev packages: ${deps.devPackages.join(", ")}`);
    try {
      const devFlag = pm === "npm" ? "--save-dev" : pm === "yarn" ? "--dev" : "--save-dev";
      execSync(`${pm} ${pm === "npm" ? "install" : "add"} ${devFlag} ${deps.devPackages.join(" ")}`, {
        cwd: ctx.projectPath,
        stdio: "inherit",
      });
      spinner.succeed();
    } catch (e) {
      spinner.fail("Failed to install dev packages");
      throw e;
    }
  }
}
