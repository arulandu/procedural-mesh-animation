import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from 'three';

export function MeshAnim({
    position,
    rotation,
    grid: {
        width,
        height,
        sep
    },
    zOfXYT,
    colorOfXYZT,
    anim: {
        init,
        update
    }
}) {
    const mesh = useRef()
    let t = init;

    let { positions, colors, normals } = useMemo(() => {
        let positions = [], colors = [], normals = []

        for (let yi = 0; yi < height; yi++) {
            for (let xi = 0; xi < width; xi++) {
                let x = sep * (xi - (width - 1.) / 2.)
                let y = sep * (yi - (height + 1.) / 2.)
                let z = zOfXYT(x, y, t)
                positions.push(x, y, z)
                colors.push(...colorOfXYZT(x, y, z, t))
                normals.push(0, 0, 1)
            }
        }
        positions = new Float32Array(positions)
        colors = new Float32Array(colors)
        normals = new Float32Array(normals)

        return {
            positions,
            colors,
            normals
        }
    }, [width, height, sep, zOfXYT, colorOfXYZT, t])

    let indices = useMemo(() => {
        let indices = []
        let i = 0
        for (let yi = 0; yi < height - 1; yi++) {
            for (let xi = 0; xi < width - 1; xi++) {
                indices.push(i, i + 1, i + width + 1)
                indices.push(i + width + 1, i + width, i)
                i++
            }
            i++
        }
        return new Uint16Array(indices)
    }, [width, height])

    let posRef = useRef(), colorRef = useRef()
    useFrame(() => {
        t = update(t)

        const positions = posRef.current.array, colors = colorRef.current.array;

        let i = 0
        for (let yi = 0; yi < height; yi++) {
            for (let xi = 0; xi < width; xi++) {
                positions[i + 2] = zOfXYT(positions[i], positions[i + 1], t)

                let c = colorOfXYZT(positions[i], positions[i + 1], positions[i + 2], t)
                colors[i] = c[0]
                colors[i + 1] = c[1]
                colors[i + 2] = c[2]
                i += 3
            }
        }

        posRef.current.needsUpdate = true;
        colorRef.current.needsUpdate = true;
    })

    return (
        <>
            <mesh
                ref={mesh}
                position={position}
                rotation={rotation}
            >
                <bufferGeometry>
                    <bufferAttribute
                        ref={posRef}
                        attachObject={['attributes', 'position']}
                        array={positions}
                        count={positions.length / 3}
                        itemSize={3}
                    />
                    <bufferAttribute
                        ref={colorRef}
                        attachObject={['attributes', 'color']}
                        array={colors}
                        count={colors.length / 3}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attachObject={['attributes', 'normal']}
                        array={normals}
                        count={normals.length / 3}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="index"
                        array={indices}
                        count={indices.length}
                        itemSize={1}
                    />
                </bufferGeometry>
                <meshStandardMaterial
                    vertexColors
                    side={THREE.DoubleSide}
                />
            </mesh>

        </>
    );
}