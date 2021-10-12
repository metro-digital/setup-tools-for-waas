import * as install from '../src/install'
import io = require('@actions/io')
import fs = require('fs')
import os = require('os')
import path = require('path')

const toolBaseDir = path.join(__dirname, 'runner', 'tools')
const tempDir = path.join(__dirname, 'runner', 'temp')

process.env.RUNNER_TOOL_CACHE = toolBaseDir
process.env.RUNNER_TEMP = tempDir

describe('installer tests', () => {
  beforeAll(async () => {
    await io.rmRF(toolBaseDir)
    await io.rmRF(tempDir)
  })

  afterAll(async () => {
    await io.rmRF(toolBaseDir)
    await io.rmRF(tempDir)
  })

  it('Acquires kubectl version 1.17.17', async () => {
    const tool = {
      name: 'kubectl',
      version: '1.17.17',
      url: `https://storage.googleapis.com/kubernetes-release/release/v1.17.17/bin/${process.platform}/amd64/kubectl`
    }
    await install.downloadTool(tool)

    expectToolExist(tool)
    expectRightVersion(tool, './kubectl version')
  })

  it('Acquires sops version 3.6.1', async () => {
    const tool = {
      name: 'sops',
      version: '3.6.1',
      url: `https://github.com/mozilla/sops/releases/download/v3.6.1/sops-v3.6.1.${process.platform}`
    }
    await install.downloadTool(tool)

    expectToolExist(tool)
    expectRightVersion(tool, './sops --version')
  })

  it('Acquires yq version 3.4.1', async () => {
    const tool = {
      name: 'yq',
      version: '3.4.1',
      url: `https://github.com/mikefarah/yq/releases/download/3.4.1/yq_${process.platform}_amd64`
    }
    await install.downloadTool(tool)

    expectToolExist(tool)
    expectRightVersion(tool, './yq --version')
  })

  it('Acquires kustomize version 3.5.4', async () => {
    const tool = {
      name: 'kustomize',
      version: '3.5.4',
      url: `https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize/v3.5.4/kustomize_v3.5.4_${process.platform}_amd64.tar.gz`
    }
    await install.downloadTool(tool)

    expectToolExist(tool)
    expectRightVersion(tool, './kustomize version')
  })

  it('Acquires skaffold version 1.20.0', async () => {
    const tool = {
      name: 'skaffold',
      version: '1.20.0',
      url: `https://github.com/GoogleContainerTools/skaffold/releases/download/v1.20.0/skaffold-${process.platform}-amd64`
    }
    await install.downloadTool(tool)

    expectToolExist(tool)
    expectRightVersion(tool, './skaffold version')
  })

})

function expectToolExist (tool :any) {
  const toolDir = path.join(toolBaseDir, tool.name, tool.version, os.arch())

  expect(fs.existsSync(`${toolDir}.complete`)).toBe(true)

  expect(fs.existsSync(path.join(toolDir, tool.name))).toBe(true)
  expect(() =>
    fs.accessSync(path.join(toolDir, tool.name), fs.constants.X_OK)
  ).not.toThrow()

  if (tool.dest !== undefined && tool.dest !== '') {
    expect(fs.existsSync(path.join(tool.dest, tool.name))).toBe(true)
  }
}

function expectRightVersion (tool :any, command :string) {
  const toolDir = path.join(toolBaseDir, tool.name, tool.version, os.arch())

  const exec = require('child_process').exec
  const options = { cwd: toolDir }
  exec(
    command,
    options,
    function callback (_error: string, stdout: string) {
      expect(stdout.split('\n')[0].includes(tool.version)).toBe(true)
    }
  )
}
