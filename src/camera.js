import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";

export function createCamera(gameWindow) {
  let aspect = gameWindow.offsetWidth / gameWindow.offsetHeight;
  const frustumSize = 50;
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  // const camera = new THREE.OrthographicCamera(
  //   (frustumSize * aspect) / -2,
  //   (frustumSize * aspect) / 2,
  //   frustumSize / 2,
  //   frustumSize / -2,
  //   1,
  //   1000
  // );
  camera.position.set(-10, 10, 10);
  camera.lookAt(0, 0, 0);

  const controls = new MapControls(camera, gameWindow);
  controls.enableDamping = true;
  // controls.dampingFactor = 0.01;

  let interfaceHover = null;

  function cameraUpdate() {
    controls.update();
  }

  function onMouseMove(e) {
    interfaceHover = e.target.id;
  }
  return {
    camera,
    cameraHelper: new THREE.CameraHelper(camera),
    cameraUpdate,
    onMouseMove,
  };
}
