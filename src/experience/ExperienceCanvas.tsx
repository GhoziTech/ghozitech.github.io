import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

const trackedPointer = new THREE.Vector2()
let pointerHasMoved = false

interface ExperienceCanvasProps {
  progress: MutableRefObject<number>
  motionEnabled: boolean
}

function range(value: number, start: number, end: number) {
  return THREE.MathUtils.clamp((value - start) / (end - start), 0, 1)
}

function bell(value: number, start: number, peak: number, end: number) {
  if (value <= start || value >= end) return 0
  return value < peak ? range(value, start, peak) : 1 - range(value, peak, end)
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="webgl-fallback" /> : this.props.children }
}

function CameraRig({ progress, motionEnabled }: ExperienceCanvasProps) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, delta) => {
    const p = progress.current
    const pointerScale = motionEnabled ? 0.22 : 0
    target.set(
      Math.sin(p * Math.PI * 3.1) * 0.55 + trackedPointer.x * pointerScale,
      Math.cos(p * Math.PI * 2.1) * 0.18 + trackedPointer.y * pointerScale * 0.55,
      7.3 - Math.sin(p * Math.PI) * 1.35,
    )
    camera.position.lerp(target, 1 - Math.exp(-delta * 2.5))
    camera.lookAt(0, 0, p > 0.56 ? -1.2 : 0)
  })
  return null
}

const identityTextureUrls = [
  '/identity/hafid-original.webp',
  '/identity/hafid-anaglyph.webp',
  '/identity/hafid-hologram.webp',
  '/identity/hafid-chrome.webp',
] as const

const portraitVertex = /* glsl */`
  uniform float uTime;
  uniform float uMode;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    transformed.z += sin(uv.y * 10.0 + uTime * 0.35) * 0.002 * smoothstep(0.8, 3.2, uMode);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const portraitFragment = /* glsl */`
  uniform sampler2D uOriginal;
  uniform sampler2D uAnaglyph;
  uniform sampler2D uHologram;
  uniform sampler2D uChrome;
  uniform float uTime;
  uniform float uMode;
  uniform float uVelocity;
  uniform float uOpacity;
  varying vec2 vUv;

  vec3 identityColor(vec2 uv, float mode) {
    vec3 original = texture2D(uOriginal, uv).rgb;
    vec3 anaglyph = texture2D(uAnaglyph, uv).rgb;
    vec3 hologram = texture2D(uHologram, uv).rgb;
    vec3 chrome = texture2D(uChrome, uv).rgb;

    if (mode < 1.0) return mix(original, anaglyph, smoothstep(0.0, 1.0, mode));
    if (mode < 2.0) return mix(anaglyph, hologram, smoothstep(1.0, 2.0, mode));
    return mix(hologram, chrome, smoothstep(2.0, 3.0, mode));
  }

  void main() {
    vec2 uv = vUv;
    vec3 color = identityColor(uv, clamp(uMode, 0.0, 3.0));
    float scan = sin((uv.y + uTime * 0.035) * 360.0) * 0.5 + 0.5;
    float gloss = sin((uv.x + uv.y + uTime * 0.12) * 10.0) * 0.5 + 0.5;
    float intensity = smoothstep(0.5, 3.0, uMode);
    color += vec3(0.06, 0.14, 0.18) * scan * intensity * 0.22;
    color += vec3(0.04, 0.1, 0.18) * gloss * intensity * 0.12;
    float vignette = smoothstep(1.02, 0.26, distance(vUv, vec2(0.5)));
    color *= 0.82 + vignette * 0.26;
    gl_FragColor = vec4(color, uOpacity);
  }
`

function PortraitReactor({ progress, motionEnabled }: ExperienceCanvasProps) {
  const loadedTextures = useLoader(THREE.TextureLoader, [...identityTextureUrls]) as THREE.Texture[]
  const [original, anaglyph, hologram, chrome] = loadedTextures
  const material = useRef<THREE.ShaderMaterial>(null)
  const group = useRef<THREE.Group>(null)
  const velocity = useRef(0)
  const previousPointer = useRef(new THREE.Vector2())
  const currentMode = useRef(0)
  const { viewport } = useThree()

  useEffect(() => {
    ;[original, anaglyph, hologram, chrome].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    })
  }, [original, anaglyph, hologram, chrome])

  const uniforms = useMemo(() => ({
    uOriginal: { value: original },
    uAnaglyph: { value: anaglyph },
    uHologram: { value: hologram },
    uChrome: { value: chrome },
    uTime: { value: 0 },
    uMode: { value: 0 },
    uVelocity: { value: 0 },
    uOpacity: { value: 1 },
    uPointer: { value: new THREE.Vector2() },
  }), [original, anaglyph, hologram, chrome])

  useFrame((state) => {
    if (!material.current || !group.current) return
    const p = progress.current
    const hero = range(p, 0, 0.16)
    const humanReturn = bell(p, 0.84, 0.9, 0.955)
    const opacity = Math.max(1 - range(p, 0.105, 0.19), humanReturn * 0.64)
    const pointerDelta = previousPointer.current.distanceTo(trackedPointer)
    previousPointer.current.copy(trackedPointer)
    velocity.current = THREE.MathUtils.lerp(velocity.current, motionEnabled ? Math.min(pointerDelta * 19, 1) : 0, 0.12)

    const pointerMode = pointerHasMoved && motionEnabled ? (trackedPointer.x + 1) * 1.5 : 0
    const scrollMode = hero * 3
    const targetMode = THREE.MathUtils.clamp(Math.max(pointerMode, scrollMode), 0, 3)
    currentMode.current = THREE.MathUtils.lerp(currentMode.current, targetMode, 0.075)

    material.current.uniforms.uTime.value = state.clock.elapsedTime
    material.current.uniforms.uMode.value = currentMode.current
    material.current.uniforms.uVelocity.value = velocity.current
    material.current.uniforms.uOpacity.value = opacity
    material.current.uniforms.uPointer.value.lerp(trackedPointer, 0.1)

    const desktop = viewport.width > 7
    const targetX = desktop ? 2.05 - hero * 0.42 : 0
    const targetY = desktop ? -0.04 + humanReturn * 0.28 : 0.74 - hero * 0.38
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.06)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.06)
    group.current.position.z = -0.08 - hero * 0.35
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, motionEnabled ? trackedPointer.x * 0.055 + hero * 0.12 : 0, 0.08)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, motionEnabled ? -trackedPointer.y * 0.03 : 0, 0.08)
    const scale = desktop ? 3.55 : Math.min(3.25, viewport.width * 0.76)
    group.current.scale.setScalar(scale * (1 - hero * 0.07))
  })

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[0.75, 1, 88, 116]} />
        <shaderMaterial ref={material} vertexShader={portraitVertex} fragmentShader={portraitFragment} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[0.79, 1.04]} />
        <meshBasicMaterial color="#65e7ff" transparent opacity={0.065} depthWrite={false} />
      </mesh>
    </group>
  )
}

function AvatarMonolith({ progress, motionEnabled }: ExperienceCanvasProps) {
  const gltf = useLoader(GLTFLoader, '/models/hafid-avatar.glb')
  const avatar = useMemo(() => cloneSkeleton(gltf.scene), [gltf.scene])
  const group = useRef<THREE.Group>(null)
  const materials = useRef<THREE.Material[]>([])
  const target = useMemo(() => new THREE.Vector3(), [])
  const { viewport } = useThree()

  useEffect(() => {
    const collected: THREE.Material[] = []
    avatar.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.frustumCulled = false
      const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const cloned = source.map((material) => {
        const next = material.clone()
        next.transparent = true
        next.opacity = 0
        next.depthWrite = true
        if ('envMapIntensity' in next) (next as THREE.MeshStandardMaterial).envMapIntensity = 1.1
        collected.push(next)
        return next
      })
      mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0]
    })
    materials.current = collected
  }, [avatar])

  useFrame((state) => {
    if (!group.current) return
    const profileStage = bell(progress.current, 0.095, 0.165, 0.255)
    const humanStage = bell(progress.current, 0.815, 0.875, 0.945)
    const visibility = Math.max(profileStage, humanStage)
    group.current.visible = visibility > 0.015
    if (!group.current.visible) return

    const desktop = viewport.width > 7
    const humanDominant = humanStage > profileStage
    target.set(
      desktop ? (humanDominant ? -2.35 : 2.45) : 0,
      desktop ? -2.22 : -2.35,
      humanDominant ? -1.15 : -1.45,
    )
    group.current.position.lerp(target, 0.065)
    const pointerRotation = motionEnabled ? trackedPointer.x * 0.16 : 0
    const targetRotation = (humanDominant ? 0.35 : -0.42) + pointerRotation
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, 0.055)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, motionEnabled ? trackedPointer.y * 0.025 : 0, 0.05)
    const scale = desktop ? 2.32 : 1.92
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.15) * 0.006 * visibility
    group.current.scale.setScalar(scale * pulse)
    materials.current.forEach((material) => {
      material.opacity = visibility
      material.depthWrite = visibility > 0.72
    })
  })

  return (
    <group ref={group}>
      <primitive object={avatar} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.42, 0.62, 96]} />
        <meshBasicMaterial color="#65e7ff" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

function DigitalTwinGhost({ progress, motionEnabled }: ExperienceCanvasProps) {
  const gltf = useLoader(GLTFLoader, '/models/hafid-digital-twin.glb')
  const twin = useMemo(() => cloneSkeleton(gltf.scene), [gltf.scene])
  const group = useRef<THREE.Group>(null)
  const materials = useRef<THREE.MeshBasicMaterial[]>([])

  useEffect(() => {
    const collected: THREE.MeshBasicMaterial[] = []
    twin.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.frustumCulled = false
      const material = new THREE.MeshBasicMaterial({
        color: '#65e7ff',
        wireframe: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      mesh.material = material
      collected.push(material)
    })
    materials.current = collected
    return () => collected.forEach((material) => material.dispose())
  }, [twin])

  useFrame((state) => {
    if (!group.current) return
    const visibility = bell(progress.current, 0.105, 0.17, 0.245)
    group.current.visible = visibility > 0.015
    if (!group.current.visible) return
    group.current.position.set(2.82, -2.2, -1.82)
    group.current.scale.setScalar(2.34)
    group.current.rotation.y = -0.58 + (motionEnabled ? trackedPointer.x * 0.12 : 0) + Math.sin(state.clock.elapsedTime * 0.28) * 0.025
    materials.current.forEach((material) => { material.opacity = visibility * 0.12 })
  })

  return <group ref={group}><primitive object={twin} /></group>
}

function AvatarSystems(props: ExperienceCanvasProps) {
  const { viewport } = useThree()
  return (
    <>
      <Suspense fallback={null}><AvatarMonolith {...props} /></Suspense>
      {viewport.width > 6.5 && <Suspense fallback={null}><DigitalTwinGhost {...props} /></Suspense>}
    </>
  )
}

function BackgroundField({ progress, motionEnabled }: ExperienceCanvasProps) {
  const points = useRef<THREE.Points>(null)
  const count = 650
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    let seed = 19
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random() - 0.5) * 18
      positions[i * 3 + 1] = (random() - 0.5) * 12
      positions[i * 3 + 2] = -random() * 18 + 4
    }
    const result = new THREE.BufferGeometry()
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return result
  }, [])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * (motionEnabled ? 0.012 : 0)
    points.current.rotation.x = Math.sin(progress.current * Math.PI * 2) * 0.06
    const material = points.current.material as THREE.PointsMaterial
    material.opacity = 0.26 + Math.sin(state.clock.elapsedTime * 0.4) * 0.04
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color="#7defff" size={0.025} transparent opacity={0.28} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function ReactorCore({ progress, motionEnabled }: ExperienceCanvasProps) {
  const group = useRef<THREE.Group>(null)
  const materials = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame((state, delta) => {
    if (!group.current) return
    const p = progress.current
    const heroOpacity = bell(p, 0.04, 0.14, 0.3)
    const skillOpacity = bell(p, 0.72, 0.82, 0.92)
    const opacity = Math.max(heroOpacity * 0.35, skillOpacity)
    group.current.visible = opacity > 0.01
    group.current.rotation.x += delta * (motionEnabled ? 0.08 : 0)
    group.current.rotation.y += delta * (motionEnabled ? 0.13 : 0)
    group.current.position.set(p > 0.65 ? 0 : -2.3, p > 0.65 ? 0 : -0.4, -1.8)
    group.current.scale.setScalar(0.8 + skillOpacity * 1.2)
    materials.current.forEach((material) => { material.opacity = opacity * 0.55 })
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.025 * opacity
    group.current.scale.multiplyScalar(pulse)
  })
  const register = (material: THREE.MeshBasicMaterial | null) => {
    if (material && !materials.current.includes(material)) materials.current.push(material)
  }
  return (
    <group ref={group}>
      {[1.1, 1.45, 1.8].map((radius, index) => (
        <mesh key={radius} rotation={[index * 0.8, index * 0.55, index * 0.25]}>
          <torusGeometry args={[radius, 0.018 + index * 0.006, 10, 120]} />
          <meshBasicMaterial ref={register} color={index === 1 ? '#9b7cff' : '#65e7ff'} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.58, 2]} />
        <meshPhysicalMaterial color="#0c2732" emissive="#143b45" emissiveIntensity={0.7} roughness={0.28} metalness={0.88} clearcoat={1} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function ProjectCorridor({ progress, motionEnabled }: ExperienceCanvasProps) {
  const group = useRef<THREE.Group>(null)
  const materials = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame((_, delta) => {
    if (!group.current) return
    const p = range(progress.current, 0.2, 0.55)
    const visible = bell(progress.current, 0.17, 0.36, 0.59)
    group.current.visible = visible > 0.01
    group.current.position.z = 1.5 + p * 9
    group.current.rotation.z = Math.sin(p * Math.PI * 2) * 0.04
    if (motionEnabled) group.current.rotation.y += delta * 0.025
    materials.current.forEach((material) => { material.opacity = visible * 0.32 })
  })
  const register = (material: THREE.MeshBasicMaterial | null) => {
    if (material && !materials.current.includes(material)) materials.current.push(material)
  }
  return (
    <group ref={group}>
      {Array.from({ length: 9 }, (_, index) => {
        const z = -index * 2.35
        return (
          <group key={index} position={[0, 0, z]} rotation={[0, 0, index % 2 ? 0.035 : -0.035]}>
            <mesh position={[-3.3, 0, 0]}><boxGeometry args={[0.045, 4.7, 0.045]} /><meshBasicMaterial ref={register} color="#65e7ff" transparent opacity={0} /></mesh>
            <mesh position={[3.3, 0, 0]}><boxGeometry args={[0.045, 4.7, 0.045]} /><meshBasicMaterial ref={register} color="#9b7cff" transparent opacity={0} /></mesh>
            <mesh position={[0, 2.35, 0]}><boxGeometry args={[6.65, 0.045, 0.045]} /><meshBasicMaterial ref={register} color="#65e7ff" transparent opacity={0} /></mesh>
            <mesh position={[0, -2.35, 0]}><boxGeometry args={[6.65, 0.045, 0.045]} /><meshBasicMaterial ref={register} color="#9b7cff" transparent opacity={0} /></mesh>
          </group>
        )
      })}
    </group>
  )
}

function CertificateCloud({ progress, motionEnabled }: ExperienceCanvasProps) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])
  useFrame((state) => {
    if (!group.current) return
    const visible = bell(progress.current, 0.48, 0.61, 0.74)
    const p = range(progress.current, 0.48, 0.74)
    group.current.visible = visible > 0.01
    group.current.rotation.y = (p - 0.5) * 0.65 + (motionEnabled ? Math.sin(state.clock.elapsedTime * 0.22) * 0.04 : 0)
    group.current.position.y = (0.5 - p) * 0.8
    mats.current.forEach((mat) => { mat.opacity = visible * 0.16 })
  })
  const register = (mat: THREE.MeshStandardMaterial | null) => {
    if (mat && !mats.current.includes(mat)) mats.current.push(mat)
  }
  return (
    <group ref={group} position={[0, 0, -1.8]}>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = (index / 9) * Math.PI * 2
        return (
          <mesh key={index} position={[Math.cos(angle) * 3.5, Math.sin(angle) * 2.1, -Math.abs(Math.sin(angle)) * 1.8]} rotation={[0.08 * Math.sin(angle), -angle * 0.18, angle * 0.09]}>
            <planeGeometry args={[1.6, 1.08]} />
            <meshStandardMaterial ref={register} color={index % 2 ? '#dffbff' : '#ddd6fe'} metalness={0.15} roughness={0.35} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        )
      })}
    </group>
  )
}

function ContactPortal({ progress, motionEnabled }: ExperienceCanvasProps) {
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state, delta) => {
    if (!group.current || !material.current) return
    const visible = range(progress.current, 0.9, 0.985)
    group.current.visible = visible > 0.01
    group.current.scale.setScalar(0.2 + visible * 2.8)
    group.current.rotation.z += delta * (motionEnabled ? 0.1 : 0)
    group.current.position.z = -1.6 + visible * 0.5
    material.current.opacity = visible * (0.32 + Math.sin(state.clock.elapsedTime * 1.2) * 0.05)
  })
  return (
    <group ref={group}>
      <mesh><torusGeometry args={[1.25, 0.04, 16, 160]} /><meshBasicMaterial ref={material} color="#6ef2ff" transparent opacity={0} depthWrite={false} /></mesh>
      <mesh rotation={[0.2, 0.4, 0.3]}><torusGeometry args={[1.55, 0.012, 8, 160]} /><meshBasicMaterial color="#a78bfa" transparent opacity={0.24} depthWrite={false} /></mesh>
    </group>
  )
}

function Scene({ progress, motionEnabled }: ExperienceCanvasProps) {
  return (
    <>
      <color attach="background" args={['#05070a']} />
      <fog attach="fog" args={['#05070a', 7, 20]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[2.5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[4, 4, 5]} intensity={5.5} color="#78efff" distance={16} />
      <pointLight position={[-4, -2, 4]} intensity={3.6} color="#8b6cff" distance={15} />
      <CameraRig progress={progress} motionEnabled={motionEnabled} />
      <BackgroundField progress={progress} motionEnabled={motionEnabled} />
      <Suspense fallback={null}><PortraitReactor progress={progress} motionEnabled={motionEnabled} /></Suspense>
    </>
  )
}

export function ExperienceCanvas({ progress, motionEnabled }: ExperienceCanvasProps) {
  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      const portraitActive = document.body.dataset.portraitActive === 'true'
      pointerHasMoved = portraitActive
      if (!portraitActive) {
        trackedPointer.lerp(new THREE.Vector2(0, 0), 0.2)
        return
      }
      trackedPointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
    }
    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => window.removeEventListener('pointermove', updatePointer)
  }, [])

  return (
    <CanvasBoundary>
      <div className="experience-canvas" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 7.3], fov: 34, near: 0.1, far: 60 }} dpr={[1, 1.65]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
          <Scene progress={progress} motionEnabled={motionEnabled} />
        </Canvas>
      </div>
    </CanvasBoundary>
  )
}
