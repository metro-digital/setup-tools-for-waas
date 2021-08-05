import * as core from '@actions/core'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function setupGcpSa (serviceAccountKey: string): Promise<void> {
  try {
    const credsDir = String(process.env.GITHUB_WORKSPACE)
    const credsPath = path.join(credsDir, uuidv4())

    const serviceAccountKeyObj = parseServiceAccountKey(
      serviceAccountKey
    )

    await fs.writeFile(credsPath, JSON.stringify(serviceAccountKeyObj, null, 2))

    core.exportVariable('GCLOUD_PROJECT', serviceAccountKeyObj.project_id)
    core.exportVariable('GOOGLE_APPLICATION_CREDENTIALS', credsPath)
    core.info('Successfully exported Default Application Credentials')
  } catch (error) {
    core.setFailed(error.message)
  }
}

function parseServiceAccountKey (serviceAccountKey: string) {
  let serviceAccount = serviceAccountKey
  // Handle base64-encoded credentials
  if (!serviceAccountKey.trim().startsWith('{')) {
    serviceAccount = Buffer.from(serviceAccountKey, 'base64').toString('utf8')
  }
  return JSON.parse(serviceAccount)
}
