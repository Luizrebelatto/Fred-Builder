import type { Logger } from "./logger";
import type { FsApi } from "./fs";
import type { ProviderInjection } from "./plugin";

export interface GenerationContext {
  projectName: string;
  projectPath: string;
  projectType: "expo" | "bare";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  selectedPlugins: Set<string>;
  answers: Record<string, any>;
  preset?: string;
  dryRun: boolean;
  noInstall: boolean;
  fs: FsApi;
  logger: Logger;
  providers: ProviderInjection[];
}

export function createContext(overrides: Partial<GenerationContext>): GenerationContext {
  const ctx: GenerationContext = {
    projectName: "",
    projectPath: "",
    projectType: "expo",
    packageManager: "npm",
    selectedPlugins: new Set(),
    answers: {},
    dryRun: false,
    noInstall: false,
    fs: {} as FsApi,
    logger: {} as Logger,
    providers: [],
    ...overrides,
  };
  return ctx;
}
