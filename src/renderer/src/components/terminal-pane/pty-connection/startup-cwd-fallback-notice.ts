import { writeTerminalOutput } from '@/lib/pane-manager/pane-terminal-output-scheduler'
import { STARTUP_CWD_FALLBACK_NOTICE } from '../../../../../shared/startup-cwd-fallback'
import { shouldWritePtyOutputForeground } from './foreground-output-scan'
import type { ConnectPanePtySession } from './connect-pane-pty-session'

// Why in memory: the host reveals its tab before the pane mounts, so the pane's first attach writes it.
const owedNoticePtyIds = new Set<string>()

export function oweStartupCwdFallbackNotice(ptyId: string): void {
  owedNoticePtyIds.add(ptyId)
}

/** Writes the line once, for a fallback this attach reported or one the host's reveal left owed. */
export function writeStartupCwdFallbackNotice(
  session: ConnectPanePtySession,
  ptyId: string,
  reported: boolean
): void {
  if (owedNoticePtyIds.delete(ptyId) || reported) {
    writeTerminalOutput(session.pane.terminal, STARTUP_CWD_FALLBACK_NOTICE, {
      foreground: shouldWritePtyOutputForeground(session.deps.isVisibleRef.current)
    })
  }
}
