# setup tools used by WaaS workflows

The action to setup the tools required for WaaS.

For latest version, `waas/v1alpha4`, following tools are set up.

- kubectl 1.17.17
- kustomize 3.5.4
- skaffold 1.20.0
- sops 3.6.1
- yq 3.4.1
- SopsSecretGenerator 1.3.2

## Inputs

### `version`

**Required** WaaS schema version for which tools should be set up.

## Outputs


## Example usage

```yaml
uses: metro-digital/setup-tools-for-waas@v0.x
with:
    version: 'waas/v1alpha4'
```
