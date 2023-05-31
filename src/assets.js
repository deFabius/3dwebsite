import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const textureLoader = new THREE.TextureLoader();
let loader;

function getLoader() {
  if (loader) return loader;
  return new GLTFLoader();
}

const textures = {
  grass: {
    data: textureLoader.load("./public/assets/textures/grass.jpg"),
  },
};

const baseBox = new THREE.BoxGeometry(1, 1, 1);
const assets = {
  grass: (position, resolve) => {
    const material = new THREE.MeshLambertMaterial({
      color: 0xffdddd,
      map: textures.grass.data,
    });
    const mesh = new THREE.Mesh(baseBox, material);
    mesh.userData = { id: "grass", x: position.x, y: position.z };
    mesh.position.copy(position);
    resolve(mesh);
  },
  sphere: (position, resolve) => {
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { id: "sphere" };
    mesh.position.copy(position);
    resolve(mesh);
  },
  tree: (position, resolve) => {
    const tree = new THREE.Group();
    const leafGeometry = new THREE.CylinderGeometry(0.4, 1, 0.6, 16);
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.copy(position);
    leaf.position.y += 0.6;
    tree.add(leaf);
    const leaf2 = leaf.clone();
    leaf2.scale.set(0.8, 1, 0.7);
    leaf2.position.y += 0.6;
    tree.add(leaf2);
    const leaf3 = leaf2.clone();
    leaf3.scale.set(0.4, 1, 0.5);
    leaf3.position.y += 0.6;
    tree.add(leaf3);
    const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x43270f });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.copy(position);
    tree.add(stem);
    resolve(tree);
  },
  car: (position, resolve) => {
    getLoader().load("./public/assets/pony_cartoon.glb", function (glb) {
      glb.scene.position.copy(position);
      glb.scene.userData = { id: "car" };
      resolve(glb.scene);
    });
  },
  oldRustyCar: (position, resolve) => {
    getLoader().load("./public/assets/old_rusty_car.glb", function (glb) {
      glb.scene.position.copy(position);
      glb.scene.scale.set(0.005, 0.005, 0.005);
      resolve(glb.scene);
    });
  },
  houses: (position, resolve) => {
    getLoader().load("./public/assets/design_house_asset.glb", function (glb) {
      console.log(glb.scene);
      const components = glb.scene.children[0].children[0].children.map(
        (item, index) => {
          console.log(item);
          item.userData = { index };
          return item;
        }
      );
      const house = new THREE.Group();
      //   house.add(...glb.scene.children[0].children[0].children.slice(0, 24));
      //   house.add(...glb.scene.children[0].children[0].children.slice(53, 78));
      //   house.add(...glb.scene.children[0].children[0].children.slice(78, 94));
      components.find((item, index) => {
        if (item.uuid == "ced383fa-6566-4b04-92f2-6eb79eb3bb7c") {
          console.log(`Item index is ${index}`);
          return true;
        }
        return false;
      });
      house.add(...components.slice(94, 108));
      house.position.copy(position);
      house.scale.set(0.03, 0.03, 0.03);
      resolve(house);
    });
  },
};

export async function createAssetInstance(assetId, position) {
  return new Promise((resolve) => {
    assets[assetId](position, resolve);
  });
}

export function createAssets() {
  const data = [
    // ["tree", new THREE.Vector3(1, 0.5, 4)],
    // ["sphere", new THREE.Vector3(5, 1, -5)],
    ["car", new THREE.Vector3(0, 0.01, 0)],
    // ["oldRustyCar", new THREE.Vector3(10, 1, -10)],
    // ["houses", new THREE.Vector3(0, 0.01, 0)],
  ];

  return { data };
}
