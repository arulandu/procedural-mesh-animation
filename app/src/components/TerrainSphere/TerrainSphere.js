import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import frag from "./shader/frag";
import vert from "./shader/vert";

export const TerrainSphere = ({
    position, rotation, wireframe=false
}) => {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        meshRef.current.material.uniforms.u_time.value = clock.oldTime*0.001;
    });

    let uniforms = {
        u_time: { type: 'f', value: 0 },
        rad: {type: 'f', value: 1}
    }

    // create cube sphere with custom shader
    return (
        <mesh position={position} rotation={rotation} ref={meshRef}>
            <boxGeometry args={[1, 1, 1, 10, 10, 10]} /> 
            <shaderMaterial
                attach="material"
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
                wireframe={wireframe}
            />
        </mesh>
    );
}
