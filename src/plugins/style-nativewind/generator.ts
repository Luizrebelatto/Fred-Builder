import path from "path";
import type { GenerationContext } from "../../core/context";
import { globalCss, tailwindConfig, metroConfig, nativewindEnv } from "./templates";

export async function generate(ctx: GenerationContext) {
  // Write global.css
  await ctx.fs.write(
    path.join(ctx.projectPath, "global.css"),
    globalCss
  );

  // Write tailwind.config.js
  await ctx.fs.write(
    path.join(ctx.projectPath, "tailwind.config.js"),
    tailwindConfig
  );

  // Write/patch metro.config.js
  const metroPath = path.join(ctx.projectPath, "metro.config.js");
  const hasExisting = ctx.fs.exists(metroPath);

  if (!hasExisting) {
    await ctx.fs.write(metroPath, metroConfig);
  } else {
    // For existing metro.config, would need AST patching
    // For now, warn user
    ctx.logger.warn("metro.config.js already exists; ensure it uses withNativeWind wrapper");
  }

  // Write nativewind-env.d.ts
  await ctx.fs.write(
    path.join(ctx.projectPath, "src", "nativewind-env.d.ts"),
    nativewindEnv
  );

  // Patch package.json to include metro config
  const pkgPath = path.join(ctx.projectPath, "package.json");
  const content = await ctx.fs.read(pkgPath);
  if (!content.includes('metro')) {
    // Would need to patch, for MVP assume it's handled by metro.config.js import
  }
}
