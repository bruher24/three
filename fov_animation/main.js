
function main() {
	const canvas = document.querySelector(".screen");
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	document.body.appendChild(renderer.domElement);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowmapping;

	const fov = 120;
	const aspect = 2;
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 5;
	camera.position.y = 2;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x777777);

	//изменение fov
	window.addEventListener("resize", () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	window.addEventListener("wheel", (event) => {
		const delta = event.deltaY * 0.05;
		const newFov = camera.fov - delta;
		camera.fov = THREE.MathUtils.clamp(newFov, 60, 120);
		camera.updateProjectionMatrix();
	});

	//свет по заданию
	const lightPoint = new THREE.PointLight(0xffffff, 0.5, 100);
	scene.add(lightPoint);

	//источник света для отбрасывания теней
	const lightShadow = new THREE.PointLight(0xffffff, 0.5, 100);
	lightShadow.position.set(0, 5, 15);
	lightShadow.castShadow = true;
	scene.add(lightShadow);

	lightShadow.shadow.mapSize.width = 7680;
	lightShadow.shadow.mapSize.height = 4320;
	lightShadow.shadow.camera.near = 2;
	lightShadow.shadow.camera.far = 1500;

	// const controls = new THREE.OrbitControls(camera, canvas);
	// controls.target.set(0, 0, -1);
	// controls.update();

	//задняя стена
	const geometryBackground = new THREE.PlaneGeometry(
		window.innerWidth,
		window.innerHeight
	);

	const materialBackground = new THREE.MeshPhongMaterial({
		color: 0x2f4f4f,
		side: THREE.DoubleSide,
	});

	const background = new THREE.Mesh(geometryBackground, materialBackground);
	background.receiveShadow = true;
	background.position.z = -5;
	scene.add(background);

	//пол
	const geometryPlane = new THREE.PlaneGeometry(100, 100);
	geometryPlane.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
	const materialPlane = new THREE.MeshPhongMaterial({
		сolor: 0x708090,
		side: THREE.DoubleSide,
	});
	const plane = new THREE.Mesh(geometryPlane, materialPlane);
	plane.receiveShadow = true;
	plane.position.y = 0;
	scene.add(plane);

	//тетраэдр
	const radius = 1 * 3 / Math.sqrt(6);
	const detail = 0;
	const materialTetrahedron = new THREE.MeshPhongMaterial({
		color: 0x0322ff,
		opacity: 0.5,
		transparent: true,
	});

	const geometryTetrahedron = new THREE.TetrahedronGeometry(
		radius,
		detail
	);

	const figureTetrahedron = new THREE.Mesh(geometryTetrahedron, materialTetrahedron);
	figureTetrahedron.rotation.x = 0.956;
	figureTetrahedron.rotation.y = -0.8;
	figureTetrahedron.rotation.z = 0;
	figureTetrahedron.position.z = 1;
	figureTetrahedron.position.x = 2;
	figureTetrahedron.position.y = 0.76;
	figureTetrahedron.castShadow = true;
	figureTetrahedron.receiveShadow = false;
	startAngleTetrahedron = 2;
	scene.add(figureTetrahedron);

	//тор
	const materialTorus = new THREE.MeshPhongMaterial({ color: 0xff033e });

	const radiusTorus = 0.75;
	const tubeRadiusTorus = 0.15;
	const radialSegmentsTorus = 8;
	const tubularSegmentsTorus = 24;
	const geometryTorus = new THREE.TorusGeometry(
		radiusTorus,
		tubeRadiusTorus,
		radialSegmentsTorus,
		tubularSegmentsTorus
	);

	const figureTorus = new THREE.Mesh(geometryTorus, materialTorus);
	figureTorus.position.x = 0;
	figureTorus.position.y = 0.9;
	figureTorus.position.z = 1;
	figureTorus.castShadow = true;
	figureTorus.receiveShadow = false;
	scene.add(figureTorus);

	//тор второй
	const radiusTorus1 = 0.75;
	const tubeRadiusTorus1 = 0.15;
	const radialSegmentsTorus1 = 15;
	const tubularSegmentsTorus1 = 44;
	const geometryTorus1 = new THREE.TorusGeometry(
		radiusTorus1,
		tubeRadiusTorus1,
		radialSegmentsTorus1,
		tubularSegmentsTorus1
	);

	const materialTorus1 = new THREE.MeshStandardMaterial({
		color: 0x2e8b57,
		side: THREE.DoubleSide,
		roughness: 0.5
	});

	const figureTorus1 = new THREE.Mesh(geometryTorus1, materialTorus1);

	figureTorus1.position.x = -2;
	figureTorus1.position.y = 0.9;
	figureTorus1.position.z = 1;
	figureTorus1.castShadow = true;
	figureTorus1.receiveShadow = false;
	startAngleTorus1 = -2;
	scene.add(figureTorus1);

	function updateColor() {
		const colorInput = document.getElementById("colorInput").value;
		materialTorus.color.set(colorInput);
		render();
	}

	document
		.getElementById("colorInput")
		.addEventListener("input", updateColor);

	var roughnessRange = document.getElementById("roughnessChange");
	roughnessRange.addEventListener("input", function () {
		var roughnessValue = parseInt(this.value);
		materialTorus1.roughness = roughnessValue;
	});

	//движение света за мышкой
	document.addEventListener("mousemove", onMouseMove, false);

	function onMouseMove(event) {
		event.preventDefault();
		const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
		const mouseY = -(event.clientY / window.innerHeight) * 2 - 1;

		var vector = new THREE.Vector3(mouseX, mouseY, 5);
		vector.unproject(camera);
		var dir = vector.sub(camera.position).normalize();
		var distance = -camera.position.z / dir.z;
		var pos = camera.position.clone().add(dir.multiplyScalar(distance));

		lightPoint.position.copy(
			new THREE.Vector3(pos.x, pos.y, pos.z + 15)
		);
	}

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const pixelRatio = window.devicePixelRatio;
		const width = (canvas.clientWidth * pixelRatio) | 0;
		const height = (canvas.clientHeight * pixelRatio) | 0;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	var axesHelper = new THREE.AxesHelper(5);
	scene.add(axesHelper);
	axesHelper.visible = false;

	function render(time) {
		time *= 0.00033;
		const rotationSpeed = 0.02;

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);

		rotationRadius = 3;
		const centerX = 0;
		const centerY = 0.9;

		time += rotationSpeed;

		figureTorus.position.x = centerX;
		figureTorus.position.y = centerY;

		figureTetrahedron.position.x = rotationRadius * Math.sin(time + startAngleTetrahedron + (2 * Math.PI) / 4);
		figureTetrahedron.position.z = rotationRadius * Math.cos(time + startAngleTetrahedron + (2 * Math.PI) / 4);
		const angleTetrahedron = Math.atan2(figureTorus.position.x - figureTetrahedron.position.x, figureTorus.position.z - figureTetrahedron.position.z);
		figureTetrahedron.rotation.y = angleTetrahedron;
		figureTetrahedron.rotation.x = 0;
	  
		figureTorus1.position.x = rotationRadius * Math.sin(time + startAngleTorus1 + (4 * Math.PI) / 4);
		figureTorus1.position.z = rotationRadius * Math.cos(time + startAngleTorus1 + (4 * Math.PI) / 4);
		const angleTorus1 = Math.atan2(figureTorus.position.x - figureTorus1.position.x, figureTorus.position.z - figureTorus1.position.z);
		figureTorus1.rotation.y = angleTorus1 + Math.PI / 2;

	}
	requestAnimationFrame(render);
}

main();
