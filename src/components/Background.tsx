import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useCart } from '../providers/Cart';

export default function Background() {
  const { lastAdded } = useCart()
  const refCanvas = useRef(null)

  const world = useRef(new CANNON.World()).current
  world.broadphase = new CANNON.SAPBroadphase(world)
  world.allowSleep = true
  world.gravity.set(0, -9.82, 0)

  const defaultMaterial = new CANNON.Material('default')
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.9,
      restitution: 0.1,
    }
  )
  world.addContactMaterial(defaultContactMaterial)
  world.defaultContactMaterial = defaultContactMaterial

  const floorShape = new CANNON.Plane()
  const floorBody = new CANNON.Body()
  floorBody.mass = 0
  floorBody.addShape(floorShape)
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
  world.addBody(floorBody)

  const objectsToUpdate = useRef([] as { mesh: any, body: any, id: string }[]).current
  const scene = useRef(new THREE.Scene()).current
  scene.background = new THREE.Color(0xffffff);

  const axesHelper = new THREE.AxesHelper(1);
  // scene.add(axesHelper);
  
  const loader = new GLTFLoader();
  const objects = useRef(new Map()).current
  loader.load('/coca_cola_bottle/scene.gltf', (gltf) => {
    gltf.scene.scale.set(3.2, 3.2, 3.2)
    objects.set('14', gltf.scene)
    // scene.add(gltf.scene)
    // console.log(gltf.scene)
  })
  loader.load('/tomato/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.01, 0.01, 0.01)
    objects.set('16', gltf.scene)
  })
  loader.load('/burger/scene.gltf', (gltf) => {
    gltf.scene.scale.set(2.5, 2.5, 2.5)
    gltf.scene.position.y = 2.5
    objects.set('18', gltf.scene)
  })
  loader.load('/croissant/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    objects.set('20', gltf.scene)
  })
  loader.load('/sprite/scene.gltf', (gltf) => {
    gltf.scene.scale.set(3, 3, 3)
    objects.set('52', gltf.scene)
  })
  loader.load('/lettuce/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.01, 0.01, 0.01)
    objects.set('54', gltf.scene)
  })

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 4, 9)
  // camera.lookAt(0, 0, 0)

  let clock = useRef(new THREE.Clock())
  let oldElapsedTime = useRef(0)
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: refCanvas.current!, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, renderer.domElement);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', handleResize)

    const light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    camera.position.z = 5;
    let animationFrameId: number | null = null
    function animate() {
      // const elapsedTime = clock.current.getElapsedTime()
      // const deltaTime = elapsedTime - oldElapsedTime.current
      // oldElapsedTime.current = elapsedTime

      // world.step(1/60, deltaTime, 3)

      // for (const object of objectsToUpdate) {
      //   object.mesh.position.copy(object.body.position)
      //   object.mesh.position.y -= 0.5
      //   object.mesh.quaternion.copy(object.body.quaternion)
      // }

      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId!)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    console.log('itemDiff', lastAdded)
    if (!lastAdded) return
    if (lastAdded.action === 'del') {
      const objectsToUpdateClone = [...objectsToUpdate]
      objectsToUpdateClone.reverse()
      const item = objectsToUpdateClone.find(o => o.id === lastAdded.item)
      objectsToUpdate.splice(objectsToUpdate.indexOf(item!), 1)
      if (!item) return
      scene.remove(item!.mesh)
      // dispose item
      return
    }
    console.log(objects)
    const item = objects.get(lastAdded.item)
    const mesh = item.clone()
    // const mesh = new THREE.Group()
    // mesh.add(clone)
    mesh.position.copy({ x: (Math.random() - 0.5) * 3, y: 0, z: (Math.random() - 0.5) * 3 })

    // const mesh = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.5, 20, 20),
    //   new THREE.MeshStandardMaterial({
    //     metalness: 0.3,
    //     roughness: 0.4,
    //   })
    // )

    // mesh.position.copy({ x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 })
    // mesh.position.copy({ x: 0, y: 3, z: 0 })
    const size = Math.random() * 10
    // mesh.scale.set(size, size, size)
    scene.add(mesh)

    // const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    // const body = new CANNON.Body({
    //   mass: 1,
    //   position: new CANNON.Vec3(0, 3, 0),
    //   shape,
    //   material: defaultContactMaterial
    // })
    // body.position.copy(mesh.position)
    // world.addBody(body)

    objectsToUpdate.push({ mesh , body: null, id: lastAdded.item})
  }, [lastAdded])

  return (
    <canvas ref={refCanvas} />
  )
}
