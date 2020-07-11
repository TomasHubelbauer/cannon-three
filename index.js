import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'https://unpkg.com/three/build/three.module.js';
import { World, Box, Vec3, Body, Plane } from 'https://unpkg.com/cannon-es/dist/cannon-es.js';

window.addEventListener('load', () => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.append(renderer.domElement);

  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial({ color: 0x0080ff, wireframe: true });
  const cube = new Mesh(geometry, material);
  cube.rotation.x = 0.1;
  cube.rotation.y = 0.2;
  scene.add(cube);

  const world = new World();
  world.gravity.set(0, 0, -9.82 /* m/s² */);

  const shape = new Box(new Vec3(1, 1, 1));
  const body = new Body({ mass: 1 });
  body.addShape(shape);
  body.angularVelocity.set(0, 10, 0);
  body.angularDamping = 0.5;
  world.addBody(body);

  const groundBody = new Body({ mass: 0 });
  const groundShape = new Plane();
  groundBody.addShape(groundShape);
  world.addBody(groundBody);

  void function loop() {
    requestAnimationFrame(loop);
    world.step(1 / 60);
    cube.position.copy(body.position);
    cube.quaternion.copy(body.quaternion);
    renderer.render(scene, camera);
  }()
});
