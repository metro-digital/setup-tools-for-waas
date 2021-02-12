import * as actionsExec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

export interface Result {
  status: boolean
  output: string
  error: string
}

export async function exec (command: string, args: string[], stdin?: string) {
  let output: string = ''
  let error: string = ''
  const options: ExecOptions = {
    silent: true,
    ignoreReturnCode: true,
    input: Buffer.from(stdin || '')
  }
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString()
    },
    stderr: (data: Buffer) => {
      error += data.toString()
    }
  }
  const returnCode = await actionsExec.exec(command, args, options)
  const result = {
    status: returnCode === 0,
    output: output.trim(),
    error: error.trim()
  } as Result

  return result
}
