import * as core from '@actions/core'

export function warnForDeprecatedVersion (version: string) {
  if (/^waas\/v2alpha[1-4]$/.test(version)) {
    core.warning(`The version ${version} is deprecated and will be decommissioned on 01.03.2023. Please update the setup-tools-for-waas action to use version waas/v2(latest) instead.`)
  }
}
