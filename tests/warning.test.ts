import { warnForDeprecatedVersion } from '../src/warning'
import * as core from '@actions/core'

const mockCoreWarning = jest
  .spyOn(core, 'warning')
  .mockImplementation(jest.fn())

beforeEach(() => {
  mockCoreWarning.mockReset()
})

test('For version waas/v1alpha4', () => {
  warnForDeprecatedVersion('waas/v1alpha4')

  expect(mockCoreWarning).not.toHaveBeenCalled()
})

test('For version waas/v2alpha4', () => {
  warnForDeprecatedVersion('waas/v2alpha4')

  expect(mockCoreWarning).toHaveBeenCalled()
})

test('For version waas/v2', () => {
  warnForDeprecatedVersion('waas/v2')

  expect(mockCoreWarning).not.toHaveBeenCalled()
})
