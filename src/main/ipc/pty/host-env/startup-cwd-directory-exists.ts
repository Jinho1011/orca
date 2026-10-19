import { statSync } from 'node:fs'
import { isWslUncPath } from '../../../../shared/wsl-paths'
import { wslUncDirectoryExistsAsync } from '../../../wsl'

export function localStartupCwdDirectoryExists(path: string): boolean {
  // Why: Win32 statSync on \\wsl.localhost 9P shares can falsely report ENOENT; defer to the provider's WSL-aware validation.
  if (isWslUncPath(path)) {
    return true
  }
  return probeLocalStartupCwdDirectory(path) === true
}

export function probeLocalStartupCwdDirectory(path: string): boolean | null {
  try {
    return statSync(path).isDirectory()
  } catch (error) {
    // Saved-folder correction and recovered-path relocation require proof of absence.
    return error &&
      typeof error === 'object' &&
      'code' in error &&
      (error.code === 'ENOENT' || error.code === 'ENOTDIR')
      ? false
      : null
  }
}

export function probeRecoveredStartupCwdDirectory(path: string): Promise<boolean | null> {
  return isWslUncPath(path)
    ? wslUncDirectoryExistsAsync(path)
    : Promise.resolve(probeLocalStartupCwdDirectory(path))
}
