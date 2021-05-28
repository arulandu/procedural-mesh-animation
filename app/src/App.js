import './App.scss';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Terrain } from './components/Anims';

extend({ OrbitControls })

function CameraControls() {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update())

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
    // autoRotate
    // autoRotateSpeed={0.2}
    />
  );
}

function AnimationCanvas() {
  return (
    <Canvas
      colorManagement
      camera={{ position: [0, 2, 10], fov: 75 }}
    >
      <ambientLight/>
      {/* <hemisphereLight/> */}
      {/* <directionalLight /> */}
      <Suspense fallback={null}>
        {/* <GrowingExp position={[0, -0.5, 0]}/> */}
        {/* <Ripple position={[25, 0, 0]}/> */}
        <Terrain position={[0,0,0]} rotation={[-Math.PI/2,0,0]}/>
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}

function App() {
  return (
    <div className="app">
      <div className="anim">
        <Suspense fallback={<div>Loading...</div>}>
          <AnimationCanvas />
        </Suspense>
      </div>
      <a className="badge" href="https://github.com/claeb101/procedural-mesh-animation" alt="Contributors">
        <img src="https://img.shields.io/github/last-commit/claeb101/procedural-mesh-animation" alt=""/>
      </a>
    </div>
  );
}

export default App;
