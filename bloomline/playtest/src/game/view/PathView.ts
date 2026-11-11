import type Phaser from 'phaser';
import type { Tile } from '../../core/coords.ts';
import { COLORS } from '../theme.ts';
import { type BoardView, DEPTH } from './BoardView.ts';

/** The warm line between tile centres, and the ring on its head. */
export class PathView {
  private readonly g: Phaser.GameObjects.Graphics;
  private readonly head: Phaser.GameObjects.Graphics;
  private readonly board: BoardView;
  private bumpTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, board: BoardView) {
    this.board = board;
    this.g = scene.add.graphics().setDepth(DEPTH.path);
    this.head = scene.add.graphics().setDepth(DEPTH.path + 1);
  }

  draw(tiles: readonly Tile[], dragging: boolean, full: boolean): void {
    const s = this.board.ts;
    const g = this.g;
    g.clear();
    const pts = tiles.map((t) => this.board.centre(t));
    const w = s * 0.17;
    for (const [colour, width, alpha] of [
      [COLORS.pathEdge, w * 1.35, 0.9],
      [COLORS.path, w, 1],
    ] as const) {
      g.lineStyle(width, colour, alpha);
      g.fillStyle(colour, alpha);
      for (let i = 0; i < pts.length - 1; i++) g.lineBetween(pts[i]!.x, pts[i]!.y, pts[i + 1]!.x, pts[i + 1]!.y);
      for (const p of pts.slice(1)) g.fillCircle(p.x, p.y, width / 2);
    }
    // Small warm dots on each tile centre, like seeds waiting to sprout.
    g.fillStyle(0xfff1d6, 0.9);
    for (const p of pts.slice(1, -1)) g.fillCircle(p.x, p.y, w * 0.22);

    const h = this.head;
    h.clear();
    const last = pts[pts.length - 1]!;
    if (tiles.length > 1) {
      // Larger while dragging so it peeks out from under a finger.
      const r = s * (dragging ? 0.6 : 0.42);
      h.lineStyle(s * 0.05, full ? 0xc8463a : COLORS.pathEdge, 0.85);
      h.strokeCircle(0, 0, r);
      h.setPosition(last.x, last.y);
    }
  }

  setVisible(on: boolean): void {
    this.g.setVisible(on);
    this.head.setVisible(on);
  }

  /** A little nudge of the head toward a tile you can't go to. */
  bump(scene: Phaser.Scene, toward: Tile, from: Tile): void {
    const a = this.board.centre(from);
    const b = this.board.centre(toward);
    this.bumpTween?.stop();
    this.head.setPosition(a.x, a.y);
    this.bumpTween = scene.tweens.add({
      targets: this.head,
      x: a.x + (b.x - a.x) * 0.18,
      y: a.y + (b.y - a.y) * 0.18,
      yoyo: true,
      duration: 70,
      onComplete: () => this.head.setPosition(a.x, a.y),
    });
  }
}
