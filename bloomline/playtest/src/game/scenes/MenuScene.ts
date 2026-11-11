import Phaser from 'phaser';
import { LEVELS } from '../../levels/index.ts';
import { ctx } from '../context.ts';
import { type Screen, screenOf } from '../layout.ts';
import { COLORS, FONT, hex } from '../theme.ts';
import { Button } from '../ui/Button.ts';
import { HeartsBadge } from '../ui/HeartsBadge.ts';
import { relayoutOnResize } from './resize.ts';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create(): void {
    const { session, flags, synth } = ctx();
    const u = this.registry.get('u') as number;
    const s: Screen = screenOf(this.scale.width, this.scale.height, u);
    this.cameras.main.setBackgroundColor(hex(COLORS.table));
    relayoutOnResize(this);

    const left = s.safe.left + 18 * u;
    const right = s.w - s.safe.right - 18 * u;
    const top = s.safe.top + 18 * u;
    const colW = right - left;

    this.add.text(left, top, 'Bloomline', { fontFamily: FONT, fontSize: `${Math.round(30 * u)}px`, fontStyle: 'bold', color: hex(COLORS.text) });
    this.add.text(left, top + 38 * u, `playtest · ${session.totalStars()} / ${LEVELS.length * 3} stars`, {
      fontFamily: FONT,
      fontSize: `${Math.round(13 * u)}px`,
      color: hex(COLORS.textSoft),
    });
    new HeartsBadge(this, session, right, top + 18 * u, u);

    let y = top + 76 * u;
    if (session.recoveredPendingRun) {
      this.add
        .text(left, y, 'Your last run was interrupted, so it counted as a try.', {
          fontFamily: FONT,
          fontSize: `${Math.round(12 * u)}px`,
          color: hex(COLORS.textSoft),
          wordWrap: { width: colW },
        })
        .setOrigin(0, 0);
      session.recoveredPendingRun = null;
      y += 28 * u;
    }

    const cols = s.landscape ? 4 : 2;
    const gap = 12 * u;
    const cardW = (colW - gap * (cols - 1)) / cols;
    const reserveBottom = (flags.debug ? 110 : 50) * u + s.safe.bottom;
    const rows = Math.ceil(LEVELS.length / cols);
    const cardH = Math.min(96 * u, (s.h - y - reserveBottom - gap * (rows - 1)) / rows);

    LEVELS.forEach((def, i) => {
      const cx = left + (i % cols) * (cardW + gap) + cardW / 2;
      const cy = y + Math.floor(i / cols) * (cardH + gap) + cardH / 2;
      const unlocked = session.isUnlocked(def.id);
      const p = session.progressFor(def.id);
      const stars = '★'.repeat(p.stars) + '☆'.repeat(3 - p.stars);
      const tricky = i >= 6 ? (i === 6 ? '  · normal' : '  · tricky') : '';
      const label = unlocked ? `${i + 1}. ${def.name}\n${stars}${tricky}` : `${i + 1}. locked`;
      new Button(this, {
        x: cx,
        y: cy,
        w: cardW,
        h: cardH,
        u,
        label,
        fontSize: Math.round(14 * u),
        style: unlocked ? 'normal' : 'quiet',
        onClick: () => {
          synth.unlock();
          if (unlocked) this.scene.start('level', { levelId: def.id });
        },
      }).setEnabled(unlocked);
    });

    // Footer.
    const fy = s.h - s.safe.bottom - 30 * u;
    const small = (x: number, yy: number, w: number, label: string, onClick: () => void) =>
      new Button(this, { x, y: yy, w, h: 34 * u, u, label, fontSize: Math.round(12 * u), style: 'quiet', onClick });
    small(left + 50 * u, fy, 100 * u, session.settings.muted ? 'Sound: off' : 'Sound: on', () => {
      session.setSetting('muted', !session.settings.muted);
      synth.setMuted(session.settings.muted);
      this.scene.restart();
    });
    this.add
      .text(right, fy, 'Drag from Ochre to draw. Go to run.', { fontFamily: FONT, fontSize: `${Math.round(11 * u)}px`, color: hex(COLORS.textSoft) })
      .setOrigin(1, 0.5);

    if (flags.debug) {
      const dy = fy - 44 * u;
      const items: [string, () => void | Promise<void>][] = [
        [session.unlockAll ? 'Lock levels' : 'Unlock all', () => session.debugUnlockAll(!session.unlockAll)],
        ['Hearts 0', () => session.debugSetHearts(0)],
        ['Hearts 5', () => session.debugSetHearts(5)],
        ['Export data', () => exportAnalytics(session.exportAnalytics())],
        ['Reset save', () => session.debugReset()],
      ];
      const bw = Math.min(110 * u, (colW - gap * (items.length - 1)) / items.length);
      items.forEach(([label, fn], k) =>
        small(left + bw / 2 + k * (bw + gap * 0.5), dy, bw, label, async () => {
          await fn();
          this.scene.restart();
        }),
      );
      this.add.text(left, dy - 30 * u, 'debug', { fontFamily: FONT, fontSize: `${Math.round(11 * u)}px`, color: hex(COLORS.textSoft) });
    }
  }
}

async function exportAnalytics(json: string): Promise<void> {
  const name = `bloomline-playtest-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.json`;
  try {
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } catch {
    await navigator.clipboard?.writeText(json);
  }
}
