# setup tools used by WaaS workflows

This action will setup the following tools (for version `waas/v1alpha3` and `waas/v1alpha4`):

- kubectl 1.17.17
- kustomize 3.5.4
- skaffold 1.17.1
- sops 3.6.1
- yq 3.4.1
- SopsSecretGenerator 1.3.0

## Inputs

### `version`

**Required** waas schema version (e.g. `waas/v1alpha3`) for which tools should set up.

## Outputs


## Example usage

```yaml
uses: metro-digital/setup-tools-for-waas
with:
    version: 'waas/v1alpha3'
```
