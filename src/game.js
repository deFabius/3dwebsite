import { createScene } from "./scene.js";
import { createMap } from "./map.js";
import { createAssets } from "./assets.js";

const MAP_SIZE = 40;

export function createGame() {
  const scene = createScene();
  const map = createMap(MAP_SIZE);
  const assets = createAssets();
  scene.initialize(map, assets);
  window.scene = scene;
  window.addEventListener("mousemove", scene.onMouseMove, false);
  window.addEventListener("mousedown", scene.onMouseDown, false);
  window.addEventListener("mouseup", scene.onMouseUp, false);
  window.addEventListener("touchstart", scene.onTouchStart, false);
  window.addEventListener("touchend", scene.onTouchEnd, false);

  scene.start();
}
