import path from "path";
import type { GenerationContext } from "../../core/context";
import {
  appTemplate,
  homeScreenTemplate,
  settingsScreenTemplate,
  profileScreenTemplate,
} from "./templates";

export async function generate(ctx: GenerationContext) {
  const types: string[] = ctx.answers["navigation-react"]?.types ?? ["stack"];

  // Write App.tsx
  const appContent = appTemplate(types);
  await ctx.fs.write(
    path.join(ctx.projectPath, "App.tsx"),
    appContent
  );

  // Write HomeScreen
  await ctx.fs.write(
    path.join(ctx.projectPath, "src", "screens", "HomeScreen.tsx"),
    homeScreenTemplate
  );

  // Write SettingsScreen if tabs
  if (types.includes("tabs")) {
    await ctx.fs.write(
      path.join(ctx.projectPath, "src", "screens", "SettingsScreen.tsx"),
      settingsScreenTemplate
    );
  }

  // Write ProfileScreen if drawer
  if (types.includes("drawer")) {
    await ctx.fs.write(
      path.join(ctx.projectPath, "src", "screens", "ProfileScreen.tsx"),
      profileScreenTemplate
    );
  }
}
