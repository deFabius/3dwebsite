import * as THREE from "three";
import { createCamera } from "./camera.js";

export function createScene() {
  const gameWindow = document.getElementById("render-target");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const camera = createCamera(gameWindow);
  scene.add(camera.cameraHelper);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function draw() {
    camera.cameraUpdate();
    renderer.render(scene, camera.camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown() {}

  function onMouseUp() {}

  function onMouseMove(e) {
    camera.onMouseMove(e);
  }

  return {
    start,
    stop,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
