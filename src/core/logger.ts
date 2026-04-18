import chalk from "chalk";
import ora from "ora";

export interface Logger {
  step(message: string): void;
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  spinner(message: string): {
    succeed: (msg?: string) => void;
    fail: (msg?: string) => void;
    stop: () => void;
  };
}

export function createLogger(): Logger {
  let currentSpinner: any = null;

  return {
    step(message: string) {
      console.log(chalk.cyan(`  ▸ ${message}`));
    },
    success(message: string) {
      console.log(chalk.green(`  ✓ ${message}`));
    },
    error(message: string) {
      console.error(chalk.red(`  ✗ ${message}`));
    },
    info(message: string) {
      console.log(chalk.gray(`  ${message}`));
    },
    warn(message: string) {
      console.log(chalk.yellow(`  ⚠  ${message}`));
    },
    spinner(message: string) {
      if (currentSpinner) currentSpinner.stop();
      currentSpinner = ora(chalk.blue(message)).start();
      return {
        succeed: (msg?: string) => {
          currentSpinner.succeed(chalk.green(msg || message));
          currentSpinner = null;
        },
        fail: (msg?: string) => {
          currentSpinner.fail(chalk.red(msg || message));
          currentSpinner = null;
        },
        stop: () => {
          currentSpinner?.stop();
          currentSpinner = null;
        },
      };
    },
  };
}
