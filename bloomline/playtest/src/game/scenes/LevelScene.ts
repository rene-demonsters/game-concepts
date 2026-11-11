import Phaser from 'phaser';
import { type Dir, type Tile, add, isAdjacent, parseTile } from '../../core/coords.ts';
import { type Level, parseLevel } from '../../core/level.ts';
import type { StepCheck } from '../../core/path.ts';
import { type FailCause, type Outcome, type RunTimeline, type SimEvent, Run, simulate } from '../../core/sim.ts';
import { LEVELS } from '../../levels/index.ts';
import { solve } from '../../solver/solve.ts';
import { ctx } from '../context.ts';
import { PathInput } from '../input/PathInput.ts';
import { PathModel } from '../input/PathModel.ts';
import { type LevelLayout, type Screen, levelLayout, screenOf } from '../layout.ts';
import { COLORS, FONT, GREETING, SPECIES_NAME, hex } from '../theme.ts';
import { Button } from '../ui/Button.ts';
import { HeartsBadge, formatMs } from '../ui/HeartsBadge.ts';
import { Overlay } from '../ui/Overlay.ts';
import { BoardView } from '../view/BoardView.ts';
import { PathView } from '../view/PathView.ts';
import { relayoutOnResize } from './resize.ts';

type LevelData = { levelId: string; path?: Tile[]; message?: string; fresh?: boolean };
type Mode = 'planning' | 'running' | 'result';

const KEY_DIRS: Record<string, Dir> = { ArrowUp: 'N', ArrowRight: 'E', ArrowDown: 'S', ArrowLeft: 'W', w: 'N', d: 'E', s: 'S', a: 'W' };

const BUMP_HINT: Partial<Record<StepCheck | 'start-here', string>> = {
  'no-warmth': 'Out of warmth',
  used: 'Already walked there',
  'start-here': 'Draw from Ochre or the end of your path',
};

export class LevelScene extends Phaser.Scene {
  private def!: (typeof LEVELS)[number];
  private level!: Level;
  private screenInfo!: Screen;
  private lay!: LevelLayout;
  private board!: BoardView;
  private model!: PathModel;
  private pathView!: PathView;
  private input2!: PathInput;
  private hearts!: HeartsBadge;
  private mode: Mode = 'planning';
  private goButton!: Button;
  private undoButton!: Button;
  private clearButton!: Button;
  private fastButton!: Button;
  private warmthText!: Phaser.GameObjects.Text;
  private warmthBar!: Phaser.GameObjects.Graphics;
  private hintText!: Phaser.GameObjects.Text;
  private planStart = 0;
  private overlay: Overlay | null = null;
  // Run playback.
  private timeline: RunTimeline | null = null;
  private beat = 0;
  private acc = 0;
  private speed = 1;
  private parade: number[] = [];
  private runTiles: Tile[] = [];
  private hintTimer: Phaser.Time.TimerEvent | null = null;
  /** Debug only: shortest solutions, and which one the Solution button shows next. */
  private solutions: Tile[][] | null = null;
  private solutionIndex = 0;
  private solutionShown = false;

  constructor() {
    super('level');
  }

  init(data: LevelData): void {
    this.def = LEVELS.find((l) => l.id === data.levelId) ?? LEVELS[0]!;
    this.mode = 'planning';
    this.timeline = null;
    this.parade = [];
    this.overlay = null;
    this.solutions = null;
    this.solutionIndex = 0;
    this.solutionShown = false;
    this.tweens.timeScale = 1;
  }

  create(data: LevelData): void {
    const { session, synth, flags } = ctx();
    const u = this.registry.get('u') as number;
    this.level = parseLevel(this.def);
    this.screenInfo = screenOf(this.scale.width, this.scale.height, u);
    this.lay = levelLayout(this.screenInfo, this.level.width, this.level.height);
    this.cameras.main.setBackgroundColor(hex(COLORS.table));
    relayoutOnResize(this, () => (this.mode === 'running' ? null : { levelId: this.def.id, path: this.model.snapshot() }));
    if (data.fresh !== false && !data.path) session.track({ type: 'level-open', level: this.def.id });

    this.board = new BoardView(this, this.level, this.lay.tile, this.lay.originX, this.lay.originY);
    // The start tile is already in colour: the premise before the first move.
    const start = new Run(this.level);
    for (const e of start.timeline[0] ?? []) if (e.type === 'bloom') this.board.bloom(e.tiles, e.origin, !data.path);

    this.model = new PathModel(this.level, data.path);
    this.pathView = new PathView(this, this.board);
    this.input2 = new PathInput(this, this.board, this.model, {
      enabled: () => this.mode === 'planning' && !this.overlay,
      onChange: () => this.refreshPath(),
      onStep: () => {
        synth.tick();
        ctx().platform.haptics.tick();
      },
      onBump: (t, r) => this.onBump(t, r),
      onDragStart: () => {
        synth.unlock();
        synth.startDrone();
        this.board.setGridVisible(true);
        this.refreshPath();
      },
      onDragEnd: () => {
        this.board.setGridVisible(false);
        this.refreshPath();
        if (flags.commitOnRelease && this.model.length > 0) void this.go();
      },
    });

    this.buildHud(u);
    this.buildControls(u);
    this.bindKeys();
    this.refreshPath();
    this.planStart = this.time.now;
    if (data.message) this.showHint(data.message, 4200);

    ctx().platform.lifecycle.onBack(() => {
      if (!this.scene.isActive()) return false;
      if (this.overlay) {
        this.closeOverlay();
        return true;
      }
      if (this.mode === 'planning') {
        this.scene.start('menu');
        return true;
      }
      return true;
    });
  }

  // ---- HUD and controls ----

  private buildHud(u: number): void {
    const { hud, info } = this.lay;
    const { session } = ctx();
    new Button(this, { x: hud.x + 26 * u, y: hud.y + hud.h / 2, w: 52 * u, h: 40 * u, u, label: '‹', fontSize: Math.round(26 * u), style: 'quiet', onClick: () => this.backToMenu() });
    const idx = LEVELS.indexOf(this.def);
    this.add
      .text(hud.x + 62 * u, hud.y + hud.h / 2, `${idx + 1}. ${this.def.name}`, {
        fontFamily: FONT,
        fontSize: `${Math.round(18 * u)}px`,
        fontStyle: 'bold',
        color: hex(COLORS.text),
      })
      .setOrigin(0, 0.5);
    this.hearts = new HeartsBadge(this, session, hud.x + hud.w, hud.y + hud.h / 2, u);

    const intro = this.def.intro ?? '';
    this.hintText = this.add
      .text(info.x, info.y + 4 * u, intro, {
        fontFamily: FONT,
        fontSize: `${Math.round(13 * u)}px`,
        color: hex(COLORS.textSoft),
        wordWrap: { width: ctx().flags.debug ? info.w - 104 * u : info.w, useAdvancedWrap: true },
      })
      .setOrigin(0, 0);
    this.hintText.setData('intro', intro);
    if (ctx().flags.debug) {
      new Button(this, { x: info.x + info.w - 46 * u, y: info.y + 20 * u, w: 92 * u, h: 34 * u, u, label: 'Solution', fontSize: Math.round(12 * u), style: 'quiet', onClick: () => this.showSolution() });
    }

    const barY = this.screenInfo.landscape ? info.y + info.h - 26 * u : info.y + info.h - 20 * u;
    this.warmthText = this.add.text(info.x, barY, '', { fontFamily: FONT, fontSize: `${Math.round(13 * u)}px`, fontStyle: 'bold', color: hex(COLORS.text) }).setOrigin(0, 0.5);
    this.warmthBar = this.add.graphics();
    this.warmthBar.setData('geom', { x: info.x + 118 * u, y: barY - 5 * u, w: info.w - 118 * u, h: 10 * u, u });
  }

  private buildControls(u: number): void {
    const c = this.lay.controls;
    const gap = 10 * u;
    const h = Math.min(60 * u, c.h - 8 * u);
    const cy = c.y + c.h / 2;
    const small = (c.w - gap * 2) * 0.27;
    const big = c.w - small * 2 - gap * 2;
    this.undoButton = new Button(this, { x: c.x + small / 2, y: cy, w: small, h, u, label: 'Undo', onClick: () => this.undo() });
    this.clearButton = new Button(this, { x: c.x + small + gap + small / 2, y: cy, w: small, h, u, label: 'Clear', onClick: () => this.clearPath() });
    this.goButton = new Button(this, {
      x: c.x + small * 2 + gap * 2 + big / 2,
      y: cy,
      w: big,
      h,
      u,
      label: 'Go',
      style: 'primary',
      fontSize: Math.round(20 * u),
      onClick: () => void this.go(),
    });
    this.fastButton = new Button(this, { x: c.x + c.w / 2, y: cy, w: c.w, h, u, label: 'Faster  »', onClick: () => this.toggleSpeed() }).setVisible(false);
  }

  private bindKeys(): void {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.on('keydown', (e: KeyboardEvent) => {
      if (this.overlay) {
        if (e.key === 'Escape') this.closeOverlay();
        return;
      }
      if (this.mode === 'running') {
        if (e.key === ' ' || e.key === 'f') this.toggleSpeed();
        return;
      }
      if (this.mode !== 'planning') return;
      const dir = KEY_DIRS[e.key];
      if (dir) {
        ctx().synth.unlock();
        const t = add(this.model.head, dir);
        if (this.model.isPrevious(t)) this.model.pop();
        else {
          const r = this.model.extend(t);
          if (r !== 'ok') return this.onBump(t, r);
          ctx().synth.tick();
        }
        this.refreshPath();
        e.preventDefault();
      } else if (e.key === 'Backspace' || e.key === 'z') this.undo();
      else if (e.key === 'Escape' || e.key === 'c') this.clearPath();
      else if (e.key === 'Enter' || e.key === ' ') void this.go();
      else if (e.key === 'r') this.scene.restart({ levelId: this.def.id, path: this.model.snapshot() });
      else if (e.key === 'h' && ctx().flags.debug) this.showSolution();
    });
    // Right-click clears (desktop).
    this.input.mouse?.disableContextMenu();
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (p: Phaser.Input.Pointer) => {
      if (p.rightButtonDown() && this.mode === 'planning' && !this.overlay) this.clearPath();
      else if (this.mode === 'running' && p.leftButtonDown()) {
        // Tapping during a run speeds it up.
        if (this.board.hit(p.x, p.y)) this.toggleSpeed();
      }
    });
  }

  private refreshPath(): void {
    const full = this.model.length >= this.model.budget;
    this.pathView.draw(this.model.tiles, this.input2?.dragging ?? false, full);
    this.board.placeOchre(this.level.start);
    const used = this.model.length;
    const budget = this.model.budget;
    this.warmthText.setText(`Warmth  ${budget - used} left`);
    const geom = this.warmthBar.getData('geom') as { x: number; y: number; w: number; h: number; u: number };
    const g = this.warmthBar;
    g.clear();
    g.fillStyle(COLORS.tableEdge, 1);
    g.fillRoundedRect(geom.x, geom.y, geom.w, geom.h, geom.h / 2);
    const left = (budget - used) / budget;
    if (left > 0) {
      g.fillStyle(left < 0.2 ? 0xd9634a : COLORS.accent, 1);
      g.fillRoundedRect(geom.x, geom.y, Math.max(geom.h, geom.w * left), geom.h, geom.h / 2);
    }
    // Par tick: where "short and sweet" ends.
    const parX = geom.x + geom.w * (1 - this.level.par / budget);
    if (this.level.par < budget) {
      g.fillStyle(COLORS.text, 0.5);
      g.fillRect(parX - geom.u, geom.y - 3 * geom.u, 2 * geom.u, geom.h + 6 * geom.u);
    }
    this.undoButton.setEnabled(used > 0);
    this.clearButton.setEnabled(used > 0);
    this.goButton.setEnabled(used > 0);
  }

  private onBump(t: Tile, r: StepCheck | 'start-here'): void {
    ctx().synth.bump();
    ctx().platform.haptics.bump();
    if (isAdjacent(this.model.head, t)) this.pathView.bump(this, t, this.model.head);
    const hint = BUMP_HINT[r];
    if (hint) this.showHint(hint, 1400);
  }

  private showHint(text: string, ms: number): void {
    this.hintTimer?.remove();
    this.hintText.setText(text).setColor(hex(COLORS.text));
    this.hintTimer = this.time.delayedCall(ms, () => {
      this.hintText.setText(this.hintText.getData('intro') as string).setColor(hex(COLORS.textSoft));
    });
  }

  /** Debug: draw the next shortest solution as the current path. Press Go to watch it. */
  private showSolution(): void {
    if (this.mode !== 'planning' || this.overlay) return;
    if (!this.solutions) {
      const report = solve(this.level, { maxExamples: 20, nearSolutions: false });
      this.solutions = report.examples.map((names) => [this.level.start, ...names.map(parseTile)]);
    }
    if (this.solutions.length === 0) return this.showHint('The solver found no solution for this level.', 2500);
    const i = this.solutionIndex % this.solutions.length;
    this.solutionIndex++;
    this.model.clear();
    for (const t of this.solutions[i]!.slice(1)) this.model.extend(t);
    this.refreshPath();
    this.solutionShown = true;
    ctx().session.track({ type: 'solution-shown', level: this.def.id });
    const total = this.solutions.length >= 20 ? '20+' : String(this.solutions.length);
    this.showHint(`Solution ${i + 1} of ${total} shortest (${this.model.length} tiles). Press Go to watch it.`, 3500);
  }

  private undo(): void {
    if (this.mode !== 'planning') return;
    if (this.model.pop()) this.refreshPath();
  }

  private clearPath(): void {
    if (this.mode !== 'planning') return;
    this.model.clear();
    this.refreshPath();
  }

  private backToMenu(): void {
    if (this.mode === 'running') return;
    this.scene.start('menu');
  }

  // ---- the run ----

  private async go(): Promise<void> {
    if (this.mode !== 'planning' || this.overlay) return;
    if (this.model.length === 0) return this.showHint('Draw a path first: drag from Ochre.', 1800);
    const { session, synth } = ctx();
    synth.unlock();
    this.input2.cancel();
    if (!(await session.beginRun(this.def.id))) return this.showOutOfHearts();
    this.mode = 'running';
    this.board.setGridVisible(false);
    this.runTiles = this.model.snapshot();
    this.timeline = simulate(this.level, this.runTiles);
    this.beat = 0;
    this.acc = 0;
    this.speed = session.settings.fast ? 2 : 1;
    this.tweens.timeScale = this.speed;
    this.goButton.setVisible(false);
    this.undoButton.setVisible(false);
    this.clearButton.setVisible(false);
    this.fastButton.setVisible(true).setLabel(this.speed > 1 ? 'Normal speed' : 'Faster  »');
    synth.startDrone();
  }

  private toggleSpeed(): void {
    if (this.mode !== 'running') return;
    this.speed = this.speed > 1 ? 1 : 3;
    this.tweens.timeScale = this.speed;
    this.fastButton.setLabel(this.speed > 1 ? 'Normal speed' : 'Faster  »');
  }

  override update(_time: number, delta: number): void {
    if (this.mode !== 'running' || !this.timeline) return;
    const beatMs = ctx().flags.beatMs;
    this.acc += delta * this.speed;
    const last = this.timeline.beats.length - 1;
    while (this.acc >= beatMs && this.beat < last) {
      this.acc -= beatMs;
      this.beat++;
      try {
        this.playBeat(this.timeline.beats[this.beat]!);
      } catch (err) {
        // A failed effect (audio, haptics, a tween) must never freeze the run: the outcome is
        // already decided by the simulation, so keep playing.
        console.error('Bloomline: error while playing beat', this.beat, err);
      }
    }
    if (this.beat >= last && this.acc >= beatMs * 1.6) {
      this.mode = 'result';
      this.finishRun(this.timeline.outcome);
    }
  }

  private playBeat(events: SimEvent[]): void {
    const { synth } = ctx();
    const beatMs = ctx().flags.beatMs;
    let stepped = false;
    let joined = false;
    for (const e of events) {
      switch (e.type) {
        case 'step': {
          stepped = true;
          const c = this.board.centre(e.to);
          this.board.ochre.setDepth(this.board.depthFor(e.to) + 1);
          this.tweens.add({ targets: this.board.ochre, x: c.x, y: c.y, duration: beatMs * 0.7, ease: 'Sine.inOut' });
          this.tweens.add({ targets: this.board.ochre, scaleY: 0.9, scaleX: 1.08, yoyo: true, duration: beatMs * 0.3 });
          synth.step();
          // The path is used up behind Ochre; the parade walks on it.
          this.pathView.draw(this.runTiles.slice(e.beat), false, false);
          break;
        }
        case 'greet': {
          const sp = this.board.creatures[e.creature]!;
          this.parade.push(e.creature);
          this.board.setLook(e.creature, 'cheered');
          joined = true;
          // Hop the drawing, not the container: the container's position belongs to the parade.
          this.tweens.add({ targets: sp.gfx, y: -this.board.ts * 0.25, yoyo: true, duration: 160, ease: 'Quad.out', onComplete: () => sp.gfx.setY(0) });
          this.board.floatText(sp.creature.at, GREETING[sp.creature.species], COLORS.accentDark);
          synth.greet(sp.creature.species, e.paradeIndex);
          ctx().platform.haptics.success();
          break;
        }
        case 'bloom':
          if (e.source !== 'start') this.board.bloom(e.tiles, e.origin);
          break;
        case 'hide': {
          const sp = this.board.creatures[e.creature]!;
          this.board.setLook(e.creature, 'hidden');
          this.board.floatText(sp.creature.at, 'eep!', COLORS.textSoft);
          break;
        }
        case 'grumpy': {
          const sp = this.board.creatures[e.creature]!;
          this.board.setLook(e.creature, 'grumpy');
          this.board.floatText(sp.creature.at, 'hmph.', COLORS.grumpy);
          this.board.shake(sp.container);
          break;
        }
        case 'tick':
          this.board.setCountdown(e.creature, e.remaining);
          break;
        case 'honk': {
          const sp = this.board.creatures[e.creature]!;
          this.board.setCountdown(e.creature, 0);
          this.board.setLook(e.creature, 'honked');
          this.board.floatText(sp.creature.at, 'HONK', 0xc8463a, 0.32);
          this.board.shake(sp.container, 0.1);
          this.cameras.main.shake(180, 0.004);
          synth.honk();
          break;
        }
        case 'start':
        case 'end':
          break;
      }
    }
    // Greetings at the path end share the last step's beat, but line up on any greeting anyway,
    // so a new member always walks to the end of the line.
    if (stepped || joined) this.moveParade();
  }

  /** Follower k walks k+1 tiles behind Ochre, on the path. */
  private moveParade(): void {
    const beatMs = ctx().flags.beatMs;
    this.parade.forEach((ci, k) => {
      const idx = this.beat - 1 - k;
      if (idx < 0) return;
      const t = this.runTiles[idx]!;
      const sp = this.board.creatures[ci]!;
      const c = this.board.centre(t);
      sp.container.setDepth(this.board.depthFor(t));
      this.tweens.add({ targets: sp.container, x: c.x, y: c.y, scale: 0.8, duration: beatMs * 0.7, ease: 'Sine.inOut' });
    });
  }

  private finishRun(outcome: Outcome): void {
    const { session, synth } = ctx();
    const planMs = this.time.now - this.planStart;
    const report = session.reportRun(this.def.id, outcome, planMs, this.solutionShown);
    this.fastButton.setVisible(false);
    this.tweens.timeScale = 1;
    if (outcome.cleared) {
      synth.clear();
      synth.stopAll();
      ctx().platform.haptics.success();
      // Everyone hops.
      for (const ci of [...this.parade, -1]) {
        // Again only the drawing hops, so nobody's place in the line changes.
        const target = ci === -1 ? (this.board.ochre.list[0] as Phaser.GameObjects.Graphics) : this.board.creatures[ci]!.gfx;
        this.tweens.add({ targets: target, y: -this.board.ts * 0.2, yoyo: true, repeat: 2, duration: 180, delay: Math.max(0, ci) * 40, onComplete: () => target.setY(0) });
      }
      this.time.delayedCall(900, () => this.showResult(outcome, report.newBestStars));
      return;
    }
    synth.sigh();
    synth.stopAll();
    for (const i of outcome.gray) {
      const sp = this.board.creatures[i]!;
      if (outcome.causes[i] === 'not-reached') this.board.floatText(sp.creature.at, 'sigh', COLORS.textSoft);
      this.board.shake(sp.container, 0.03);
    }
    if (report.heartLost) this.hearts.loseOne();
    const message = failMessage(this.level, outcome, report.heartLost);
    this.showHint(message, 2000);
    this.time.delayedCall(1700, () => this.scene.restart({ levelId: this.def.id, path: this.runTiles, message, fresh: false }));
  }

  // ---- overlays ----

  private closeOverlay(): void {
    this.overlay?.destroy();
    this.overlay = null;
  }

  private showResult(outcome: Outcome, newBest: boolean): void {
    const u = this.registry.get('u') as number;
    const o = new Overlay(this, 360 * u, 360 * u, u, 0.2);
    this.overlay = o;
    const { x, y, w } = o.panel;
    const cx = x + w / 2;
    o.text(cx, y + 22 * u, CLEAR_LINES[(LEVELS.indexOf(this.def) + outcome.length) % CLEAR_LINES.length]!, 20, { bold: true, wrap: w - 40 * u });
    const stars = o.text(cx, y + 64 * u, '★'.repeat(outcome.stars) + '☆'.repeat(3 - outcome.stars), 44, { colour: COLORS.star });
    stars.setScale(0.5);
    this.tweens.add({ targets: stars, scale: 1, duration: 380, ease: 'Back.out' });
    const par = outcome.length <= this.level.par ? '✓' : '·';
    const bloom = outcome.bloomPct >= this.level.bloomTarget ? '✓' : '·';
    o.text(cx, y + 130 * u, `${par}  Path ${outcome.length} tiles  (par ${this.level.par})`, 14);
    o.text(cx, y + 154 * u, `${bloom}  Bloom ${Math.round(outcome.bloomPct * 100)}%  (goal ${Math.round(this.level.bloomTarget * 100)}%)`, 14);
    if (newBest) o.text(cx, y + 180 * u, 'New best', 12, { colour: COLORS.accentDark, bold: true });
    const next = ctx().session.nextLevel(this.def.id);
    const bw = (w - 48 * u) / 2;
    const by = y + 236 * u;
    o.button({ x: x + 16 * u + bw / 2, y: by, w: bw, h: 50 * u, label: 'Replay', onClick: () => this.scene.restart({ levelId: this.def.id }) });
    o.button({
      x: x + w - 16 * u - bw / 2,
      y: by,
      w: bw,
      h: 50 * u,
      label: next ? 'Next' : 'Levels',
      style: 'primary',
      onClick: () => (next ? this.scene.start('level', { levelId: next.id }) : this.scene.start('menu')),
    });
    o.button({ x: cx, y: by + 56 * u, w: w - 32 * u, h: 40 * u, label: 'All levels', style: 'quiet', onClick: () => this.scene.start('menu') });
  }

  private showOutOfHearts(): void {
    const { session } = ctx();
    const u = this.registry.get('u') as number;
    const o = new Overlay(this, 360 * u, 360 * u, u);
    this.overlay = o;
    const { x, y, w } = o.panel;
    const cx = x + w / 2;
    o.text(cx, y + 24 * u, 'Out of hearts', 22, { bold: true });
    const timer = o.text(cx, y + 62 * u, '', 15, { colour: COLORS.textSoft });
    const tick = () => timer.setText(`Next heart in ${formatMs(session.msToNextHeart())}`);
    tick();
    const ev = this.time.addEvent({ delay: 500, loop: true, callback: tick });
    o.add(this.add.zone(0, 0, 1, 1)).once('destroy', () => ev.remove());
    o.text(cx, y + 92 * u, 'Planning is free. Keep drawing; only Go costs a heart.', 13, { colour: COLORS.textSoft, wrap: w - 40 * u });
    const refill = session.offer('hearts.refill');
    const mug = session.offer('mug.1h');
    const bw = w - 32 * u;
    o.button({
      x: cx,
      y: y + 168 * u,
      w: bw,
      h: 52 * u,
      label: `${refill.title}  ·  ${refill.price}`,
      style: 'primary',
      onClick: async () => {
        await session.redeem('hearts.refill');
        this.hearts.refresh();
        this.closeOverlay();
      },
    });
    o.button({
      x: cx,
      y: y + 228 * u,
      w: bw,
      h: 46 * u,
      label: `${mug.title}: 1 hour  ·  ${mug.price}`,
      onClick: async () => {
        await session.redeem('mug.1h');
        this.hearts.refresh();
        this.closeOverlay();
      },
    });
    o.button({ x: cx, y: y + 290 * u, w: bw, h: 44 * u, label: 'Wait', style: 'quiet', onClick: () => this.closeOverlay() });
  }
}

const CLEAR_LINES = [
  'Everyone is cheered up.',
  'A parade, and nobody organised it.',
  'Colour restored. Mood: improved.',
  'That went better than expected.',
  'The clearing approves.',
];

function creatureName(level: Level, index: number): string {
  return `the ${SPECIES_NAME[level.creatures[index]!.species]}`;
}

function failMessage(level: Level, outcome: Outcome, heartLost: boolean): string {
  const order: FailCause[] = ['grumpy', 'hid', 'honked', 'honk-hid', 'not-reached'];
  const first = outcome.gray.slice().sort((a, b) => order.indexOf(outcome.causes[a]!) - order.indexOf(outcome.causes[b]!))[0]!;
  const who = creatureName(level, first);
  const lines: Record<FailCause, string> = {
    grumpy: `You turned right next to ${who}. It woke up grumpy.`,
    hid: `${cap(who)} didn't see you coming, so it hid.`,
    honked: `${cap(who)} ran out of patience and honked.`,
    'honk-hid': `The goose honked, and ${who} hid.`,
    'not-reached': `${cap(who)} never got a visit.`,
  };
  let msg = lines[outcome.causes[first]!];
  if (outcome.nearMiss) msg += ' So close: just one left.';
  else if (outcome.gray.length > 1) msg += ` (${outcome.gray.length} still gray.)`;
  if (heartLost) msg += '  −1 ♥';
  return msg;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
