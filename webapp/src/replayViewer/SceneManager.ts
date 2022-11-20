import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class SceneManager {
    private clock: THREE.Clock;
    public readonly scene: THREE.Scene;

    private camera: THREE.PerspectiveCamera;
    private fov: number;
    
    public readonly renderer: THREE.WebGLRenderer;

    private controls: OrbitControls;

    constructor(width: number, height: number) {
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();

        // const width = window.innerWidth;
        // const height = window.innerHeight;
        // const width = ref.current.clientWidth;
        // const height = ref.current.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(
            this.fov = 45,
            width / height,
            1,
            1000,
        );
        this.camera.position.z = 96;

        this.renderer.setSize(width, height);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Likely to be moved later so we can better control over lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, .5);
        ambientLight.castShadow = true;
        this.scene.add(ambientLight);

        // Same comment from before applies here
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.castShadow = true;
        spotLight.position.set(0, 64, 32);
        this.scene.add(spotLight);
    }

    public animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.controls.update();
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

}