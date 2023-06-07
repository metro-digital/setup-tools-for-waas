# setup tools used by WaaS workflows

The action to setup the tools required for WaaS.

For latest version, `waas/v2`, following tools are set up.

- kubectl 1.24.14
- kustomize 4.4.1
- skaffold 1.35.0
- sops 3.6.1
- yq 3.4.1
- SopsSecretGenerator 1.3.2
- kenv 1.0.2
- KGCPSecret 1.1.0

## Inputs

### `version`

**Required** WaaS schema version for which tools should be set up.

### `gcp_sa_key`

**Optional** A Google Service Account key, which will the registered in the environment variable GOOGLE_APPLICATION_CREDENTIALS. This is e.g. needed, if secrets should be read from the Google Secret Manager.

## Example usage

```yaml
uses: metro-digital/setup-tools-for-waas@v0.x
with:
  version: "waas/v1"
  gcp_sa_key: "${{ secrets.GCP_SA_KEY }}"
```
