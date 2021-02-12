import * as path from 'path'
import * as core from '@actions/core'

import * as config from './config'
import * as install from './install'

export async function run (): Promise<void> {
  const version = core.getInput('version')
  if (!version) {
    core.setFailed('version cannot be empty')
    return
  }

  const tools = config.loadConfig(version)
  for (const tool of tools) {
    const cachedPath = await install.downloadTool(tool)
    core.debug(`Cached path ${cachedPath}`)
    core.addPath(path.dirname(cachedPath))
  }
}

run().catch(core.setFailed)
