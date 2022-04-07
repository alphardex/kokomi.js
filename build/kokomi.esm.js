import * as THREE from 'three';
import { InteractionManager } from 'three.interactive';
import * as STDLIB from 'three-stdlib';
import { OrbitControls as OrbitControls$1 } from 'three-stdlib';
import mitt from 'mitt';
import * as CANNON from 'cannon-es';
import StatsImpl from 'stats.js';
import { getScreenFov, MakuGroup, Maku, Scroller } from 'maku.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import gsap from 'gsap';
import imagesLoaded from 'imagesloaded';

class Animator {
    base;
    tasks;
    constructor(base) {
        this.base = base;
        this.tasks = [];
    }
    add(fn) {
        this.tasks.push(fn);
    }
    update() {
        this.base.renderer.setAnimationLoop((time) => {
            this.tasks.forEach((task) => {
                task(time);
            });
            if (this.base.composer) {
                this.base.composer.render();
            }
            else {
                this.base.renderer.render(this.base.scene, this.base.camera);
            }
        });
    }
}

class Component {
    base;
    constructor(base) {
        this.base = base;
        this.base.update((time) => this.update(time));
    }
    // 将组件添加至当前场景或替换当前场景中已有的组件
    addExisting() {
    }
    // 动画帧
    update(time) {
    }
}

class AssetManager extends Component {
    config;
    emitter;
    resourceList;
    items;
    toLoad;
    loaded;
    loaders;
    constructor(base, list, config = {}) {
        super(base);
        const { useDracoLoader = false, dracoDecoderPath = "https://www.gstatic.com/draco/versioned/decoders/1.4.3/", } = config;
        this.config = { useDracoLoader, dracoDecoderPath };
        const emitter = mitt();
        this.emitter = emitter;
        this.resourceList = list;
        this.items = {};
        this.toLoad = list.length;
        this.loaded = 0;
        this.loaders = {};
        this.setLoaders();
        if (useDracoLoader) {
            this.setDracoLoader();
        }
        this.startLoading();
    }
    // 设置加载器
    setLoaders() {
        this.loaders.gltfLoader = new STDLIB.GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.loaders.fontLoader = new STDLIB.FontLoader();
        this.loaders.fbxLoader = new STDLIB.FBXLoader();
        this.loaders.audioLoader = new THREE.AudioLoader();
        this.loaders.objLoader = new STDLIB.OBJLoader();
        this.loaders.hdrTextureLoader = new STDLIB.RGBELoader();
        this.loaders.svgLoader = new STDLIB.SVGLoader();
    }
    // 设置draco加载器
    setDracoLoader() {
        const dracoLoader = new STDLIB.DRACOLoader();
        dracoLoader.setDecoderPath(this.config.dracoDecoderPath);
        this.loaders.gltfLoader?.setDRACOLoader(dracoLoader);
    }
    // 开始加载
    startLoading() {
        for (const resource of this.resourceList) {
            if (resource.type === "gltfModel") {
                this.loaders.gltfLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "texture") {
                this.loaders.textureLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "cubeTexture") {
                this.loaders.cubeTextureLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "font") {
                this.loaders.fontLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "fbxModel") {
                this.loaders.fbxLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "audio") {
                this.loaders.audioLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "objModel") {
                this.loaders.objLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "hdrTexture") {
                this.loaders.hdrTextureLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
            else if (resource.type === "svg") {
                this.loaders.svgLoader?.load(resource.path, (file) => {
                    this.resourceLoaded(resource, file);
                });
            }
        }
    }
    // 加载完单个素材
    resourceLoaded(resource, file) {
        this.items[resource.name] = file;
        this.loaded += 1;
        if (this.isLoaded) {
            this.emitter.emit("ready");
        }
    }
    // 加载进度
    get loadProgress() {
        return this.loaded / this.toLoad;
    }
    // 是否加载完毕
    get isLoaded() {
        return this.loaded === this.toLoad;
    }
}

class Clock extends Component {
    clock;
    deltaTime;
    elapsedTime;
    constructor(base) {
        super(base);
        const clock = new THREE.Clock();
        this.clock = clock;
        this.deltaTime = 0;
        this.elapsedTime = 0;
    }
    update(time) {
        const newElapsedTime = this.clock.getElapsedTime();
        const deltaTime = newElapsedTime - this.elapsedTime;
        this.deltaTime = deltaTime;
        this.elapsedTime = newElapsedTime;
    }
}

class IMouse extends Component {
    mouse;
    constructor(base) {
        super(base);
        const mouse = new THREE.Vector2(0, 0);
        this.mouse = mouse;
    }
    listenForMouse() {
        window.addEventListener("mousemove", (e) => {
            const iMouseNew = new THREE.Vector2(e.clientX, window.innerHeight - e.clientY);
            this.mouse = iMouseNew;
        });
        window.addEventListener("touchstart", (e) => {
            const iMouseNew = new THREE.Vector2(e.touches[0].clientX, window.innerHeight - e.touches[0].clientY);
            this.mouse = iMouseNew;
        });
        window.addEventListener("touchmove", (e) => {
            const iMouseNew = new THREE.Vector2(e.touches[0].clientX, window.innerHeight - e.touches[0].clientY);
            this.mouse = iMouseNew;
        });
    }
}

class Physics extends Component {
    world;
    meshPhysicsObjects;
    constructor(base) {
        super(base);
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        this.world = world;
        this.meshPhysicsObjects = [];
    }
    // 添加物体
    add({ mesh, body, copyPosition = true, copyQuaternion = true, }) {
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
                mesh.position.copy(body.position);
            }
            if (copyQuaternion) {
                mesh.quaternion.copy(body.quaternion);
            }
        });
    }
    update(time) {
        this.sync();
        this.tick();
    }
}
class MeshPhysicsObject {
    mesh;
    body;
    copyPosition;
    copyQuaternion;
    constructor(mesh, body, copyPosition = true, copyQuaternion = true) {
        this.mesh = mesh;
        this.body = body;
        this.copyPosition = copyPosition;
        this.copyQuaternion = copyQuaternion;
    }
}

class Resizer extends Component {
    constructor(base) {
        super(base);
    }
    get aspect() {
        return window.innerWidth / window.innerHeight;
    }
    resize() {
        const { base } = this;
        if (base.camera instanceof THREE.PerspectiveCamera) {
            base.camera.aspect = this.aspect;
            base.camera.updateProjectionMatrix();
            base.renderer.setSize(window.innerWidth, window.innerHeight);
            base.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        }
    }
    listenForResize() {
        window.addEventListener("resize", () => {
            this.resize();
        });
    }
}

class Stats extends Component {
    stats;
    constructor(base) {
        super(base);
        const stats = new StatsImpl();
        this.stats = stats;
        this.base.container.appendChild(this.stats.dom);
    }
    update(time) {
        this.stats.update();
    }
}

class Base {
    camera;
    scene;
    renderer;
    container;
    animator;
    interactionManager;
    composer;
    clock;
    iMouse;
    physics;
    resizer;
    constructor(sel = "#sketch") {
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.z = 1;
        this.camera = camera;
        const scene = new THREE.Scene();
        this.scene = scene;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer = renderer;
        const container = document.querySelector(sel);
        container?.appendChild(renderer.domElement);
        this.container = container;
        const animator = new Animator(this);
        this.animator = animator;
        const interactionManager = new InteractionManager(this.renderer, this.camera, this.renderer.domElement, false);
        this.interactionManager = interactionManager;
        this.composer = null;
        const clock = new Clock(this);
        this.clock = clock;
        const iMouse = new IMouse(this);
        this.iMouse = iMouse;
        const physics = new Physics(this);
        this.physics = physics;
        const resizer = new Resizer(this);
        this.resizer = resizer;
        this.init();
        this.addEventListeners();
    }
    addEventListeners() {
        // resize
        this.resizer.listenForResize();
        // mouse
        this.iMouse.listenForMouse();
    }
    update(fn) {
        this.animator.add(fn);
    }
    init() {
        this.update(() => {
            this.interactionManager.update();
        });
        this.animator.update();
    }
}

class ScreenCamera extends Component {
    camera;
    constructor(base, config = {}) {
        super(base);
        const { position = new THREE.Vector3(0, 0, 600), near = 100, far = 2000, } = config;
        const fov = getScreenFov(position.z);
        const container = base.container;
        const aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.copy(position);
        this.camera = camera;
    }
    addExisting() {
        this.base.camera = this.camera;
        this.base.interactionManager.camera = this.camera;
    }
}

class OrbitControls extends Component {
    controls;
    constructor(base) {
        super(base);
        const controls = new OrbitControls$1(base.camera, base.renderer.domElement);
        this.controls = controls;
        controls.enableDamping = true;
    }
    update(time) {
        this.controls.update();
    }
}

// https://mathworld.wolfram.com/HyperbolicHelicoid.html
const hyperbolicHelicoidFunction = (u, v, target) => {
    u = Math.PI * 2 * (u - 0.5);
    v = Math.PI * 2 * (v - 0.5);
    const tau = 5;
    const bottom = 1 + Math.cosh(u) * Math.cosh(v);
    const x = (Math.sinh(v) * Math.cos(tau * u)) / bottom;
    const y = (Math.sinh(v) * Math.sin(tau * u)) / bottom;
    const z = (Math.cosh(v) * Math.sinh(u)) / bottom;
    target.set(x, z, y);
};
// https://arxiv.org/pdf/1604.02174.pdf
const sphubeFunction = (u1, v1, target) => {
    const s = 0.6;
    const r = 1;
    const theta = 2 * u1 * Math.PI;
    const phi = v1 * 2 * Math.PI;
    const u = Math.cos(theta) * Math.cos(phi);
    const v = Math.cos(theta) * Math.sin(phi);
    const w = Math.sin(theta);
    const z = (r * u) / Math.sqrt(1 - s * v ** 2 - s * w ** 2);
    const x = (r * v) / Math.sqrt(1 - s * u ** 2 - s * w ** 2);
    const y = (r * w) / Math.sqrt(1 - s * Math.cos(theta) ** 2);
    target.set(x, y, z);
};

class HyperbolicHelicoidGeometry extends ParametricGeometry {
    constructor(slices, stacks) {
        super(hyperbolicHelicoidFunction, slices, stacks);
    }
}

class SphubeGeometry extends ParametricGeometry {
    constructor(slices, stacks) {
        super(sphubeFunction, slices, stacks);
    }
}

class GlassMaterial extends THREE.MeshPhysicalMaterial {
    constructor(parameters) {
        super({
            roughness: 0.6,
            transmission: 1,
            // @ts-ignore
            thickness: 1.2,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
            ...parameters,
        });
    }
}

class BasicPanorama extends Component {
    material;
    mesh;
    emitter;
    infospots;
    isInfospotVisible;
    active;
    constructor(base, config = {}) {
        super(base);
        const { radius = 5000 } = config;
        const geometry = new THREE.SphereGeometry(radius, 60, 40);
        const material = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            transparent: true,
            opacity: 1,
        });
        this.material = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.mesh = mesh;
        this.emitter = mitt();
        this.infospots = [];
        this.isInfospotVisible = false;
        this.active = false;
    }
    addExisting() {
        const { base, mesh } = this;
        const { scene } = base;
        scene.add(mesh);
    }
    outputPosition() {
        window.addEventListener("click", (event) => {
            const intersects = this.base.interactionManager.raycaster.intersectObject(this.mesh, true);
            const point = intersects[0].point.clone();
            const position = {
                x: point.x.toFixed(2),
                y: point.y.toFixed(2),
                z: point.z.toFixed(2),
            };
            const message = `${position.x}, ${position.y}, ${position.z}`;
            console.log(message);
            this.emitter.emit("click", point);
        });
    }
    show() {
        this.material.opacity = 1;
    }
    hide() {
        this.material.opacity = 0;
    }
    fadeIn(duration = 0.5) {
        return new Promise((resolve) => {
            gsap.fromTo(this.material, {
                opacity: 0,
            }, {
                opacity: 1,
                duration,
                onComplete() {
                    resolve(true);
                },
            });
        });
    }
    fadeOut(duration = 0.5) {
        return new Promise((resolve) => {
            gsap.fromTo(this.material, {
                opacity: 1,
            }, {
                opacity: 0,
                duration,
                onComplete() {
                    resolve(true);
                },
            });
        });
    }
    add(infospot) {
        this.infospots.push(infospot);
    }
    addGroup(infospots) {
        for (const infospot of infospots) {
            this.add(infospot);
        }
    }
    update(time) {
        for (const infospot of this.infospots) {
            if (!this.active) {
                infospot.makeInvisible();
            }
            else {
                if (this.isInfospotVisible) {
                    infospot.makeVisible();
                }
                else {
                    infospot.makeInvisible();
                }
            }
        }
    }
    toggleInfospotVisibility(isVisible = undefined) {
        const visible = isVisible
            ? isVisible
            : this.isInfospotVisible
                ? false
                : true;
        this.isInfospotVisible = visible;
    }
    onEnter(duration = 0.5) {
        this.active = true;
        this.toggleInfospotVisibility(true);
        this.fadeIn(duration);
    }
    onLeave(duration = 0.5) {
        this.active = false;
        this.toggleInfospotVisibility(false);
        this.fadeOut(duration);
    }
}

class ImagePanorama extends BasicPanorama {
    constructor(base, texture, config = {}) {
        super(base);
        const { radius = 5000 } = config;
        const geometry = new THREE.SphereGeometry(radius, 60, 40);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            transparent: true,
            opacity: 1,
        });
        this.material = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.mesh = mesh;
    }
}

class Viewer extends Component {
    camera;
    orbitControls;
    panoramas;
    currentPanorama;
    constructor(base, config = {}) {
        super(base);
        const { fov = 60 } = config;
        const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 1);
        base.camera = camera;
        base.interactionManager.camera = camera;
        this.camera = camera;
        const orbitControls = new OrbitControls(base);
        this.orbitControls = orbitControls;
        this.panoramas = [];
        this.currentPanorama = null;
    }
    add(panorama) {
        panorama.addExisting();
        this.panoramas.push(panorama);
        panorama.onEnter(0);
        this.currentPanorama = panorama;
    }
    setPanorama(panorama, duration = 0.5) {
        if (panorama === this.currentPanorama) {
            return;
        }
        this.currentPanorama?.onLeave(duration);
        panorama?.onEnter(duration);
        this.currentPanorama = panorama;
    }
}

const defaultVertexShader$2 = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;
const defaultFragmentShader$2 = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec4 color=texture(tDiffuse,p);
    gl_FragColor=color;
}
`;
class CustomEffect extends Component {
    composer;
    customPass;
    constructor(base, config = {}) {
        super(base);
        const { vertexShader = defaultVertexShader$2, fragmentShader = defaultFragmentShader$2, uniforms = {}, } = config;
        const composer = new STDLIB.EffectComposer(base.renderer);
        this.composer = composer;
        const renderPass = new STDLIB.RenderPass(base.scene, base.camera);
        composer.addPass(renderPass);
        const customPass = new STDLIB.ShaderPass({
            vertexShader,
            fragmentShader,
            uniforms: {
                ...{
                    tDiffuse: {
                        value: null,
                    },
                    iTime: {
                        value: 0,
                    },
                    iResolution: {
                        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                    },
                    iMouse: {
                        value: new THREE.Vector2(0, 0),
                    },
                },
                ...uniforms,
            },
        });
        this.customPass = customPass;
        customPass.renderToScreen = true;
        composer.addPass(customPass);
    }
    addExisting() {
        this.base.composer = this.composer;
    }
    update(time) {
        const uniforms = this.customPass.uniforms;
        uniforms.iTime.value = time / 1000;
        uniforms.iResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        uniforms.iMouse.value = this.base.interactionManager.mouse;
    }
}

class Box extends Component {
    mesh;
    constructor(base, config = {}) {
        super(base);
        const { width = 0.2, height = 0.2, depth = 0.2, position = new THREE.Vector3(0, 0, 0), material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#ffffff"),
        }), } = config;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        this.mesh = mesh;
    }
    addExisting() {
        this.base.scene.add(this.mesh);
    }
    spin(time, axis = "y", speed = 1) {
        const mesh = this.mesh;
        mesh.rotation[axis] = (time / 1000) * speed;
    }
}

const defaultVertexShader$1 = `
varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=vec4(p,1.);
    
    vUv=uv;
}
`;
const defaultFragmentShader$1 = `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec3 color=vec3(p,0.);
    gl_FragColor=vec4(color,1.);
}
`;
const shadertoyPrepend = `
uniform float iGlobalTime;
uniform float iTime;
uniform float iTimeDelta;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform vec4 iDate;
uniform float iSampleRate;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

uniform float iChannelTime[4];
`;
const shadertoyAppend = `
varying vec2 vUv;

void main(){
    mainImage(gl_FragColor,vUv*iResolution.xy);
}
`;
class ScreenQuad extends Component {
    material;
    mesh;
    constructor(base, config = {}) {
        super(base);
        const { vertexShader = defaultVertexShader$1, fragmentShader = defaultFragmentShader$1, uniforms = {}, shadertoyMode = false, } = config;
        const finalFragmentShader = shadertoyMode
            ? `
    ${shadertoyPrepend}

    ${fragmentShader}

    ${shadertoyAppend}
    `
            : fragmentShader;
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: finalFragmentShader,
            uniforms: {
                ...{
                    iGlobalTime: {
                        value: 0,
                    },
                    iTime: {
                        value: 0,
                    },
                    iTimeDelta: {
                        value: 0,
                    },
                    iResolution: {
                        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
                    },
                    iMouse: {
                        value: new THREE.Vector4(0, 0, 0, 0),
                    },
                    iFrame: {
                        value: 0,
                    },
                    iDate: {
                        value: new THREE.Vector4(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours()),
                    },
                    iSampleRate: {
                        value: 44100,
                    },
                    iChannelTime: {
                        value: [0, 0, 0, 0],
                    },
                },
                ...uniforms,
            },
            side: THREE.DoubleSide,
        });
        this.material = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.mesh = mesh;
    }
    addExisting() {
        this.base.scene.add(this.mesh);
    }
    update(time) {
        const uniforms = this.material.uniforms;
        const t = this.base.clock.elapsedTime;
        uniforms.iGlobalTime.value = t;
        uniforms.iTime.value = t;
        const delta = this.base.clock.deltaTime;
        uniforms.iTimeDelta.value = delta;
        uniforms.iResolution.value = new THREE.Vector3(window.innerWidth, window.innerHeight, 1);
        const { x, y } = this.base.iMouse.mouse;
        uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0);
        uniforms.iDate.value = new THREE.Vector4(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours());
        uniforms.iChannelTime.value = [t, t, t, t];
    }
}

// 将three.js的geometry转化为cannon.js的shape
const convertGeometryToShape = (geometry) => {
    switch (geometry.type) {
        case "BoxGeometry":
        case "BoxBufferGeometry": {
            const { width = 1, height = 1, depth = 1, } = geometry.parameters;
            const halfExtents = new CANNON.Vec3(width / 2, height / 2, depth / 2);
            return new CANNON.Box(halfExtents);
        }
        case "PlaneGeometry":
        case "PlaneBufferGeometry": {
            return new CANNON.Plane();
        }
        case "SphereGeometry":
        case "SphereBufferGeometry": {
            const { radius } = geometry.parameters;
            return new CANNON.Sphere(radius);
        }
        case "CylinderGeometry":
        case "CylinderBufferGeometry": {
            const { radiusTop, radiusBottom, height, radialSegments } = geometry.parameters;
            return new CANNON.Cylinder(radiusTop, radiusBottom, height, radialSegments);
        }
        default: {
            // Ref: https://github.com/pmndrs/cannon-es/issues/103#issuecomment-1002183975
            let geo = new THREE.BufferGeometry();
            geo.setAttribute("position", geometry.getAttribute("position"));
            geo = STDLIB.mergeVertices(geo);
            const position = geo.attributes.position.array;
            const index = geo.index.array;
            const points = [];
            for (let i = 0; i < position.length; i += 3) {
                points.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]));
            }
            const faces = [];
            for (let i = 0; i < index.length; i += 3) {
                faces.push([index[i], index[i + 1], index[i + 2]]);
            }
            return new CANNON.ConvexPolyhedron({ vertices: points, faces });
        }
    }
};

// 图片预加载
const preloadImages = (sel = "div") => {
    return new Promise((resolve) => {
        imagesLoaded(sel, { background: true }, resolve);
    });
};

// 制作buffer
const makeBuffer = (count = 100, fn, dimension = 3) => {
    const buffer = Float32Array.from({ length: count * dimension }, (v, k) => {
        return fn(k);
    });
    return buffer;
};
// 迭代buffer
const iterateBuffer = (buffer, count, fn, dimension = 3) => {
    for (let i = 0; i < count; i++) {
        const axis = i * dimension;
        const x = axis;
        const y = axis + 1;
        const z = axis + 2;
        const w = axis + 3;
        fn(buffer, { x, y, z, w }, i);
    }
};
// 将bufferAttribute转为向量
const convertBufferAttributeToVector = (bufferAttribute, dimension = 3) => {
    const vectorDimensionMap = {
        2: new THREE.Vector2(),
        3: new THREE.Vector3(),
        4: new THREE.Vector4(),
    };
    const vectors = Array.from({ length: bufferAttribute.array.length / dimension }, (v, k) => {
        const vector = vectorDimensionMap[dimension].clone();
        return vector.fromBufferAttribute(bufferAttribute, k);
    });
    return vectors;
};

// 开启真实渲染
const enableRealisticRender = (renderer) => {
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

const calcObjectPosition = (objectPos, camera) => {
    const screenPos = objectPos.clone();
    screenPos.project(camera);
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    const x = screenPos.x * widthHalf + widthHalf;
    const y = -(screenPos.y * heightHalf) + heightHalf;
    const pos = new THREE.Vector2(x, y);
    return pos;
};
const isObjectBehindCamera = (objectPos, camera) => {
    const deltaCamObj = objectPos.clone().sub(camera.position);
    const camDir = camera.getWorldDirection(new THREE.Vector3());
    return deltaCamObj.angleTo(camDir) > Math.PI / 2;
};
const isObjectVisible = (elPos, camera, raycaster, occlude) => {
    const screenPos = elPos.clone();
    screenPos.project(camera);
    raycaster.setFromCamera(screenPos, camera);
    const intersects = raycaster.intersectObjects(occlude, true);
    if (intersects.length) {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = elPos.distanceTo(raycaster.ray.origin);
        return pointDistance < intersectionDistance;
    }
    return true;
};
const objectZIndex = (objectPos, camera, zIndexRange = [16777271, 0]) => {
    if (camera instanceof THREE.PerspectiveCamera ||
        camera instanceof THREE.OrthographicCamera) {
        const cameraPos = camera.position;
        const dist = objectPos.distanceTo(cameraPos);
        const A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
        const B = zIndexRange[1] - A * camera.far;
        return Math.round(A * dist + B);
    }
    return undefined;
};

const defaultVertexShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;
const defaultFragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 tex=texture(uTexture,vUv);
    vec3 color=tex.rgb;
    gl_FragColor=vec4(color,1.);
}
`;
class Gallery extends Component {
    elList;
    vertexShader;
    fragmentShader;
    uniforms;
    makuMaterial;
    makuGroup;
    scroller;
    constructor(base, config = {}) {
        super(base);
        const { elList = [...document.querySelectorAll("img")], vertexShader = defaultVertexShader, fragmentShader = defaultFragmentShader, uniforms = {}, } = config;
        this.elList = elList;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.uniforms = uniforms;
        this.makuMaterial = null;
        this.makuGroup = null;
        this.scroller = null;
    }
    async addExisting() {
        // Load all the images
        await preloadImages();
        // Create a ShaderMaterial
        const makuMaterial = new THREE.ShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                ...{
                    uTexture: {
                        value: null,
                    },
                    iTime: {
                        value: 0,
                    },
                    iResolution: {
                        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                    },
                    iMouse: {
                        value: new THREE.Vector2(0, 0),
                    },
                },
                ...this.uniforms,
            },
        });
        this.makuMaterial = makuMaterial;
        // Make a MakuGroup that contains all the makus!
        const makuGroup = new MakuGroup();
        this.makuGroup = makuGroup;
        const makus = this.elList.map((el) => new Maku(el, makuMaterial, this.base.scene));
        makuGroup.addMultiple(makus);
        // Sync images positions
        makuGroup.setPositions();
        // Make a scroller
        const scroller = new Scroller();
        this.scroller = scroller;
        scroller.listenForScroll();
    }
    update(time) {
        const makuGroup = this.makuGroup;
        const scroller = this.scroller;
        scroller?.syncScroll();
        makuGroup?.setPositions(scroller?.scroll.current);
        makuGroup?.makus.forEach((maku) => {
            const material = maku.mesh.material;
            const uniforms = material.uniforms;
            uniforms.iTime.value = time / 1000;
            uniforms.iResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
            uniforms.iMouse.value = this.base.interactionManager.mouse;
        });
    }
}

class Html extends Component {
    el;
    position;
    visibleClassName;
    xPropertyName;
    yPropertyName;
    zIndexPropertyName;
    raycaster;
    occlude;
    visibleToggle;
    constructor(base, el, position = new THREE.Vector3(0, 0, 0), config = {}) {
        super(base);
        this.el = el;
        this.position = position;
        const { visibleClassName = "visible", xPropertyName = "--x", yPropertyName = "--y", zIndexPropertyName = "--z-index", occlude = [], } = config;
        this.visibleClassName = visibleClassName;
        this.xPropertyName = xPropertyName;
        this.yPropertyName = yPropertyName;
        this.zIndexPropertyName = zIndexPropertyName;
        this.raycaster = new THREE.Raycaster();
        this.occlude = occlude;
        this.visibleToggle = true;
    }
    get domPosition() {
        return calcObjectPosition(this.position, this.base.camera);
    }
    get zIndex() {
        return objectZIndex(this.position, this.base.camera);
    }
    get isBehindCamera() {
        return isObjectBehindCamera(this.position, this.base.camera);
    }
    get isVisible() {
        return isObjectVisible(this.position, this.base.camera, this.raycaster, this.occlude);
    }
    get visible() {
        if (!this.visibleToggle) {
            return false;
        }
        if (this.occlude.length === 0) {
            return !this.isBehindCamera;
        }
        else {
            return !this.isBehindCamera && this.isVisible;
        }
    }
    show() {
        this.el?.classList.add(this.visibleClassName);
    }
    hide() {
        this.el?.classList.remove(this.visibleClassName);
    }
    translate({ x = 0, y = 0 }) {
        this.el?.style.setProperty(this.xPropertyName, `${x}px`);
        this.el?.style.setProperty(this.yPropertyName, `${y}px`);
    }
    setZIndex(zIndex = 0) {
        this.el?.style.setProperty(this.zIndexPropertyName, `${zIndex}`);
    }
    syncPosition() {
        this.translate(this.domPosition);
        if (this.zIndex) {
            this.setZIndex(this.zIndex);
        }
    }
    makeVisible() {
        this.visibleToggle = true;
    }
    makeInvisible() {
        this.visibleToggle = false;
    }
    update(time) {
        this.syncPosition();
        if (this.visible) {
            this.show();
        }
        else {
            this.hide();
        }
    }
}

export { Animator, AssetManager, Base, BasicPanorama, Box, Clock, Component, CustomEffect, Gallery, GlassMaterial, Html, HyperbolicHelicoidGeometry, IMouse, ImagePanorama, MeshPhysicsObject, OrbitControls, Physics, Resizer, ScreenCamera, ScreenQuad, SphubeGeometry, Stats, Viewer, calcObjectPosition, convertBufferAttributeToVector, convertGeometryToShape, enableRealisticRender, hyperbolicHelicoidFunction, isObjectBehindCamera, isObjectVisible, iterateBuffer, makeBuffer, objectZIndex, preloadImages, sphubeFunction };
