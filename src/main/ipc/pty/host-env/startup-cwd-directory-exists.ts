import { statSync } from 'node:fs'
import { isWslUncPath } from '../../../../shared/wsl-paths'

export function localStartupCwdDirectoryExists(path: string): boolean {
  // Why: Win32 statSync on \\wsl.localhost 9P shares can falsely report ENOENT; defer to the provider's WSL-aware validation.
  if (isWslUncPath(path)) {
    return true
  }
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}
