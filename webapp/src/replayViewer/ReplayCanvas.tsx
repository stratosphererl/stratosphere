import { useEffect } from "react"
import * as THREE from "three";
import SceneManager from "./SceneManager";

export default function ReplayCanvas() {

    useEffect(() => {
        const sm = new SceneManager('replay-canvas');
        sm.animate();
        
        const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        sm.scene.add(boxMesh);
    })

    return (
        <canvas id="replay-canvas" width={1280} height={720} className="m-auto" />
    )
}