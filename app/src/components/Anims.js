import { MeshAnim } from "./MeshAnim";
import noise, { perlin3 } from "./noise";

export function GrowingExp({ position }) {
  const zOfXYT = (x, y, t) => {
    let cyc = 1 + Math.sin(t / 250)

    return cyc *
      5 * Math.exp(-1 * (x ** 2 + y ** 2) ** (0.75) / cyc);
  }

  const colorOfXYZT = (x, y, z, t) => {
    let r = Math.sqrt(x**2 + y**2)

    return {
      b: r/75,
      g: z/5,
      r: z
    }
  }

  return (
    <MeshAnim
      position={position}
      rotation={[-Math.PI/2, 0, 0]}
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

export function Ripple({ position }) {
  const zOfXYT = (x, y, t) => {
    return Math.sin(0.1 * (x ** 2 + y ** 2 + t));
  }

  const colorOfXYZT = (x, y, z, t) => {
    return [0.2 * Math.cos(z), z / 5, 0.2] // r, g, b
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

export function Terrain({ position, rotation }) {
  noise.seed(Math.floor(Math.random()*(2**16)))
  const sampleNoise = (x, y, z) => {
    let scale = 1/8
    let octaves = 20
    let persistence = 0.6
    let lacunarity = 2
    
    let amp = 1
    let freq = 1

    let v = 0
    for(let i = 0; i < octaves; i++){
      v += amp*perlin3(x*freq*scale, y*freq*scale, z)
      amp *= persistence
      freq *= lacunarity
    }
    
    return v
  }

  const zOfXYT = (x, y, t) => {
    return sampleNoise(x, y, t);
  }

  const colorOfXYZT = (x, y, z, t) => {

    return {
      r: z,
      g: z/5,
      b: Math.sqrt(x**2 + y**2)/75,
    }
    /**
     * Volcano:
     * 
     */
  }

  const update = (t) => {
    return t + .002
  }

  return (
    <MeshAnim
      position={position}
      rotation={rotation}
      grid={{
        width: 100,
        height: 100,
        sep: .2
      }}
      zOfXYT={zOfXYT}
      colorOfXYZT={colorOfXYZT}
      anim={{
        init: 0,
        update
      }}
    />
  );
}

