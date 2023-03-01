const validVersions = [
  'waas/latest',
  'waas/v1',
  'waas/v1alpha3',
  'waas/v1alpha4',
  'waas/v1beta1',
  'waas/v2'
]

export function validateVersion (version: string) {
  if (
    validVersions.includes(version) === false
  ) {
    throw new Error(`The version ${version} is deprecated and is decommissioned on 01.03.2023. Please update the setup-tools-for-waas action to use version waas/v2 instead.`)
  }
}
