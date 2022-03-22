import * as config from '../src/config'
import fs from 'fs'
import core = require('@actions/core')
import * as yaml from 'js-yaml'
jest.mock('fs')

jest.spyOn(process.stdout, 'write')
describe('config tests', () => {
  let stdoutSpy: jest.SpyInstance
  beforeAll(() => {
    stdoutSpy = jest.spyOn(global.process.stdout, 'write').mockImplementation();
  })

  afterAll(() => {
    stdoutSpy.mockRestore()
  })

  it('Loads the config for version waas/v1alpha3', async () => {
    const tool = [{
      name: 'kubectl',
      version: '1.17.17',
      url: 'https://source.com/kubectl'
    }]

    fs.readFileSync = jest.fn().mockReturnValue(yaml.dump(tool))
    const tools = config.loadConfig('waas/v1alpha3')

    expect(tools[0].name).toEqual('kubectl')
    expect(tools[0].version).toEqual('1.17.17')
    expect(tools[0].url).toEqual('https://source.com/kubectl')
  })

  it('Loads the config for version waas/v1alpha4', async () => {
    const tool = [{
      name: 'sops',
      version: '3.6.1',
      url: 'https://source.com/sops'
    }]

    fs.readFileSync = jest.fn().mockReturnValue(yaml.dump(tool))
    const tools = config.loadConfig('waas/v1alpha4')

    expect(tools[0].name).toEqual('sops')
    expect(tools[0].version).toEqual('3.6.1')
    expect(tools[0].url).toEqual('https://source.com/sops')
  })

  it('Loads the config for version waas/v1beta1', async () => {
    const tool = [{
      name: 'sops',
      version: '3.6.1',
      url: 'https://source.com/sops'
    }]

    fs.readFileSync = jest.fn().mockReturnValue(yaml.dump(tool))
    const tools = config.loadConfig('waas/v1beta1')

    expect(tools[0].name).toEqual('sops')
    expect(tools[0].version).toEqual('3.6.1')
    expect(tools[0].url).toEqual('https://source.com/sops')
  })

  it('Loads the config for version waas/v1', async () => {
    const tool = [{
      name: 'sops',
      version: '3.6.1',
      url: 'https://source.com/sops'
    }]

    fs.readFileSync = jest.fn().mockReturnValue(yaml.dump(tool))
    const tools = config.loadConfig('waas/v1')

    expect(tools[0].name).toEqual('sops')
    expect(tools[0].version).toEqual('3.6.1')
    expect(tools[0].url).toEqual('https://source.com/sops')
  })

  it('Loads the config for version waas/v2alpha1', async () => {
    const tool = [{
      name: 'sops',
      version: '3.6.1',
      url: 'https://source.com/sops'
    }]

    fs.readFileSync = jest.fn().mockReturnValue(yaml.dump(tool))
    const tools = config.loadConfig('waas/v2alpha1')

    expect(tools[0].name).toEqual('sops')
    expect(tools[0].version).toEqual('3.6.1')
    expect(tools[0].url).toEqual('https://source.com/sops')
  })

  it('Throws an error for the unsupported version', async () => {
    let error = null

    fs.readFileSync = jest.fn().mockReturnValue([])
    try {
      config.loadConfig('dummy')
    } catch (err) {
      error = err
    }

    expect(error).toEqual(new Error('version not supported'))
  })
})
