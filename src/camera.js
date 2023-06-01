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
  camera.position.set(0, 20, 2);
  camera.lookAt(0, 0, 2);
  camera.rotateZ(Math.PI);

  // const controls = new MapControls(camera, gameWindow);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.01;

  let interfaceHover = null;

  const yAxis = new THREE.Vector3(0, 0, 1);

  function cameraUpdate(player) {
    if (player) {
      // const worldQuaternion = new THREE.Quaternion();
      // player.getWorldQuaternion(worldQuaternion);
      // console.log(player, worldQuaternion);
      // const { position, quaternion } = player;
      // camera.rotation.z = worldQuaternion.y + Math.PI;
      // camera.position.set(position.x, camera.position.y, position.z);
      // camera.applyQuaternion(quaternion);
    }
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
