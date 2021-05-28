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
      camera={{ position: [0, 5, 10], fov: 75 }}
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
    <div className="anim">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}

export default App;
