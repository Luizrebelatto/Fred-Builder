import fs from "fs-extra";
import path from "path";
import type { ProviderInjection } from "./plugin";

export interface FsApi {
  write(file: string, content: string): Promise<void>;
  read(file: string): Promise<string>;
  exists(file: string): boolean;
  copy(src: string, dest: string): Promise<void>;
  mergeJson(file: string, data: Record<string, any>): Promise<void>;
  injectProviders(file: string, providers: ProviderInjection[]): Promise<void>;
}

export function createFsApi(dryRun: boolean): FsApi {
  return {
    async write(file: string, content: string) {
      const dir = path.dirname(file);
      if (!dryRun) {
        await fs.ensureDir(dir);
        await fs.writeFile(file, content, "utf-8");
      }
    },
    async read(file: string) {
      return fs.readFile(file, "utf-8");
    },
    exists(file: string) {
      return fs.existsSync(file);
    },
    async copy(src: string, dest: string) {
      if (!dryRun) {
        await fs.copy(src, dest);
      }
    },
    async mergeJson(file: string, data: Record<string, any>) {
      if (dryRun) return;
      const existing = fs.existsSync(file) ? JSON.parse(await fs.readFile(file, "utf-8")) : {};
      const merged = deepMerge(existing, data);
      await fs.writeFile(file, JSON.stringify(merged, null, 2) + "\n", "utf-8");
    },
    async injectProviders(file: string, providers: ProviderInjection[]) {
      if (providers.length === 0) return;
      if (!fs.existsSync(file)) return;

      let content = await this.read(file);

      // Find and extract the provider marker section
      const startMarker = "{/* __PROVIDERS__ */}";
      const endMarker = "{/* __PROVIDERS_END__ */}";

      const startIdx = content.indexOf(startMarker);
      const endIdx = content.indexOf(endMarker);

      if (startIdx === -1 || endIdx === -1) return;

      // Extract the content between markers (preserve indentation)
      const markerLine = content.substring(content.lastIndexOf("\n", startIdx) + 1, startIdx);
      const indent = markerLine.match(/^\s*/)?.[0] || "";

      // Build stacked providers
      const imports = providers.map((p) => p.import).join("\n");
      let innerContent = "{children}"; // or navigation element

      // Find what was between the markers to preserve it
      const markerContent = content.substring(startIdx + startMarker.length, endIdx).trim();
      if (markerContent) {
        innerContent = markerContent;
      }

      // Wrap each provider
      let wrappedContent = innerContent;
      for (const provider of [...providers].reverse()) {
        wrappedContent = provider.wrap(wrappedContent);
      }

      const replacement = wrappedContent;

      // Reconstruct content
      const before = content.substring(0, startIdx);
      const after = content.substring(endIdx + endMarker.length);
      content = before + replacement + after;

      // Inject imports at the top
      const lines = content.split("\n");
      const importInsertIdx = lines.findIndex((l) => !l.startsWith("import ") && !l.startsWith("//"));
      if (importInsertIdx > 0) {
        lines.splice(importInsertIdx, 0, imports);
      }

      if (!dryRun) {
        await fs.writeFile(file, lines.join("\n"), "utf-8");
      }
    },
  };
}

function deepMerge(target: any, source: any): any {
  if (!isObject(source)) return source;
  if (!isObject(target)) target = {};

  for (const key in source) {
    if (isObject(source[key]) && isObject(target[key])) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function isObject(obj: any): boolean {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}
