import * as path from "node:path";
import * as fs from "node:fs";
import * as toolCache from "@actions/tool-cache";

export type Tool = {
  name: string;
  version: string;
  url: string;
  dest?: string | undefined;
};

export type Tools = Tool[];

export async function downloadTool(tool: Tool) {
  let toolDownloadPath = "";

  let cachedToolpath = toolCache.find(tool.name, tool.version);
  if (!cachedToolpath) {
    try {
      toolDownloadPath = await toolCache.downloadTool(tool.url);
    } catch (err) {
      throw new Error(`downloading of tool ${tool.name} failed: ${err}`);
    }

    if (tool.url.endsWith(".tar.gz")) {
      toolDownloadPath = await toolCache.extractTar(toolDownloadPath);
      toolDownloadPath = path.join(toolDownloadPath, tool.name);
    }

    cachedToolpath = await toolCache.cacheFile(toolDownloadPath, tool.name, tool.name, tool.version);
  }

  const toolPath = path.join(cachedToolpath, tool.name);

  fs.chmodSync(toolPath, "777");
  // special case: copy binary to specific directory (when PATH is ignored)
  if (tool.dest !== undefined && tool.dest !== "") {
    const baseDir = process.env.XDG_CONFIG_HOME || `${process.env.HOME || ""}/.config`;
    // eslint-disable-next-line no-template-curly-in-string
    const destDir = tool.dest.replace("${KUSTOMIZE_PLUGINS_DIR}", baseDir);

    await fs.promises.mkdir(destDir, { recursive: true });

    fs.copyFileSync(toolPath, path.join(destDir, tool.name));
  }

  return toolPath;
}
