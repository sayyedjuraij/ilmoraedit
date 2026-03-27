import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

const canvas = document.getElementById("bgCanvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 120;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.8,
  vertexColors: true
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// reusable objects (IMPORTANT for performance)
const target = new THREE.Vector3();
const color = new THREE.Color();

let time = 0;

// CONTROLS (simple defaults)
const radius = 60;
const depth = 220;
const swirl = 5;

function updateParticle(i) {
  const fi = i / count;

  const angle = fi * 6.28318 * swirl + time;

  let z = fi * depth - depth * 0.5;
  z += (time * 120.0) % depth;
  if (z > depth * 0.5) z -= depth;

  const distNorm = Math.abs(z) / (depth * 0.5);
  const r = radius * (1.0 - distNorm);

  let tx = Math.cos(angle) * r;
  let ty = Math.sin(angle) * r;

  // logo formation (auto)
  const focus = Math.min(time * 0.2, 1);

  const a2 = fi * 6.28318 * 3.0;
  const logoR = 25 + 5 * Math.sin(a2 * 3.0);

  const lx = Math.cos(a2) * logoR;
  const ly = Math.sin(a2) * logoR;

  const blend = focus * focus;

  tx = tx * (1.0 - blend) + lx * blend;
  ty = ty * (1.0 - blend) + ly * blend;
  z = z * (1.0 - blend);

  target.set(tx, ty, z);

  const hue = (0.6 + fi * 0.3 - blend * 0.2) % 1;
  color.setHSL(hue, 1.0, 0.5);

  return { target, color };
}

function animate() {
  requestAnimationFrame(animate);

  time += 0.01;

  const pos = geometry.attributes.position.array;
  const col = geometry.attributes.color.array;

  for (let i = 0; i < count; i++) {
    const p = updateParticle(i);

    pos[i*3] = p.target.x;
    pos[i*3+1] = p.target.y;
    pos[i*3+2] = p.target.z;

    col[i*3] = p.color.r;
    col[i*3+1] = p.color.g;
    col[i*3+2] = p.color.b;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
