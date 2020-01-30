// WebGL code from https://tympanus.net/Development/DistortionHoverEffect/

import React, { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../utils/shaders';
import { Canvas, useThree } from 'react-three-fiber';
import { useSpring, a, interpolate } from 'react-spring/three';
import styled from 'styled-components';

// data.map(([url1, url2, disp, intensity, x, y, factor, z, scale], index) => (

import img1 from '../images/crop-1.jpg';
import img2 from '../images/crop-2.jpg';
import img3 from '../images/crop-3.jpg';
import img4 from '../images/crop-4.jpg';
import img5 from '../images/crop-5.jpg';
import img6 from '../images/crop-6.jpg';
import disp from '../images/disp.jpg';

const data = [
  [img1, img2, disp, -0.65],
  [img3, img4, disp, 2.2],
  [img5, img6, disp, -0.4]
];

function ImageWebgl({ url1, url2, disp, intensity, hovered }) {
  const { progress } = useSpring({ progress: hovered ? 1 : 0 });
  const { gl, invalidate, viewport } = useThree();

  const args = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture1 = loader.load(url1, invalidate);
    const texture2 = loader.load(url2, invalidate);
    const dispTexture = loader.load(disp, invalidate);

    dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping;
    texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
    texture1.minFilter = texture2.minFilter = THREE.LinearFilter;

    texture1.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture2.anisotropy = gl.capabilities.getMaxAnisotropy();
    return {
      uniforms: {
        effectFactor: { type: 'f', value: intensity },
        dispFactor: { type: 'f', value: 0 },
        texture: { type: 't', value: texture1 },
        texture2: { type: 't', value: texture2 },
        disp: { type: 't', value: dispTexture }
      },
      vertexShader,
      fragmentShader
    };
  }, [url1, url2, disp]);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeBufferGeometry attach="geometry" args={[1, 1]} />
      <a.shaderMaterial
        attach="material"
        args={[args]}
        uniforms-dispFactor-value={progress}
      />
    </mesh>
  );
}

function Image(props) {
  const [hovered, setHover] = useState(false);
  const hover = useCallback(() => setHover(true), []);
  const unhover = useCallback(() => setHover(false), []);
  const trans1 = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`;
  // const [x, y] = props.xy;
  return (
    <>
      {/* <div>{props.xy}</div> */}
      <a.Item
        onPointerOver={hover}
        onPointerOut={unhover}
        // style={{ transform: (x, y).interpolate(trans1) }}
      >
        <Canvas invalidateFrameloop>
          <ImageWebgl {...props} hovered={hovered} />
        </Canvas>
      </a.Item>
    </>
  );
}

export default function App() {
  // const mouseMove = e => {
  //   console.log(e.clientX, e.clientY);
  // };
  const calc = (x, y) => [
    x - window.innerWidth / 2,
    y - window.innerHeight / 2
  ];
  const trans1 = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`;
  const trans2 = (x, y) => `translate3d(${x / 8 + 35}px,${y / 8 - 230}px,0)`;
  const trans3 = (x, y) => `translate3d(${x / 6 - 250}px,${y / 6 - 200}px,0)`;
  const trans4 = (x, y) => `translate3d(${x / 3.5}px,${y / 3.5}px,0)`;
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 }
  }));
  return (
    <Container
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <Grid>
        {data.map(([url1, url2, disp, intensity, xy], index) => (
          <Image
            key={index}
            url1={url1}
            url2={url2}
            disp={disp}
            xy={xy}
            intensity={intensity}
          />
        ))}
        <div>{props.xy[0]}</div>
      </Grid>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  overflow: auto;
  top: 0px;
  width: 100%;
  height: 100vh;
  font-size: 20em;
  font-weight: 800;
  line-height: 0.9em;
  background: #eee;
`;

const Grid = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Item = styled.div`
  position: relative;
  width: 30vw;
  height: 30vw;
  padding: 1.5vh;
  & canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;
