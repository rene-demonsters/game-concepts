// Optional headless-browser smoke test. Needs a playwright-core install somewhere; this
// prototype deliberately has no dependencies, so point at one you already have:
//   PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core node test/browser-smoke.mjs
// It starts serve.mjs, loads the page, drives the real keyboard through the intro, checks
// pause-on-blur / journal / dialogue UI, loads index.html from file://, and saves screenshots.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const proto = path.resolve(here, '..');
const require = createRequire(import.meta.url);
const pwPath = process.env.PLAYWRIGHT_CORE;
if (!pwPath) { console.log('SKIP: set PLAYWRIGHT_CORE to a playwright-core directory'); process.exit(0); }
const { chromium } = require(pwPath);
const shots = process.env.SHOTS || path.join(proto, '.smoke');
fs.mkdirSync(shots, { recursive: true });

const fails = [];
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) fails.push(msg); };

const server = spawn(process.execPath, [path.join(proto, 'serve.mjs'), '8190'], { stdio: ['ignore', 'pipe', 'inherit'] });
const url = await new Promise((res) => server.stdout.on('data', (d) => { const m = String(d).match(/http:\/\/\S+/); if (m) res(m[0]); }));
console.log('server', url);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [], bad = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  await page.goto(url + '?reset');
  await page.waitForTimeout(800);
  check(await page.isVisible('#title'), 'title screen visible');
  await page.screenshot({ path: path.join(shots, '01-title.png') });

  const state = () => page.evaluate(() => { const g = window.__myah.game; return g && { stage: g.p.stage, scene: g.scene, x: g.player.x, y: g.player.y, dlg: !!g.dialogue, mode: window.__myah.mode(), focus: g.focus && g.focus.id, goal: window.MYAH.goalInfo(g) }; });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  let s = await state();
  check(s && s.mode === 'play' && s.stage === 'intro', 'Enter starts a new game at home');
  check(await page.isVisible('#goal'), 'goal HUD visible');
  check((await page.textContent('#goal .goal-main')).includes('Mara'), 'goal tells you to talk to Mara');
  await page.screenshot({ path: path.join(shots, '02-home.png') });

  // walk with real key presses toward the goal target until something is focused
  async function walkToFocus(id, maxMs) {
    const t0 = Date.now();
    const held = new Set();
    while (Date.now() - t0 < maxMs) {
      s = await state();
      if (s.focus === id) break;
      const t = s.goal.target; if (!t) break;
      const want = new Set();
      if (t.x - s.x > 6) want.add('d'); if (s.x - t.x > 6) want.add('a');
      if (t.y - s.y > 6) want.add('s'); if (s.y - t.y > 6) want.add('w');
      for (const k of held) if (!want.has(k)) { await page.keyboard.up(k); held.delete(k); }
      for (const k of want) if (!held.has(k)) { await page.keyboard.down(k); held.add(k); }
      await page.waitForTimeout(40);
    }
    for (const k of held) await page.keyboard.up(k);
    return (await state()).focus === id;
  }
  check(await walkToFocus('mara', 8000), 'walked to Mara with WASD');
  await page.keyboard.press('e');
  await page.waitForTimeout(100);
  check(await page.isVisible('#dialogue'), 'dialogue box opens on E');
  const before = await state();
  await page.keyboard.down('d'); await page.waitForTimeout(300); await page.keyboard.up('d');
  const after = await state();
  check(before.x === after.x, 'movement is frozen while reading dialogue');
  await page.screenshot({ path: path.join(shots, '03-dialogue.png') });
  for (let i = 0; i < 4; i++) { await page.keyboard.press('Space'); await page.waitForTimeout(60); }
  check(!(await page.isVisible('#dialogue')), 'dialogue advances and closes');

  // journal & pause
  await page.keyboard.press('Tab'); await page.waitForTimeout(100);
  check(await page.isVisible('#journal') && (await page.textContent('#journal')).includes('Mara'), 'Tab opens the journal with Mara\'s claim');
  await page.keyboard.press('Tab'); await page.waitForTimeout(100);
  await page.keyboard.down('d');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.waitForTimeout(150);
  s = await state();
  check(s.mode === 'pause' && await page.isVisible('#pause'), 'window blur pauses the game');
  const px = s.x; await page.waitForTimeout(300); s = await state();
  check(s.x === px, 'no movement while paused (no stuck key)');
  await page.keyboard.up('d');
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  s = await state();
  check(s.mode === 'play', 'Esc resumes');
  const rx = s.x; await page.waitForTimeout(250); s = await state();
  check(Math.abs(s.x - rx) < 1, 'key held across blur does not keep walking after resume');

  check(await walkToFocus('door', 8000), 'walked to the front door');
  await page.keyboard.press('e'); await page.waitForTimeout(300);
  s = await state();
  check(s.stage === 'explore' && s.scene === 'location', 'front door goes to Jellybean Junction');
  await page.screenshot({ path: path.join(shots, '04-lobby.png') });

  // Jump to set pieces through the real game API to screenshot them.
  await page.evaluate(() => { const g = window.__myah.game; g.player.x = 1140; g.player.y = 470; });
  await page.waitForTimeout(100);
  await page.keyboard.press('e'); await page.waitForTimeout(1200);
  s = await state();
  await page.screenshot({ path: path.join(shots, '05-test-song.png') });
  await page.waitForTimeout(6000);
  await page.keyboard.down('e'); await page.waitForTimeout(1300); await page.keyboard.up('e');
  s = await state();
  check(s.stage === 'encounter', 'holding E at the sound desk starts the defence');
  await page.waitForTimeout(2500);
  await page.keyboard.press('j'); await page.waitForTimeout(60); await page.keyboard.press('k');
  await page.screenshot({ path: path.join(shots, '06-defence.png') });
  await page.evaluate(() => { const g = window.__myah.game; g.player.hp = 100; g.enc.t = 15.9; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(shots, '07-shift.png') });
  await page.evaluate(() => { const g = window.__myah.game; g.player.hp = 0; g.down = { t: 0, reason: 'hp' }; });
  await page.waitForTimeout(900);
  check(await page.isVisible('#down'), 'knock-down overlay shows');
  await page.keyboard.press('e'); await page.waitForTimeout(200);
  s = await state();
  check(s.stage === 'encounter' && !(await page.isVisible('#down')), 'E retries the fight');
  const saved = await page.evaluate(() => localStorage.getItem('myah-prototype-save-v1'));
  check(saved && JSON.parse(saved).commit === 'preserve', 'progress saved to localStorage');
  // Fast-forward through the rest of the loop via the game API, screenshotting each beat.
  const api = (fn) => page.evaluate(fn);
  await api(() => { const M = window.MYAH, g = window.__myah.game; M._.winPreserve(g); g.player.x = 930; g.player.y = 345; });
  await page.waitForTimeout(150); await page.keyboard.press('e'); await page.waitForTimeout(200);
  s = await state(); check(s.stage === 'aftermath' && (await api(() => window.__myah.game.p.recording)) === 'held', 'E at the pedestal after the song takes the recording');
  await page.screenshot({ path: path.join(shots, '08-aftermath.png') });
  await api(() => { const g = window.__myah.game; window.MYAH._.goHome(g); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(shots, '09-home-after.png') });
  await api(() => { const g = window.__myah.game; window.MYAH._.goLocation(g); g.player.x = 1000; g.player.y = 330; });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(shots, '10-revisit.png') });
  await api(() => { const g = window.__myah.game; window.MYAH._.goHome(g); g.player.x = 280; g.player.y = 430; });
  await page.waitForTimeout(150); await page.keyboard.press('e'); await page.waitForTimeout(300);
  check(await page.isVisible('#end'), 'dinner table ends the prototype with a summary');
  await page.screenshot({ path: path.join(shots, '11-end.png') });
  await page.click('#btn-other'); await page.waitForTimeout(300);
  s = await state(); check(s.stage === 'explore' && s.mode === 'play', '"Try the other approach" returns to the play centre');
  await api(() => { const g = window.__myah.game; g.player.x = 930; g.player.y = 345; window.MYAH._.commitDestroy(g); });
  await page.waitForTimeout(1800);
  await api(() => { const g = window.__myah.game; g.player.x = 600; g.player.y = 300; g.enc.t = 7.9; });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(shots, '12-destroy-chase.png') });
  await api(() => { const g = window.__myah.game; g.player.hp = 100; g.player.x = 160; g.player.y = 720; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(shots, '13-disposal.png') });
  check(errors.length === 0, `no page errors (${errors.join(' | ')})`);
  check(bad.length === 0, `no failed requests (${bad.join(' | ')})`);

  // file:// works too (classic scripts, no modules)
  const fpage = await browser.newPage();
  const ferr = [];
  fpage.on('pageerror', (e) => ferr.push(String(e)));
  await fpage.goto(pathToFileURL(path.join(proto, 'index.html')).href);
  await fpage.waitForTimeout(500);
  await fpage.keyboard.press('Enter'); await fpage.waitForTimeout(300);
  const fs2 = await fpage.evaluate(() => window.__myah && window.__myah.mode());
  check(ferr.length === 0 && fs2 === 'play', `index.html opened from disk runs (${ferr.join(' | ')})`);
} finally {
  await browser.close();
  server.kill();
}
console.log(fails.length ? `\n${fails.length} FAILED` : '\nall browser checks passed');
console.log('screenshots in', shots);
process.exit(fails.length ? 1 : 0);
