import * as path from 'path'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as core from '@actions/core'
import * as install from './install'
import * as gcp from './gcp'
import { warnForDeprecatedVersion } from './warning'

export async function run (): Promise<void> {
  const version = core.getInput('version')
  if (!version) {
    core.setFailed('version cannot be empty')
    return
  }

  warnForDeprecatedVersion(version)
  const serviceAccountKey = core.getInput('gcp_sa_key')
  if (serviceAccountKey) {
    await gcp.setupServiceAccount(serviceAccountKey)
  }

  const configFilepath = path.join(__dirname, `${version.replace('/', '.')}.yaml`)
  core.debug(`Reading config from ${configFilepath}`)
  const tools = yaml.load(fs.readFileSync(configFilepath, 'utf8')) as install.Tools
  for (const tool of tools) {
    const cachedPath = await install.downloadTool(tool)
    core.debug(`Cached path ${cachedPath}`)
    core.addPath(path.dirname(cachedPath))
  }
}

run().catch(core.setFailed)
