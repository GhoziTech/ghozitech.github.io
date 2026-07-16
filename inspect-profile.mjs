import fs from 'fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const data = await fs.readFile('./public/models/profile-body.glb');
const loader = new GLTFLoader();
const gltf = await loader.parseAsync(data.buffer, '');
const box = new THREE.Box3().setFromObject(gltf.scene);
const size = new THREE.Vector3(); const center = new THREE.Vector3(); box.getSize(size); box.getCenter(center);
console.log('bbox', box.min.toArray(), box.max.toArray(), 'size', size.toArray(), 'center', center.toArray());
console.log('animations', gltf.animations.map(a=>({name:a.name,duration:a.duration,tracks:a.tracks.length})));
let count=0;
gltf.scene.traverse((c)=>{if(c.isMesh){count++; console.log('mesh', c.name)}});
console.log('meshes',count)
