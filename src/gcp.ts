import * as core from '@actions/core'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function setupServiceAccount (serviceAccountKey: string): Promise<void> {
  try {
    const credsDir = String(process.env.GITHUB_WORKSPACE)
    const credsPath = path.join(credsDir, uuidv4())
    const serviceAccount = parseServiceAccountKey(serviceAccountKey)
    await fs.writeFile(credsPath, JSON.stringify(serviceAccount, null, 2))
    core.exportVariable('GCLOUD_PROJECT', serviceAccount.project_id)
    core.exportVariable('GOOGLE_APPLICATION_CREDENTIALS', credsPath)
    core.info('Successfully exported Default Application Credentials')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

function parseServiceAccountKey (serviceAccountKey: string) {
  let serviceAccount = serviceAccountKey
  if (!serviceAccountKey.trim().startsWith('{')) {
    serviceAccount = Buffer.from(serviceAccountKey, 'base64').toString('utf8')
  }

  return JSON.parse(serviceAccount)
}
