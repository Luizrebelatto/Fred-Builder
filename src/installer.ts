import { execSync } from "child_process";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import { ProjectConfig } from "./types";
import { resolveDependencies } from "./dependencies";
import { scaffoldProject } from "./scaffold";

function run(command: string, cwd?: string) {
  execSync(command, {
    cwd,
    stdio: "inherit",
  });
}

export async function createProject(config: ProjectConfig) {
  const projectPath = path.resolve(process.cwd(), config.projectName);

  // 1. Criar projeto base com Expo
  console.log("");
  const spinnerCreate = ora(
    chalk.blue("Criando projeto Expo...")
  ).start();

  try {
    run(
      `npx create-expo-app@latest ${config.projectName} -t expo-template-blank-typescript`,
    );
    spinnerCreate.succeed(chalk.green("Projeto Expo criado!"));
  } catch {
    spinnerCreate.fail(chalk.red("Erro ao criar projeto Expo"));
    process.exit(1);
  }

  // 2. Instalar dependências selecionadas
  const { packages, devPackages } = resolveDependencies(config);

  if (packages.length > 0) {
    const spinnerDeps = ora(
      chalk.blue(`Instalando dependências: ${packages.join(", ")}`)
    ).start();

    try {
      run(`npx expo install ${packages.join(" ")}`, projectPath);
      spinnerDeps.succeed(chalk.green("Dependências instaladas!"));
    } catch {
      spinnerDeps.fail(chalk.red("Erro ao instalar dependências"));
      process.exit(1);
    }
  }

  if (devPackages && devPackages.length > 0) {
    const spinnerDev = ora(
      chalk.blue(`Instalando devDependencies: ${devPackages.join(", ")}`)
    ).start();

    try {
      run(
        `npm install --save-dev ${devPackages.join(" ")}`,
        projectPath
      );
      spinnerDev.succeed(chalk.green("DevDependencies instaladas!"));
    } catch {
      spinnerDev.fail(chalk.red("Erro ao instalar devDependencies"));
    }
  }

  // 3. Gerar arquivos de configuração
  const spinnerScaffold = ora(
    chalk.blue("Gerando arquivos de configuração...")
  ).start();

  try {
    scaffoldProject(projectPath, config);
    spinnerScaffold.succeed(chalk.green("Arquivos gerados!"));
  } catch {
    spinnerScaffold.fail(chalk.red("Erro ao gerar arquivos"));
  }

  // 4. Resumo final
  console.log("");
  console.log(chalk.bold.green("✅ Projeto criado com sucesso!"));
  console.log("");
  console.log(chalk.cyan("  Para começar:"));
  console.log(chalk.white(`    cd ${config.projectName}`));
  console.log(chalk.white("    npx expo start"));
  console.log("");

  // Mostrar o que foi configurado
  console.log(chalk.cyan("  Configurações:"));
  if (config.navigation !== "none")
    console.log(chalk.white(`    🧭 Navegação: ${config.navigation}`));
  if (config.httpClient !== "none")
    console.log(chalk.white(`    🌐 HTTP: ${config.httpClient}`));
  if (config.stateManagement !== "none")
    console.log(chalk.white(`    🗃️  Estado: ${config.stateManagement}`));
  if (config.uiLibrary !== "none")
    console.log(chalk.white(`    🎨 UI: ${config.uiLibrary}`));
  if (config.formLibrary !== "none")
    console.log(chalk.white(`    📝 Forms: ${config.formLibrary}`));
  if (config.extras.length > 0)
    console.log(chalk.white(`    📦 Extras: ${config.extras.join(", ")}`));
  console.log("");
}
