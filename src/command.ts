import * as actionsExec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

export interface Result {
  status: boolean
  output: string
  error: string
}

export async function exec (command: string, args: string[], stdin?: string) {
  let output = Buffer.from([])
  let error = Buffer.from([])
  const options: ExecOptions = {
    silent: true,
    ignoreReturnCode: true,
    input: Buffer.from(stdin || '')
  }
  options.listeners = {
    stdout: (data: Buffer) => {
      output = Buffer.concat([output, data])
    },
    stderr: (data: Buffer) => {
      error = Buffer.concat([error, data])
    }
  }
  const returnCode = await actionsExec.exec(command, args, options)
  const result: Result = {
    status: returnCode === 0,
    output: output.toString().trim(),
    error: error.toString().trim()
  }

  return result
}
