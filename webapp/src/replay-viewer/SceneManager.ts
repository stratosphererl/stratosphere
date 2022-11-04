import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class SceneManager {
    private clock: THREE.Clock;
    public readonly scene: THREE.Scene;

    private camera: THREE.PerspectiveCamera;
    private fov: number;
    
    private renderer: THREE.WebGLRenderer;

    private controls: OrbitControls;
    private stats: Stats;

    constructor(private canvasID: string) {
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();

        const canvas = document.getElementById(canvasID);
        if (canvas == null)
            throw new Error("this shit not bussin no cap fr");
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });

        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(
            this.fov = 45,
            width / height,
            1,
            1000,
        );
        this.camera.position.z = 96;

        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

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
        this.stats.update();
        this.controls.update();
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

}