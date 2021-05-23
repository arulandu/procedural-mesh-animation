import './App.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
extend({OrbitControls})

function CameraControls(){
  const {
    camera,
    gl: {domElement}
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update())

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      // autoRotate
      // autoRotateSpeed={-0.2}
    />
  );
}

function MeshAnim({
  position,
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

  let {positions, colors, normals} = useMemo(() => {
    let positions = [], colors = [], normals = []

    for(let yi = 0; yi < height; yi++){
      for(let xi = 0; xi < width; xi++){
        let x = sep*(xi - (width-1.) / 2.)
        let y = sep*(yi - (height+1.) / 2.)
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
    for(let yi = 0; yi < height-1; yi++){
      for(let xi = 0; xi < width-1; xi++){
        indices.push(i, i+1, i+width+1)
        indices.push(i+width+1, i+width, i)
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
    for(let yi = 0; yi < height; yi++){
      for(let xi = 0; xi < width; xi++){
        positions[i+2] = zOfXYT(positions[i], positions[i+1], t)

        let c = colorOfXYZT(positions[i], positions[i+1], positions[i+2], t)
        colors[i] = c[0]
        colors[i+1] = c[1]
        colors[i+2] = c[2]
        i += 3
      }
    }

    posRef.current.needsUpdate = true;
    colorRef.current.needsUpdate = true;
  })

  return (
    <>
      <mesh position={position} ref={mesh}>
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
        <meshPhongMaterial side={THREE.DoubleSide} vertexColors={true}/>
      </mesh>
      
    </>
  );
}

function GrowingExp({position}){
  const zOfXYT = (x, y, t) => {
    let cyc = 1+Math.sin(t/250)

    return cyc*
    5*Math.exp(-1*(x**2 + y**2)**(0.75)/cyc);
  }

  const colorOfXYZT = (x, y, z, t) => {
    return [0.1*Math.cos(z), z/10, 0.2] // r, g, b
  }

  return (
    <MeshAnim
      position={position}
      grid={{
        width: 100,
        height: 100,
        sep: 0.1
      }}
      zOfXYT={zOfXYT}
      colorOfXYZT={colorOfXYZT}
      anim={{
        init: 0,
        update: (t) => {
          return t + 1
        }
      }}
    />
  );
}

function Ripple({position}){
  const zOfXYT = (x, y, t) => {
    return Math.sin(0.1*(x**2 + y**2 + t));
  }

  const colorOfXYZT = (x, y, z, t) => {
    return [0.2*Math.cos(z), z/5, 0.2] // r, g, b
  }

  return (
    <MeshAnim
      position={position}
      grid={{
        width: 100,
        height: 100,
        sep: 0.1
      }}
      zOfXYT={zOfXYT}
      colorOfXYZT={colorOfXYZT}
      anim={{
        init: 0,
        update: (t) => {
          return t + 0.1
        }
      }}
    />
  );
}

function AnimationCanvas() {
  return (
    <Canvas
      colorManagement
      camera={{ position: [0, 5, 10], fov: 75 }}
    >
      <hemisphereLight />
      <Suspense fallback={null}>
        <GrowingExp position={[0,0,0]}/>
        <Ripple position={[10,0,0]}/>
      </Suspense>
      <CameraControls/>
    </Canvas>
  );
}


function App() {
  return (
    <div className="anim">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}

export default App;
