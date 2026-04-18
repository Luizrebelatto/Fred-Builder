import type { Plugin } from "./plugin";

export class PluginRegistry {
  private plugins = new Map<string, Plugin>();

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Duplicate plugin id: ${plugin.id}`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  all(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  get(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  /** Topological sort by dependsOn */
  ordered(selectedIds: Set<string>): Plugin[] {
    const visited = new Set<string>();
    const out: Plugin[] = [];

    const visit = (id: string) => {
      if (visited.has(id) || !selectedIds.has(id)) return;
      visited.add(id);

      const p = this.plugins.get(id);
      if (!p) throw new Error(`Unknown plugin: ${id}`);

      p.dependsOn?.forEach(visit);
      out.push(p);
    };

    selectedIds.forEach(visit);
    return out;
  }

  validateConflicts(selectedIds: Set<string>) {
    for (const id of selectedIds) {
      const p = this.plugins.get(id);
      if (!p) continue;

      const conflict = p.conflictsWith?.find((c) => selectedIds.has(c));
      if (conflict) {
        throw new Error(`${p.name} conflicts with ${this.plugins.get(conflict)?.name}`);
      }
    }
  }
}
