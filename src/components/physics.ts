import * as THREE from "three";
import * as CANNON from "cannon-es";

import { Component } from "./component";
import { Base } from "../base/base";

class Physics extends Component {
  world: CANNON.World;
  meshPhysicsObjects: MeshPhysicsObject[];
  constructor(base: Base) {
    super(base);

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    this.world = world;

    this.meshPhysicsObjects = [];
  }
  // 添加物体
  add({
    mesh,
    body,
    copyPosition = true,
    copyQuaternion = true,
  }: MeshPhysicsObjectParams) {
    const obj = new MeshPhysicsObject(mesh, body, copyPosition, copyQuaternion);
    this.base.physics.world.addBody(body);
    this.meshPhysicsObjects.push(obj);
  }
  // 帧
  tick() {
    const world = this.world;
    const deltaTime = this.base.clock.deltaTime;
    world.step(1 / 60, deltaTime, 3);
  }
  // 同步物理和渲染
  sync() {
    this.meshPhysicsObjects.forEach((obj) => {
      const { mesh, body, copyPosition, copyQuaternion } = obj;
      if (copyPosition) {
        mesh.position.copy(body.position as any);
      }
      if (copyQuaternion) {
        mesh.quaternion.copy(body.quaternion as any);
      }
    });
  }
  update(time: number): void {
    this.sync();
    this.tick();
  }
}

class MeshPhysicsObject {
  mesh: THREE.Mesh | THREE.Object3D;
  body: CANNON.Body;
  copyPosition: boolean;
  copyQuaternion: boolean;
  constructor(
    mesh: THREE.Mesh | THREE.Object3D,
    body: CANNON.Body,
    copyPosition = true,
    copyQuaternion = true
  ) {
    this.mesh = mesh;
    this.body = body;
    this.copyPosition = copyPosition;
    this.copyQuaternion = copyQuaternion;
  }
}

export interface MeshPhysicsObjectParams {
  mesh: THREE.Mesh | THREE.Object3D;
  body: CANNON.Body;
  copyPosition?: boolean;
  copyQuaternion?: boolean;
}

export { Physics, MeshPhysicsObject };
