// Создаем сцену, камеру и рендерер
const canvas = document.querySelector(".screen");
const renderer = new THREE.WebGLRenderer({ canvas });
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

const fov = 120;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
camera.position.y = 10;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x777777);

const controls = new THREE.OrbitControls(camera, canvas);
controls.target.set(0, 10, 0);
controls.update();

// Создаем пол
const geometryPlane = new THREE.PlaneGeometry(100, 100);
const loaderTexture = new THREE.TextureLoader();
const textureFloor = loaderTexture.load("https://i.imgur.com/Sqb3guH.png");
textureFloor.wrapS = THREE.RepeatWrapping;
textureFloor.wrapT = THREE.RepeatWrapping;
textureFloor.repeat.set(30, 30);

geometryPlane.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
const materialPlane = new THREE.MeshBasicMaterial({
  map: textureFloor,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.position.y = 0;
scene.add(plane);

// Создаем подвес (линия)
const lineGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0, 15, 0, // Начало линии
  0, 0, 0  // Конец линии
]);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const lineMaterial = new THREE.LineBasicMaterial({
  color:
    0x000000
});
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);


// Создаем груз (сфера)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);
const bob = sphere; // Сохраняем ссылку на груз для удобства

// Параметры маятника
const gravity = 9.81;
const length = 10;
let angle = Math.PI / 4; // Начальный угол отклонения
let velocity = 0;
let acceleration = 0;

// Фиксированное время между кадрами (в секундах)
const targetFPS = 60;
const deltaTime = 1 / targetFPS;
function animate() {
  requestAnimationFrame(animate);

  // Расчеты
  acceleration = -gravity / length * Math.sin(angle);
  velocity += acceleration * deltaTime;
  angle += velocity * deltaTime

  // Обновление положения груза
  const x = length * Math.sin(angle);
  const y = 15-length * Math.cos(angle);
  bob.position.set(x, y, 0);

  // Обновляем положение линии подвеса
  lineGeometry.attributes.position.array[3] = x; // Обновляем X-координату конца линии
  lineGeometry.attributes.position.array[4] = y; // Обновляем Y-координату конца линии
  lineGeometry.attributes.position.needsUpdate = true; // Важно обновить атрибут

  renderer.render(scene, camera);
}

animate();