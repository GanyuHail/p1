(function () {
    'use strict';
    var scene, camera, renderer;
    var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane,
        geometry, particleCount, sphereMesh,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;

    init();
    animate();

    function init() {

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 100;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 0;
        farPlane = 3000;

        cameraZ = farPlane / 2;
        fogHex = 0x000000;
        fogDensity = 0.0007;
        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
        ambientLight.castShadow = true;
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xF7A8B8, 2.4);
        spotLight.castShadow = true;
        spotLight.position.set(100, 64, 32);
        scene.add(spotLight);

        const x = 0, y = 0;
        const heartShape = new THREE.Shape();

        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const heartGeometry = new THREE.ShapeGeometry(heartShape);
        const heartTex = new THREE.TextureLoader().load('https://raw.githubusercontent.com/GanyuHail/port3c/main/src/mars.jpg');
        const heartMaterial = new THREE.MeshStandardMaterial({ map: heartTex });
        const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
        scene.add(heartMesh);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        geometry = new THREE.Geometry();
        particleCount = 10000;

        for (i = 0; i < particleCount; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;
            geometry.vertices.push(vertex);
        }

        parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
        ];
        parameterCount = parameters.length;
        for (i = 0; i < parameterCount; i++) {

            size = parameters[i][1];

            materials[i] = new THREE.PointsMaterial({
                transparent: true,
            });

            particles = new THREE.Points(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            scene.add(particles);
        }

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var time = Date.now() * 0.00005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.position.z += (mouseY - camera.position.z) * 0.001;
        camera.lookAt(scene.position);

        for (i = 0; i < scene.children.length; i++) {
            var object = scene.children[i];
            if (object instanceof THREE.Points) {
                object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
            }
        }

        for (i = 0; i < materials.length; i++) {
            color = parameters[i][0];
            h = (360 * (color[0] + time) % 360) / 360;
            materials[i].color.setHSL(h, 0xF7A8B8, 0xF7A8B8);
        }

        renderer.render(scene, camera);
    }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    function onDocumentTouchStart(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
})();