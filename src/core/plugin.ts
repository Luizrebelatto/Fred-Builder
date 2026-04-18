import type { GenerationContext } from "./context";

export type PluginCategory =
  | "navigation"
  | "state"
  | "style"
  | "data"
  | "integration"
  | "quality";

export interface PluginDependencies {
  packages?: string[];
  devPackages?: string[];
  expoPackages?: string[];
}

export interface Plugin {
  id: string;
  name: string;
  category: PluginCategory;
  dependsOn?: string[];
  conflictsWith?: string[];
  isApplicable: (ctx: GenerationContext) => boolean;
  prompts?: (ctx: GenerationContext) => any; // inquirer QuestionCollection
  dependencies: (ctx: GenerationContext) => PluginDependencies;
  generate: (ctx: GenerationContext) => Promise<void>;
  postInstall?: (ctx: GenerationContext) => string[];
}

export interface ProviderInjection {
  import: string;
  wrap: (inner: string) => string;
}
