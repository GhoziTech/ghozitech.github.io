import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

interface InteractionState {
  x: number
  y: number
  dragging: boolean
}

function HeadModel({ interaction, motionEnabled }: { interaction: MutableRefObject<InteractionState>; motionEnabled: boolean }) {
  const gltf = useLoader(GLTFLoader, '/models/hafid-avatar.glb')
  const scene = useMemo(() => cloneSkeleton(gltf.scene), [gltf.scene])
  const group = useRef<THREE.Group>(null)
  const mixer = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const nextMaterials = sourceMaterials.map((material) => {
        if ('clone' in material) {
          const next = material.clone() as THREE.MeshStandardMaterial
          next.roughness = Math.max(0.34, Number(next.roughness ?? 0.5) * 0.95)
          next.metalness = Math.min(0.18, Number(next.metalness ?? 0.04) + 0.02)
          return next
        }
        return material
      })
      mesh.material = Array.isArray(mesh.material) ? nextMaterials : nextMaterials[0]
    })

    if (gltf.animations.length) {
      mixer.current = new THREE.AnimationMixer(scene)
      gltf.animations.forEach((clip) => mixer.current?.clipAction(clip).play())
    }

    return () => { mixer.current?.stopAllAction() }
  }, [scene, gltf.animations])

  useFrame((_, delta) => {
    mixer.current?.update(delta)
    if (!group.current) return

    const targetY = interaction.current.x * 0.95
    const targetX = interaction.current.y * 0.28

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, motionEnabled ? 0.08 : 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, motionEnabled ? 0.08 : 0.04)
  })

  return (
    <group ref={group} scale={[2.25, 2.25, 2.25]} position={[0, -0.6, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function CameraAim() {
  const { camera } = useThree()
  useFrame(() => {
    camera.lookAt(0, 0.98, 0)
  })
  return null
}

function Scene({ interaction, motionEnabled }: { interaction: MutableRefObject<InteractionState>; motionEnabled: boolean }) {
  return (
    <>
      <color attach="background" args={['#0a1017']} />
      <ambientLight intensity={0.98} />
      <hemisphereLight intensity={0.6} color="#effcff" groundColor="#05070a" />
      <directionalLight position={[2.3, 3.6, 3]} intensity={2.2} color="#ffffff" castShadow />
      <pointLight position={[2.2, 1.6, 2.1]} intensity={8.5} color="#84f4ff" distance={10} />
      <pointLight position={[-2.1, 1.35, 1.8]} intensity={5.4} color="#8d73ff" distance={8} />
      <CameraAim />
      <HeadModel interaction={interaction} motionEnabled={motionEnabled} />
    </>
  )
}

export function ProfileHeadCanvas({ motionEnabled = true }: { motionEnabled?: boolean }) {
  const interaction = useRef<InteractionState>({ x: 0, y: 0, dragging: false })
  const [hint, setHint] = useState('Drag to rotate')

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interaction.current.dragging) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    interaction.current.x = THREE.MathUtils.clamp(x, -1, 1)
    interaction.current.y = THREE.MathUtils.clamp(y, -1, 1)
  }

  return (
    <div
      className="profile-head-canvas"
      onPointerDown={(event) => {
        interaction.current.dragging = true
        event.currentTarget.setPointerCapture(event.pointerId)
        setHint('Rotating…')
        updatePointer(event)
      }}
      onPointerMove={updatePointer}
      onPointerUp={(event) => {
        interaction.current.dragging = false
        event.currentTarget.releasePointerCapture(event.pointerId)
        setHint('Drag to rotate')
      }}
      onPointerLeave={() => {
        interaction.current.dragging = false
        setHint('Drag to rotate')
      }}
    >
      <Canvas camera={{ position: [0, 1.18, 1.12], fov: 15, near: 0.1, far: 20 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <Scene interaction={interaction} motionEnabled={motionEnabled} />
      </Canvas>
      <div className="profile-head-overlay" aria-hidden="true">
        <span>3D HEAD / ROTATE</span>
        <small>{hint}</small>
      </div>
    </div>
  )
}
