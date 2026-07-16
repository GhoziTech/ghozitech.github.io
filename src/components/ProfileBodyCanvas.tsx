import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

gsap.registerPlugin(ScrollTrigger)

function BodyModel({
  playing,
  motionEnabled,
  pointer,
  scrollProgress,
}: {
  playing: boolean
  motionEnabled: boolean
  pointer: MutableRefObject<THREE.Vector2>
  scrollProgress: MutableRefObject<number>
}) {
  const gltf = useLoader(GLTFLoader, '/models/profile-body.glb')
  const scene = useMemo(() => cloneSkeleton(gltf.scene), [gltf.scene])
  const { camera, viewport } = useThree()
  const group = useRef<THREE.Group>(null)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const clipDuration = useRef(0)
  const initialized = useRef(false)

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    return {
      size,
      center,
      minY: box.min.y,
    }
  }, [scene])

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const next = materials.map((material) => {
        if (!('clone' in material)) return material
        const cloned = material.clone() as THREE.MeshStandardMaterial
        cloned.roughness = Math.max(0.36, Number(cloned.roughness ?? 0.6) * 0.88)
        cloned.metalness = Math.min(0.22, Number(cloned.metalness ?? 0.02) + 0.03)
        if ('envMapIntensity' in cloned) cloned.envMapIntensity = 1.1
        return cloned
      })
      mesh.material = Array.isArray(mesh.material) ? next : next[0]
    })

    if (gltf.animations.length) {
      mixer.current = new THREE.AnimationMixer(scene)
      const clip = gltf.animations[0]
      clipDuration.current = clip.duration
      const action = mixer.current.clipAction(clip)
      action.reset().setLoop(THREE.LoopRepeat, Infinity).play()
      action.setEffectiveWeight(1)
    }

    return () => {
      mixer.current?.stopAllAction()
      mixer.current = null
    }
  }, [scene, gltf.animations])

  useFrame((state, delta) => {
    const progress = scrollProgress.current

    if (playing && mixer.current) {
      const entranceProgress = THREE.MathUtils.clamp(progress / 0.26, 0, 1)
      if (progress < 0.26 && clipDuration.current > 0) {
        mixer.current.setTime(clipDuration.current * (0.03 + entranceProgress * 0.31))
      } else {
        mixer.current.update(delta * 0.72)
      }
    }

    if (!group.current) return

    const currentViewport = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 1.42, 0))
    // Height is the priority: the character should occupy about 88–90% of the right column.
    const heightScale = (currentViewport.height * 0.89) / Math.max(fit.size.y, 0.001)
    // Only a very generous safety cap prevents extreme horizontal clipping in narrow layouts.
    const widthSafetyScale = (currentViewport.width * 1.18) / Math.max(fit.size.x, 0.001)
    const fitScale = Math.min(heightScale, widthSafetyScale)

    const basePosition = new THREE.Vector3(
      -fit.center.x * fitScale,
      -fit.minY * fitScale - 0.025,
      -fit.center.z * fitScale,
    )

    const scrollTurn = (progress - 0.5) * 0.46
    const pointerTurn = motionEnabled ? pointer.current.x * 0.2 : 0
    const pointerTilt = motionEnabled ? pointer.current.y * 0.055 : 0
    const idleTurn = motionEnabled ? Math.sin(state.clock.elapsedTime * 0.22) * 0.035 : 0
    const floatY = motionEnabled ? Math.sin(state.clock.elapsedTime * 0.72) * 0.018 : 0
    const scaleBoost = 1 + Math.sin(Math.min(1, progress) * Math.PI) * 0.035
    const finalScale = fitScale * scaleBoost

    if (!initialized.current) {
      group.current.scale.setScalar(finalScale)
      group.current.position.copy(basePosition)
      initialized.current = true
    }

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, scrollTurn + pointerTurn + idleTurn, 0.06)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointerTilt, 0.06)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, basePosition.x + pointer.current.x * 0.1, 0.07)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, basePosition.y + floatY + pointer.current.y * 0.035, 0.07)
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, basePosition.z, 0.07)
    group.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.07)
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

function CameraRig({
  pointer,
  scrollProgress,
}: {
  pointer: MutableRefObject<THREE.Vector2>
  scrollProgress: MutableRefObject<number>
}) {
  const { camera, size } = useThree()

  useFrame(() => {
    const perspective = camera as THREE.PerspectiveCamera
    const aspect = size.width / Math.max(size.height, 1)
    const progress = scrollProgress.current
    const wide = aspect > 0.88
    const targetFov = wide ? 43 : 46
    const baseZ = wide ? 2.85 : 3.25
    const scrollZoom = Math.sin(Math.min(1, progress) * Math.PI) * 0.18
    const targetX = pointer.current.x * 0.18
    const targetY = 1.48 + pointer.current.y * 0.07 + (progress - 0.5) * 0.04
    const targetZ = baseZ - scrollZoom

    perspective.fov = THREE.MathUtils.lerp(perspective.fov, targetFov, 0.07)
    perspective.position.x = THREE.MathUtils.lerp(perspective.position.x, targetX, 0.065)
    perspective.position.y = THREE.MathUtils.lerp(perspective.position.y, targetY, 0.065)
    perspective.position.z = THREE.MathUtils.lerp(perspective.position.z, targetZ, 0.065)
    perspective.lookAt(pointer.current.x * 0.075, 1.42 + pointer.current.y * 0.045, 0)
    perspective.updateProjectionMatrix()
  })

  return null
}

function CursorLight({ pointer }: { pointer: MutableRefObject<THREE.Vector2> }) {
  const light = useRef<THREE.PointLight>(null)
  const { viewport } = useThree()

  useFrame(() => {
    if (!light.current) return
    const targetX = (pointer.current.x * viewport.width) / 2
    const targetY = 1.65 + (pointer.current.y * viewport.height) / 2
    light.current.position.x = THREE.MathUtils.lerp(light.current.position.x, targetX, 0.1)
    light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, targetY, 0.1)
    light.current.position.z = THREE.MathUtils.lerp(light.current.position.z, 2.05, 0.1)
  })

  return <pointLight ref={light} intensity={4.6} color="#00f0ff" distance={6.5} decay={2} />
}

function HologramProjector({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.1 + scrollProgress.current * 0.62
    group.current.children.forEach((child, index) => {
      if (index === 0 || !(child instanceof THREE.Mesh)) return
      const ringIndex = index - 1
      child.position.y = 0.08 + ((state.clock.elapsedTime * 0.14 + ringIndex * 0.35) % 1) * 2.75
      const material = child.material as THREE.MeshBasicMaterial
      material.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 1.1 + ringIndex) * 0.015
    })
  })

  return (
    <group ref={group} position={[0, 0.02, -0.08]}>
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[1.92, 3.0, 64, 1, true]} />
        <meshBasicMaterial color="#37eaff" transparent opacity={0.025} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} rotation-x={Math.PI / 2}>
          <ringGeometry args={[0.7 + index * 0.14, 0.72 + index * 0.14, 64]} />
          <meshBasicMaterial color={index % 2 === 0 ? '#6ef2ff' : '#9b7cff'} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Scene({
  playing,
  motionEnabled,
  pointer,
  scrollProgress,
}: {
  playing: boolean
  motionEnabled: boolean
  pointer: MutableRefObject<THREE.Vector2>
  scrollProgress: MutableRefObject<number>
}) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight intensity={0.78} color="#eaf9ff" groundColor="#091018" />
      <directionalLight position={[2.8, 4.6, 2.5]} intensity={2.15} color="#ffffff" castShadow />
      <pointLight position={[-2.0, 1.8, 2.2]} intensity={2.35} color="#9b7cff" distance={8} decay={2} />
      <CursorLight pointer={pointer} />
      <spotLight position={[0, 4.0, 2.5]} intensity={4.6} angle={0.48} penumbra={0.84} color="#c6fbff" castShadow />
      <HologramProjector scrollProgress={scrollProgress} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.03, 0]} receiveShadow>
        <circleGeometry args={[2.45, 72]} />
        <meshStandardMaterial color="#071019" roughness={0.94} metalness={0.04} transparent opacity={0.18} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.022, 0]}>
        <ringGeometry args={[1.42, 2.16, 72]} />
        <meshBasicMaterial color="#6ef2ff" transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <CameraRig pointer={pointer} scrollProgress={scrollProgress} />
      <BodyModel playing={playing} motionEnabled={motionEnabled} pointer={pointer} scrollProgress={scrollProgress} />
    </>
  )
}

export function ProfileBodyCanvas({ motionEnabled = true }: { motionEnabled?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const pointer = useRef(new THREE.Vector2())
  const scrollProgress = useRef(0)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? true), { threshold: 0.12 })
    observer.observe(node)

    const section = node.closest<HTMLElement>('#profile') ?? node
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
      pointer.current.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(-y, -1, 1))
    }
    const handleLeave = () => pointer.current.set(0, 0)

    node.addEventListener('pointermove', handleMove)
    node.addEventListener('pointerleave', handleLeave)

    return () => {
      observer.disconnect()
      scrollTrigger.kill()
      node.removeEventListener('pointermove', handleMove)
      node.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return (
    <div ref={rootRef} className="profile-body-canvas profile-body-canvas-full canvas-container">
      <Canvas
        shadows
        camera={{ position: [0, 1.48, 2.85], fov: 43, near: 0.1, far: 30 }}
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.setClearAlpha(0)
        }}
      >
        <Scene playing={visible} motionEnabled={motionEnabled} pointer={pointer} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
