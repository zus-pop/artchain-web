import { useGLTF } from "@react-three/drei";
import { JSX } from "react";

const url =
  "https://firebasestorage.googleapis.com/v0/b/artchain-c46a7.firebasestorage.app/o/3D-models%2Fbake-exhibition-transformed.glb?alt=media&token=60e7c130-d3b7-41fe-9781-62eecca0b8ce";
export function Exhibition(props: JSX.IntrinsicElements["group"]) {
  const object = useGLTF(url);
  return <primitive object={object.scene} {...props} />;
}

useGLTF.preload(url);
