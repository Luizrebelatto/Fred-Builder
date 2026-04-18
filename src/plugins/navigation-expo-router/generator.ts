import path from "path";
import type { GenerationContext } from "../../core/context";
import {
  layoutTemplate,
  indexTemplate,
  advancedTabsLayoutTemplate,
  settingsTemplate,
} from "./templates";

export async function generate(ctx: GenerationContext) {
  const strategy: string = ctx.answers["navigation-expo-router"]?.strategy ?? "simple";

  // Write app/_layout.tsx
  const layoutContent = layoutTemplate(strategy);
  await ctx.fs.write(
    path.join(ctx.projectPath, "app", "_layout.tsx"),
    layoutContent
  );

  if (strategy === "advanced") {
    // Write app/(tabs)/_layout.tsx
    await ctx.fs.write(
      path.join(ctx.projectPath, "app", "(tabs)", "_layout.tsx"),
      advancedTabsLayoutTemplate()
    );

    // Write app/(tabs)/index.tsx
    await ctx.fs.write(
      path.join(ctx.projectPath, "app", "(tabs)", "index.tsx"),
      indexTemplate()
    );

    // Write app/(tabs)/settings.tsx
    await ctx.fs.write(
      path.join(ctx.projectPath, "app", "(tabs)", "settings.tsx"),
      settingsTemplate()
    );
  } else {
    // Simple: write app/index.tsx
    await ctx.fs.write(
      path.join(ctx.projectPath, "app", "index.tsx"),
      indexTemplate()
    );
  }

  // Patch package.json to use expo-router
  await ctx.fs.mergeJson(path.join(ctx.projectPath, "package.json"), {
    main: "expo-router/entry",
  });
}
