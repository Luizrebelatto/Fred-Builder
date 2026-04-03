#!/usr/bin/env node

import chalk from "chalk";
import { askProjectConfig } from "./prompts";
import { createProject } from "./installer";

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
  console.log(
    chalk.gray("   🔨 Crie seu projeto Expo personalizado em segundos!")
  );
  console.log("");
}

async function main() {
  showBanner();

  const config = await askProjectConfig();
  await createProject(config);
}

main().catch((error) => {
  console.error(chalk.red("Erro inesperado:"), error);
  process.exit(1);
});
