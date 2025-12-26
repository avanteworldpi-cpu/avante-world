import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

// ⭐ Required for Ready Player Me (VRM models)
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

export interface LoadedAvatar {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  mixer: THREE.AnimationMixer;
}

const loader = new GLTFLoader();

// VRM support for Ready Player Me
loader.register((parser) => {
  return new VRMLoaderPlugin(parser);
});

// DRACO decompression
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

// KTX2 texture support
const ktx2Loader = new KTX2Loader();
ktx2Loader
  .setTranscoderPath('https://www.gstatic.com/basis-universal/decoders/')
  .detectSupport(new THREE.WebGLRenderer());
loader.setKTX2Loader(ktx2Loader);

loader.crossOrigin = 'anonymous';

// ---------------------------------------------------------
// READY PLAYER ME URL FIX
// ---------------------------------------------------------
function normalizeRPMUrl(url: string): string {
  if (!url.includes('readyplayer.me')) return url;

  // Always append ?meshLod=0 for full quality
  if (!url.includes('.glb')) return `${url}.glb?meshLod=0`;

  return url;
}

// ---------------------------------------------------------
// MAIN AVATAR LOADER — NOW VRM COMPATIBLE
// ---------------------------------------------------------
export async function loadAvatarGLB(url: string): Promise<LoadedAvatar> {
  const finalUrl = normalizeRPMUrl(url);

  return new Promise((resolve, reject) => {
    loader.load(
      finalUrl,

      (gltf) => {
        // Check if this is a VRM model
        const vrm = gltf.userData.vrm as VRM | undefined;

        let scene: THREE.Group;

        if (vrm) {
          // Fix rotations & unnormalized bones for VRM
          VRMUtils.removeUnnecessaryJoints(vrm.scene);
          scene = vrm.scene;
        } else {
          // Regular GLTF model
          scene = gltf.scene;
        }

        const animations = gltf.animations || [];
        const mixer = new THREE.AnimationMixer(scene);

        scene.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        // RPM avatars are properly scaled
        scene.scale.set(1.0, 1.0, 1.0);
        scene.position.set(0, 0, 0);

        resolve({
          scene,
          animations,
          mixer,
        });
      },

      undefined,

      (error) => {
        console.error('RPM Avatar failed to load:', error);
        reject(error);
      }
    );
  });
}

// ---------------------------------------------------------
// ANIMATION HELPERS
// ---------------------------------------------------------
export function getAnimationClip(
  animations: THREE.AnimationClip[],
  name: string
): THREE.AnimationClip | undefined {
  return animations.find((clip) =>
    clip.name.toLowerCase().includes(name.toLowerCase())
  );
}

export function playAnimation(
  mixer: THREE.AnimationMixer,
  animationClip: THREE.AnimationClip,
  loop: boolean = true
): THREE.AnimationAction {
  const action = mixer.clipAction(animationClip);
  action.clampWhenFinished = !loop;
  action.play();
  return action;
}

export function stopAnimation(action: THREE.AnimationAction): void {
  action.stop();
}

// ---------------------------------------------------------
// FALLBACK PLACEHOLDER SPHERE CHARACTER
// ---------------------------------------------------------
export function createIdleCharacter(): THREE.Group {
  const group = new THREE.Group();

  const geometry = new THREE.CapsuleGeometry(0.3, 1.5, 8, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0x6495ed,
    metalness: 0.1,
    roughness: 0.8,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.y = 0.75;
  group.add(mesh);

  const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
  const headMesh = new THREE.Mesh(headGeometry, material);
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  headMesh.position.set(0, 2, 0);
  group.add(headMesh);

  return group;
}
