export type Rect = { x: number; y: number; w: number; h: number };

export type Insets = { top: number; right: number; bottom: number; left: number };

/** Reads CSS safe-area insets (notch, home indicator) in CSS pixels. */
export function readSafeArea(): Insets {
  const probe = document.getElementById('safe-area-probe');
  if (!probe) return { top: 0, right: 0, bottom: 0, left: 0 };
  const s = getComputedStyle(probe);
  return {
    top: parseFloat(s.paddingTop) || 0,
    right: parseFloat(s.paddingRight) || 0,
    bottom: parseFloat(s.paddingBottom) || 0,
    left: parseFloat(s.paddingLeft) || 0,
  };
}

export type Screen = {
  /** Canvas size in device pixels. */
  w: number;
  h: number;
  /** Device pixels per CSS pixel. Multiply every CSS size by this. */
  u: number;
  safe: Insets;
  landscape: boolean;
};

export function screenOf(w: number, h: number, u: number): Screen {
  const css = readSafeArea();
  return {
    w,
    h,
    u,
    safe: { top: css.top * u, right: css.right * u, bottom: css.bottom * u, left: css.left * u },
    landscape: w > h * 1.15,
  };
}

export type LevelLayout = {
  hud: Rect;
  info: Rect;
  board: Rect;
  controls: Rect;
  tile: number;
  /** Top-left of the grid in device pixels. */
  originX: number;
  originY: number;
};

/** Portrait: HUD, info line, board, buttons from top to bottom. Landscape: board left, panel right. */
export function levelLayout(s: Screen, cols: number, rows: number): LevelLayout {
  const { u, safe } = s;
  const pad = 12 * u;
  const left = safe.left + pad;
  const right = s.w - safe.right - pad;
  const top = safe.top + pad * 0.5;
  const bottom = s.h - safe.bottom - pad;
  const hudH = 52 * u;
  const hud: Rect = { x: left, y: top, w: right - left, h: hudH };
  let info: Rect, board: Rect, controls: Rect;
  if (!s.landscape) {
    const infoH = 64 * u;
    const controlsH = 76 * u;
    info = { x: left, y: hud.y + hud.h, w: right - left, h: infoH };
    controls = { x: left, y: bottom - controlsH, w: right - left, h: controlsH };
    board = { x: left, y: info.y + info.h + pad * 0.5, w: right - left, h: controls.y - pad - (info.y + info.h + pad * 0.5) };
  } else {
    const panelW = Math.min(340 * u, (right - left) * 0.36);
    const panelX = right - panelW;
    info = { x: panelX, y: hud.y + hud.h + pad, w: panelW, h: 150 * u };
    controls = { x: panelX, y: bottom - 76 * u, w: panelW, h: 76 * u };
    board = { x: left, y: hud.y + hud.h + pad * 0.5, w: panelX - left - pad * 2, h: bottom - (hud.y + hud.h + pad * 0.5) };
  }
  const tile = Math.floor(Math.min(board.w / cols, board.h / rows, 128 * u));
  const originX = Math.round(board.x + (board.w - tile * cols) / 2);
  const originY = Math.round(board.y + (board.h - tile * rows) / 2);
  return { hud, info, board, controls, tile, originX, originY };
}
