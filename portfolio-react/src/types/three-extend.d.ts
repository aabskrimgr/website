// Type extensions for React Three Fiber
import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
    directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    hemisphereLight: Object3DNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>;
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    pointsMaterial: Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
    bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
  }
}
