let scene, camera, renderer, cubes = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Sky
    let vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;
    let fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize( vWorldPosition + offset ).y;
            gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
        }
    `;
    let uniforms = {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    };
    let skyGeo = new THREE.SphereGeometry(500, 32, 15);
    let skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });
    let sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Ground
    let groundGeometry = new THREE.PlaneGeometry(100, 100);
    let groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Cubes
    for (let i = 0; i < 5; i++) {
        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
        scene.add(cube);
        cubes.push(cube);
    }

    // Trees (simplified as cones)
    for (let i = 0; i < 10; i++) {
        let geometry = new THREE.ConeGeometry(0.5, 2, 8);
        let material = new THREE.MeshPhongMaterial({ color: 0x008000 });
        let tree = new THREE.Mesh(geometry, material);
        tree.position.set(Math.random() * 20 - 10, 1, Math.random() * 20 - 10);
        scene.add(tree);
    }

    // Lighting
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    camera.position.z = 15;
    camera.position.y = 5;
}

function animate() {
    requestAnimationFrame(animate);

    cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

init();
animate();

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);