import { type Page, expect, test } from '@playwright/test';

type Pt = { x: number; y: number };

/** CSS-pixel centre of a tile, read from the running level scene. */
async function tileCentre(page: Page, name: string): Promise<Pt> {
  return page.evaluate((n) => {
    const w = window as unknown as { __bloomline: { game: { scene: { getScene(k: string): any } ; registry: { get(k: string): number } } } };
    const scene = w.__bloomline.game.scene.getScene('level');
    const u = w.__bloomline.game.registry.get('u');
    const x = n.charCodeAt(0) - 65;
    const y = Number(n.slice(1)) - 1;
    const c = scene.board.centre({ x, y });
    return { x: c.x / u, y: c.y / u };
  }, name);
}

async function waitForLevel(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const w = window as unknown as { __bloomline?: { game: { scene: { isActive(k: string): boolean } } } };
    return !!w.__bloomline && w.__bloomline.game.scene.isActive('level');
  });
  await page.waitForTimeout(300);
}

async function pathLength(page: Page): Promise<number> {
  return page.evaluate(() => (window as any).__bloomline.game.scene.getScene('level').model.length);
}

async function progress(page: Page, id: string): Promise<{ clears: number; attempts: number; stars: number }> {
  return page.evaluate((i) => (window as any).__bloomline.session.progressFor(i), id);
}

async function drag(page: Page, tiles: string[], touch: boolean): Promise<void> {
  const pts: Pt[] = [];
  for (const t of tiles) pts.push(await tileCentre(page, t));
  if (!touch) {
    await page.mouse.move(pts[0]!.x, pts[0]!.y);
    await page.mouse.down();
    for (const p of pts.slice(1)) await page.mouse.move(p.x, p.y, { steps: 6 });
    await page.mouse.up();
    return;
  }
  // Touch: dispatch a real touch drag through CDP.
  const client = await page.context().newCDPSession(page);
  const send = (type: 'touchStart' | 'touchMove' | 'touchEnd', p?: Pt) =>
    client.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: p.x, y: p.y, id: 1 }] : [] });
  await send('touchStart', pts[0]);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    for (let k = 1; k <= 6; k++) await send('touchMove', { x: a.x + ((b.x - a.x) * k) / 6, y: a.y + ((b.y - a.y) * k) / 6 });
  }
  await send('touchEnd');
}

async function pressGo(page: Page): Promise<void> {
  await page.keyboard.press('Enter');
}

test.beforeEach(({ page }) => {
  page.on('pageerror', (e) => {
    throw new Error(`Uncaught error in the page: ${e.message}`);
  });
});

test('draw a path, run it, and clear level 1', async ({ page }, info) => {
  const touch = info.project.name === 'phone';
  await page.goto('/?level=two-rabbits&reset=1&debug=1&beatMs=120');
  await waitForLevel(page);
  await page.screenshot({ path: `test-results/${info.project.name}-1-planning.png` });
  await drag(page, ['C1', 'C2', 'C3', 'C4', 'C5'], touch);
  expect(await pathLength(page)).toBe(4);
  await page.screenshot({ path: `test-results/${info.project.name}-2-drawn.png` });
  if (touch) {
    const go = await page.evaluate(() => {
      const s = (window as any).__bloomline.game.scene.getScene('level');
      const u = (window as any).__bloomline.game.registry.get('u');
      return { x: s.goButton.zone.x / u, y: s.goButton.zone.y / u };
    });
    await page.touchscreen.tap(go.x, go.y);
  } else {
    await pressGo(page);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/${info.project.name}-3-running.png` });
  await expect.poll(() => progress(page, 'two-rabbits').then((p) => p.clears), { timeout: 10_000 }).toBe(1);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `test-results/${info.project.name}-4-cleared.png` });
});

test('dragging back undoes, blocked tiles are refused, and a failed run costs a heart', async ({ page }, info) => {
  const touch = info.project.name === 'phone';
  await page.goto('/?level=goose-first&reset=1&debug=1&beatMs=100');
  await waitForLevel(page);
  // Up column A toward the owl, then back down one tile.
  await drag(page, ['A1', 'A2', 'A3', 'A4', 'A5', 'A4'], touch);
  expect(await pathLength(page)).toBe(3);
  // B2 is a stump: the path can't go there.
  await drag(page, ['A4', 'A3', 'A2', 'B2'], touch);
  expect(await pathLength(page)).toBe(1);
  await drag(page, ['A2', 'A3', 'A4', 'A5'], touch);
  await page.keyboard.press('Enter');
  await expect.poll(() => progress(page, 'goose-first').then((p) => p.attempts), { timeout: 10_000 }).toBe(1);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/${info.project.name}-5-fail.png` });
  const hearts = await page.evaluate(() => (window as any).__bloomline.session.heartCount());
  expect(hearts).toBe(4);
  // Back in planning with the old path still drawn.
  await page.waitForTimeout(2500);
  expect(await pathLength(page)).toBe(4);
  await page.screenshot({ path: `test-results/${info.project.name}-6-replan.png` });
});

test('the debug Solution button draws a path that clears the level', async ({ page }) => {
  await page.goto('/?level=point-of-order&reset=1&debug=1&beatMs=60');
  await waitForLevel(page);
  await page.keyboard.press('h');
  expect(await pathLength(page)).toBe(24);
  await page.keyboard.press('Enter');
  await expect.poll(() => progress(page, 'point-of-order').then((p) => p.clears), { timeout: 15_000 }).toBe(1);
});

/** Where each parade member stands, compared with where the line says it should be. */
async function paradeOffsets(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const s = (window as any).__bloomline.game.scene.getScene('level');
    const last = s.runTiles.length - 1;
    return s.parade.map((ci: number, k: number) => {
      const want = s.board.centre(s.runTiles[Math.max(0, last - 1 - k)]);
      const c = s.board.creatures[ci].container;
      return Math.round(Math.hypot(c.x - want.x, c.y - want.y));
    });
  });
}

test('every parade member ends up in line, including one cheered on the last step', async ({ page }) => {
  // Goose First ends with the bear cheered at the path end, so it joins after the final step.
  await page.goto('/?level=goose-first&reset=1&debug=1&beatMs=80');
  await waitForLevel(page);
  await page.keyboard.press('h');
  await page.keyboard.press('Enter');
  await expect.poll(() => progress(page, 'goose-first').then((p) => p.clears), { timeout: 15_000 }).toBe(1);
  await page.waitForTimeout(1500);
  const offsets = await paradeOffsets(page);
  expect(offsets).toHaveLength(3);
  for (const d of offsets) expect(d).toBeLessThanOrEqual(1);
});

test('the menu lists the levels', async ({ page }, info) => {
  await page.goto('/?reset=1&debug=1');
  await page.waitForFunction(() => (window as any).__bloomline?.game.scene.isActive('menu'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `test-results/${info.project.name}-0-menu.png` });
});
