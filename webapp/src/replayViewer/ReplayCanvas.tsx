import { useEffect, useRef } from "react"
import * as THREE from "three";
import ReplayScrubber from "../components/ReplayScrubber";
import SceneManager from "./SceneManager";

export default function ReplayCanvas({width = 1280, height = 720}: {width?: number, height?: number}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sm = new SceneManager(width, height);
        if (ref.current)
            ref.current.appendChild(sm.renderer.domElement);
        sm.animate();
        
        const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        sm.scene.add(boxMesh);

        return () => {if (ref.current) ref.current.removeChild(sm.renderer.domElement)};
    }, [])

    return (
        <div>
            <ReplayScrubber endTime={1000} events={[{eventType: 1, time: 35}, {eventType: 1, time: 240}, {eventType: 1, time: 600}, {eventType: 1, time: 890}]} />
            <div ref={ref} />
        </div>
    )
}