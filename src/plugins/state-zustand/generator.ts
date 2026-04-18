import path from "path";
import type { GenerationContext } from "../../core/context";
import { storeTemplate } from "./templates";

export async function generate(ctx: GenerationContext) {
  await ctx.fs.write(
    path.join(ctx.projectPath, "src", "store", "useAppStore.ts"),
    storeTemplate
  );
}
