import { Canvas, useFrame, useThree } from 'react-three-fiber';
import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import * as THREE from 'three/src/Three';
import data from '../components/Images';

function Image({ url, opacity, scale, ...props }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  const [hovered, setHover] = useState(false);
  const hover = useCallback(() => setHover(true), []);
  const unhover = useCallback(() => setHover(false), []);
  const { factor } = useSpring({ factor: hovered ? 1.1 : 1 });
  return (
    <animated.mesh
      {...props}
      onHover={hover}
      onUnhover={unhover}
      scale={factor.interpolate(f => [scale * f, scale * f, 1])}
    >
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <meshLambertMaterial
        attach="material"
        transparent
        opacity={1}
      >
        <primitive attach="map" object={texture} />
      </meshLambertMaterial>
    </animated.mesh>
  );
}

function Images({ mouse, scrollMax }) {
  return data.map(([url, x, y, factor, z, scale], index) => (
    <Image
      key={index}
      url={url}
      scale={scale}
      opacity={mouse.interpolate([0, 500], [0, 1])}
      position={interpolate([mouse], mouse => [
        (-mouse[0] * factor) / 50000 + x,
        (mouse[1] * factor) / 50000 +
          y * 1.15 +
          ((100 * factor) / scrollMax) * 2,
        z + 100 / 2000
      ])}
    />
  ));
}

function Background({ color }) {
  const { viewport } = useThree();
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  );
}

function Scene({ mouse }) {
  const { size } = useThree();
  const scrollMax = size.height * 4.5;
  return (
    <>
      <animatedspotLight
        intensity={1.2}
        color="white"
        position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])}
      />

      <Background color={'#27282F'} />

      <Images mouse={mouse} scrollMax={scrollMax} />
    </>
  );
}

function Thing() {
  const ref = useRef();
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  useFrame(
    () => (ref.current.rotation.x = ref.current.rotation.y += rotationSpeed)
  );
  return (
    <mesh
      ref={ref}
      onClick={e => console.log('click')}
      onPointerOver={e => setRotationSpeed(0.05)}
      onPointerOut={e => setRotationSpeed(0.01)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
}

const Three = () => {
  // This tiny spring right here controlls all(!) the animations, one for scroll, the other for mouse movement ...
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] }));
  const move = useCallback(
    ({ clientX: x, clientY: y }) =>
      set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  );
  // const onScroll = useCallback(e => set({ top: e.target.scrollTop }), []);
  return (
    <>
      <Canvas className="canvas" onMouseMove={move}>
        <Scene mouse={mouse} />
      </Canvas>
    </>
  );
};

export default Three;
