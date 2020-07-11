import * as THREE from 'https://unpkg.com/three/build/three.module.js';

window.addEventListener('load', () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.append(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x0080ff, wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  cube.rotation.x = 0.1;
  cube.rotation.y = 0.2;
  scene.add(cube);

  const world = new CANNON.World();
  world.gravity.set(0, 0, -9.82 /* m/s² */);

  const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  const body = new CANNON.Body({ mass: 1 });
  body.addShape(shape);
  body.angularVelocity.set(0, 10, 0);
  body.angularDamping = 0.5;
  world.addBody(body);

  const groundBody = new CANNON.Body({ mass: 0 });
  const groundShape = new CANNON.Plane();
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
