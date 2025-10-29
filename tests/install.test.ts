import { describe, beforeAll, afterAll, vi, MockInstance, it, expect } from "vitest";

import { downloadTool } from "../src/install";
import { rmRF } from "@actions/io";
import { accessSync as fsAccessSync, existsSync as fsExistsSync, constants as fsConstants } from "node:fs";
import { arch as osArch } from "node:os";
import { join as pathJoin } from "node:path";

const toolBaseDir = pathJoin(__dirname, "runner", "tools");
const tempDir = pathJoin(__dirname, "runner", "temp");

process.env.RUNNER_TOOL_CACHE = toolBaseDir;
process.env.RUNNER_TEMP = tempDir;

describe(
  "installer tests",
  {
    concurrent: true,
  },
  () => {
    let stdoutSpy: MockInstance;
    beforeAll(async () => {
      await rmRF(toolBaseDir);
      await rmRF(tempDir);
      stdoutSpy = vi.spyOn(global.process.stdout, "write").mockImplementation(() => true);
    });

    afterAll(async () => {
      await rmRF(toolBaseDir);
      await rmRF(tempDir);
      stdoutSpy.mockRestore();
    });

    it("Acquires kubectl version 1.27.10", { timeout: 180e3 }, async () => {
      const tool = {
        name: "kubectl",
        version: "1.27.10",
        url: `https://storage.googleapis.com/kubernetes-release/release/v1.27.10/bin/${process.platform}/amd64/kubectl`,
      };
      await downloadTool(tool);

      expectToolExist(tool);
      expectRightVersion(tool, "./kubectl version");
    });

    it("Acquires sops version 3.6.1", { timeout: 180e3 }, async () => {
      const tool = {
        name: "sops",
        version: "3.6.1",
        url: `https://github.com/mozilla/sops/releases/download/v3.6.1/sops-v3.6.1.${process.platform}`,
      };
      await downloadTool(tool);

      expectToolExist(tool);
      expectRightVersion(tool, "./sops --version");
    });

    it("Acquires yq version 3.4.1", { timeout: 180e3 }, async () => {
      const tool = {
        name: "yq",
        version: "3.4.1",
        url: `https://github.com/mikefarah/yq/releases/download/3.4.1/yq_${process.platform}_amd64`,
      };
      await downloadTool(tool);

      expectToolExist(tool);
      expectRightVersion(tool, "./yq --version");
    });

    it("Acquires kustomize version 3.5.4", { timeout: 180e3 }, async () => {
      const tool = {
        name: "kustomize",
        version: "3.5.4",
        url: `https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize/v3.5.4/kustomize_v3.5.4_${process.platform}_amd64.tar.gz`,
      };
      await downloadTool(tool);

      expectToolExist(tool);
      expectRightVersion(tool, "./kustomize version");
    });

    it("Acquires skaffold version 1.20.0", { timeout: 180e3 }, async () => {
      const tool = {
        name: "skaffold",
        version: "1.20.0",
        url: `https://github.com/GoogleContainerTools/skaffold/releases/download/v1.20.0/skaffold-${process.platform}-amd64`,
      };
      await downloadTool(tool);

      expectToolExist(tool);
      expectRightVersion(tool, "./skaffold version");
    });
  },
);

function expectToolExist(tool: any) {
  const toolDir = pathJoin(toolBaseDir, tool.name, tool.version, osArch());

  expect(fsExistsSync(`${toolDir}.complete`)).toBe(true);

  expect(fsExistsSync(pathJoin(toolDir, tool.name))).toBe(true);
  expect(() => fsAccessSync(pathJoin(toolDir, tool.name), fsConstants.X_OK)).not.toThrow();

  if (tool.dest !== undefined && tool.dest !== "") {
    expect(fsExistsSync(pathJoin(tool.dest, tool.name))).toBe(true);
  }
}

function expectRightVersion(tool: any, command: string) {
  const toolDir = pathJoin(toolBaseDir, tool.name, tool.version, osArch());

  const exec = require("child_process").exec;
  const options = { cwd: toolDir };
  exec(command, options, function callback(_error: string, stdout: string) {
    expect(stdout.split("\n")[0].includes(tool.version)).toBe(true);
  });
}
