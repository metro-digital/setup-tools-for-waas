import * as path from 'path'
import * as fs from 'fs'
import * as toolCache from '@actions/tool-cache'
import * as command from './command'

export type Tool = {
  name: string
  version: string
  url: string
  dest?: string | undefined
}

export type Tools = Tool[]


export async function downloadTool (tool: Tool): Promise<string> {
  let toolDownloadPath = ''

  let cachedToolpath = toolCache.find(tool.name, tool.version)
  if (!cachedToolpath) {
    try {
      toolDownloadPath = await toolCache.downloadTool(tool.url)
    } catch (err) {
      throw new Error(`downloading of tool ${tool.name} failed: ${err}`)
    }

    if (tool.url.endsWith('.tar.gz')) {
      toolDownloadPath = await toolCache.extractTar(toolDownloadPath)
      toolDownloadPath = path.join(toolDownloadPath, tool.name)
    }

    cachedToolpath = await toolCache.cacheFile(
      toolDownloadPath,
      tool.name,
      tool.name,
      tool.version
    )
  }

  const toolPath = path.join(cachedToolpath, tool.name)
  fs.chmodSync(toolPath, '777')
  // special case: copy binary to specific directory (when PATH is ignored)
  if (tool.dest !== undefined && tool.dest !== '') {
    let result: command.Result = await command.exec('sh', ['-c', `echo "${tool.dest}"`])
    if (!result.status) {
      throw new Error(`cannot expand destination directory path for ${tool.name}`)
    }
    const destDir = result.output
    result = await command.exec('mkdir', ['-p', `${destDir}`])
    if (!result.status) {
      throw new Error(`cannot create destination directory ${destDir} for ${tool.name}`)
    }
    const destPath = path.join(destDir, tool.name)
    result = await command.exec('cp', ['-f', `${toolPath}`, `${destPath}`])
    if (!result.status) {
      throw new Error(`cannot copy ${tool.name} to ${destPath}`)
    }
  }

  return toolPath
}
