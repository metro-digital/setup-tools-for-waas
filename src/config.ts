import * as core from '@actions/core'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

export type Tool = {
  name: string
  version: string
  url: string
  dest?: string | undefined
}

export type Tools = Tool[]

export function loadConfig (version: string): Tools {
  if (version === 'waas/v1alpha1') {
    // nothing for the moment
  } else if (version === 'waas/v1alpha2') {
    // nothing for the moment
  } else if (version === 'waas/v1alpha3' || version === 'waas/v1alpha4') {
    const configFilepath = path.join(__dirname, `${version.replace('/', '.')}.yaml`)
    core.debug(`Reading config from ${configFilepath}`)
    return yaml.load(fs.readFileSync(configFilepath, 'utf8')
    ) as Tools
  }

  throw new Error('version not supported')
}
