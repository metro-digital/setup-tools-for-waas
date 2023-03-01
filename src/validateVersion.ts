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
    throw new Error(`The version ${version} is not supported. Please use a supported version, e.g. waas/v2 instead.`)
  }
}
