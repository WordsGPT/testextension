import type { VerbaSettings, WordStatus } from '../shared/types';

export interface GamepadActions {
  stepWord: (dir: 1 | -1) => void;
  markOpenWordKnown: () => void;
  closeOpenWord: () => void;
  cycleOpenWordGrade: (status: WordStatus) => void;
  addOpenWordToAnki: () => void;
  videoLineStep: (dir: 1 | -1) => void;
  videoTogglePlay: () => void;
  scrollPage: (dy: number) => void;
}

/**
 * Implements Verba's Bluetooth / Gamepad API controller (8BitDo Zero 2 / Micro / standard Xbox/Switch layout).
 */
export class VerbaGamepadController {
  private rafId: number | null = null;
  private prevPressed = new Set<number>();
  private rCycleLevel = 0;
  private rCommitTimer: number | null = null;

  constructor(public settings: VerbaSettings, private actions: GamepadActions) {}

  public start(): void {
    if (this.rafId !== null || typeof navigator.getGamepads !== 'function') return;
    const poll = () => {
      if (this.settings.gamepadEnabled) {
        this.tick();
      }
      this.rafId = window.requestAnimationFrame(poll);
    };
    this.rafId = window.requestAnimationFrame(poll);
  }

  private tick(): void {
    const pads = navigator.getGamepads?.() || [];
    const pad = pads.find(Boolean);
    if (!pad) return;

    const isPressed = (idx: number) => Boolean(pad.buttons[idx]?.pressed);
    const justPressed = (idx: number) => isPressed(idx) && !this.prevPressed.has(idx);

    const holdL = isPressed(4) || isPressed(6);
    const holdR = isPressed(5) || isPressed(7);

    const btnA = this.settings.swapABXY ? 1 : 0;
    const btnB = this.settings.swapABXY ? 0 : 1;
    const btnX = this.settings.swapABXY ? 3 : 2;
    const btnY = this.settings.swapABXY ? 2 : 3;

    // D-pad: 12=Up, 13=Down, 14=Left, 15=Right
    if (justPressed(15)) this.actions.stepWord(1);
    if (justPressed(14)) this.actions.stepWord(-1);
    if (justPressed(12)) this.actions.markOpenWordKnown();
    if (justPressed(13)) this.actions.closeOpenWord();

    if (holdR && justPressed(btnB)) {
      const cycle: WordStatus[] = [0, 1, 2, 3, 4, 5];
      this.rCycleLevel = (this.rCycleLevel + 1) % cycle.length;
      if (this.rCommitTimer) window.clearTimeout(this.rCommitTimer);
      const chosen = cycle[this.rCycleLevel];
      this.rCommitTimer = window.setTimeout(() => {
        this.actions.cycleOpenWordGrade(chosen);
      }, 1200);
    } else if (holdL && justPressed(btnX)) {
      this.actions.addOpenWordToAnki();
    } else {
      if (justPressed(btnA)) this.actions.videoLineStep(1);
      if (justPressed(btnY)) this.actions.videoLineStep(-1);
      if (justPressed(btnB)) this.actions.videoTogglePlay();
    }

    this.prevPressed.clear();
    pad.buttons.forEach((b, idx) => {
      if (b.pressed) this.prevPressed.add(idx);
    });
  }

  public stop(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
