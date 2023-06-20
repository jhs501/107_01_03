import * as THREE from './three.module.js';
import { TransformControls } from './TransformControls.js';
import { OrbitControls } from './OrbitControls.js';
import { RectAreaLightHelper } from './RectAreaLightHelper.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupModel();
        this._setupCamera();
        this._setupLight();
        this._setupControls();
        this._setupOrbitControls();
        this._setupRectAreaLight();

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        const cameraDistanceInput = document.querySelector("#camera-distance");
        cameraDistanceInput.addEventListener('input', () => {
            this._camera.position.z = cameraDistanceInput.value;
        });

        const textureButton = document.querySelector("#texture-button");
        textureButton.addEventListener('click', () => {
            if (this._currentTexture === './4.png') {
                this._currentTexture = './5.png';
            } else {
                this._currentTexture = './4.png';
            }
            const texture = new THREE.TextureLoader().load(this._currentTexture);
            this._cube.material.map = texture;
            this._cube.material.needsUpdate = true;
        });

        const lightIntensityInput = document.querySelector("#light-intensity");
        lightIntensityInput.addEventListener('input', () => {
            const intensity = lightIntensityInput.value;
            this._light.intensity = intensity;
        });

        this._currentTexture = './4.png';

        requestAnimationFrame(this.render.bind(this));
    }

    _setupModel() {
        const geometry = new THREE.BoxGeometry(2, 1, 1);
        const texture = new THREE.TextureLoader().load('./4.png');
        const material = new THREE.MeshPhongMaterial({ map: texture });
        const cube = new THREE.Mesh(geometry, material);
        this._scene.add(cube);
        this._cube = cube;
    }

    _setupControls() {
        const controls = new TransformControls(this._camera, this._renderer.domElement);
        controls.addEventListener('dragging-changed', event => {
            this._orbitControls.enabled = !event.value;
        });
        this._scene.add(controls);
        this._controls = controls;
    }
    
    _setupOrbitControls() {
        const orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
        this._orbitControls = orbitControls;
    }

    _updateControls() {
        this._controls.attach(this._cube);
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 5;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
        this._light = light;
    }

    _setupRectAreaLight() {
        const color = 0xffffff;
        const intensity = 3;
        const light = new THREE.RectAreaLight('orange', 10, 4, 4);
        light.position.set(-1, -2, 4);
        this._scene.add(light);
        const lightHelper = new RectAreaLightHelper(light);
        this._scene.add(lightHelper);
        this._light = light;
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
        this._updateControls();
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001;
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
}

window.onload = function () {
    new App();
}
