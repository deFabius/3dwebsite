import * as THREE from "three";
import { createCamera } from "./camera.js";
import { createAssetInstance } from "./assets.js";

export function createScene() {
  const gameWindow = document.getElementById("render-target");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const camera = createCamera(gameWindow);
  // scene.add(camera.cameraHelper);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let interactiveComponents = [];
  let INTERSECTED;

  const meshes = [];
  let player,
    dest = null;
  let playerPathCurve = undefined;
  let path = [];
  let bezier = [];

  async function initialize(city, assets) {
    scene.clear();

    for (let x = 0; x < city.size; x++) {
      const column = [];
      for (let y = 0; y < city.size; y++) {
        const position = new THREE.Vector3(
          -city.size / 2 + x + 0.5,
          -0.5,
          -city.size / 2 + y + 0.5
        );
        const mesh = await createAssetInstance("grass", position);
        scene.add(mesh);
        column.push(mesh);
      }
      meshes.push(column);
    }

    assets.data.map(async ([assetId, position]) => {
      const mesh = await createAssetInstance(assetId, position);
      scene.add(mesh);
      meshes.push(mesh);
      if (mesh.userData?.id == "car") {
        player = mesh;
      }
    });

    setupLights();

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      [
        new THREE.DirectionalLight(0xffffff, 0.3),
        new THREE.Vector3(10, 20, 10),
      ],
    ];
    const lightsSetup = lights.reduce((allLights, l) => {
      if (Array.isArray(l)) {
        const [lightObject, lightPosition] = l;
        lightObject.position.copy(lightPosition);
        allLights.push(lightObject);
        // allLights.push(new THREE.DirectionalLightHelper(lightObject, 5));
      } else allLights.push(l);
      return allLights;
    }, []);
    scene.add(...lightsSetup);
  }

  const MOUSE_CLICK_SENSITIVITY = 200;

  function interact({ clientX, clientY }) {
    if (Date.now() - lastInteractionTime > MOUSE_CLICK_SENSITIVITY) return;
    pointer.x = (clientX / gameWindow.offsetWidth) * 2 - 1;
    pointer.y = -(clientY / gameWindow.offsetHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera.camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0]) {
        INTERSECTED?.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0xff0000);
      }
    } else {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }

    if (INTERSECTED?.userData.id === "grass") {
      dest = INTERSECTED.position.clone();
      dest.y = player.position.y;

      if (bezier.length === 0) {
        const v0 = player.position.clone();
        const v2 = dest;
        const v1 = new THREE.Vector3().lerpVectors(v0, v2, 0.5);
        bezier.push([v0, v1, v2]);
      } else {
        const [old0, old1, old2] = bezier[bezier.length - 1];
        const v0 = old2;
        const v2 = dest;
        const v1 = old2.clone();
        v1.sub(old1).add(old2);
        console.log(v0, v1, v2);
        bezier.push([v0, v1, v2]);
      }

      const [v0, v1, v2] = bezier[bezier.length - 1];
      const curve = new THREE.QuadraticBezierCurve3(v0, v1, v2);
      for (let p = 0; p < framesSec; p++) {
        const u = p / (framesSec - 1);
        path.push([curve.getPoint(u), curve.getTangent(u)]);
      }
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      playerPathCurve = new THREE.Line(geometry, material);
      scene.add(playerPathCurve);

      drawPoint(v0);
      drawPoint(v1, true);
      drawPoint(v2);
    } else {
      dest = undefined;
    }
  }

  function drawPoint(position, isControl = false) {
    const geometry = new THREE.CircleGeometry(0.2, 16);
    const material = new THREE.MeshBasicMaterial({
      color: isControl ? 0x00ff00 : 0xff0000,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.rotateX(-Math.PI / 2);
    scene.add(mesh);
  }

  let lastTime = new Date().getTime();
  let frame = 0;
  const framesSec = 100;

  function draw() {
    const now = new Date().getTime();
    const delta = now - lastTime;
    if (delta > 1000 / framesSec) {
      frame = (frame + 1) % framesSec;
      lastTime = now;
      if (path.length > 0) {
        const [position, tangent] = path.shift();
        player.position.copy(position);
        player.lookAt(tangent.add(position));
      }
    }
    camera.cameraUpdate();
    renderer.render(scene, camera.camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  let lastInteractionTime;

  function onMouseDown() {
    lastInteractionTime = Date.now();
  }

  function onMouseUp(e) {
    console.log(lastInteractionTime - Date.now());
    interact(e);
  }

  function onMouseMove(e) {
    camera.onMouseMove(e);
    // pointer.x = (e.clientX / gameWindow.offsetWidth) * 2 - 1;
    // pointer.y = -(e.clientY / gameWindow.offsetHeight) * 2 + 1;

    // raycaster.setFromCamera(pointer, camera.camera);

    // const intersects = raycaster.intersectObjects(meshes.flat(), true);
    // if (intersects.length > 0) {
    //   console.log(intersects);
    // }
  }

  function onTouchStart(e) {
    lastInteractionTime = Date.now();
  }

  function onTouchEnd(e) {
    console.log(lastInteractionTime - Date.now());
    interact(e.changedTouches[0]);
  }

  return {
    initialize,
    start,
    stop,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchEnd,
  };
}
