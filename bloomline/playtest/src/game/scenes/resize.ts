import Phaser from 'phaser';

/** Rebuild the scene on resize or rotation. Scenes keep their state in restart data. */
export function relayoutOnResize(scene: Phaser.Scene, data?: () => object | null): void {
  let pending: ReturnType<typeof setTimeout> | null = null;
  const onResize = () => {
    if (pending) clearTimeout(pending);
    pending = setTimeout(() => {
      const d = data ? data() : {};
      if (d === null) return; // the scene asked to wait (e.g. mid-run)
      scene.scene.restart(d);
    }, 120);
  };
  scene.scale.on(Phaser.Scale.Events.RESIZE, onResize);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.scale.off(Phaser.Scale.Events.RESIZE, onResize);
    if (pending) clearTimeout(pending);
  });
}
