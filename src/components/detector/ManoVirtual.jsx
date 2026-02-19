/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useRef, useEffect, memo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


const STRETCHED = 0;
const CURLED = Math.PI / 1.7;
const HALF = Math.PI / 2;
const QUARTER = Math.PI / 3;
const QUARTER2 = Math.PI / 5;
const VIEW_FRONT = { x: -Math.PI / 2, y: 0, z: 0 };
const VIEW_SIDE = { x: -Math.PI / 2, y: 0, z: -Math.PI / 3 };
const VIEW_QUARTER = { x: Math.PI / 2, y: 0, z: -Math.PI / 6 };
const VIEW_QUARTER2 = {
  x: -Math.PI / 1.9,
  y: -Math.PI / 1.5,
  z: -Math.PI * 0.4,
};

const VIEW_QUARTER3 = {
  x: -Math.PI / 1.5,
  y: -1.5,
  z: Math.PI  / -4,
};
const VIEW_MIDDLE = { x: -Math.PI / 2, y: -1.5, z: Math.PI * 4 };
const THUMB_DEFAULT = { x: 0, y: -Math.PI / 6, z: Math.PI / 6 };
const THUMB_TUCKED = { x: 0.5, y: -0.5, z: 0.8 };
const THUMB_OUT = { x: 0, y: -1.0, z: 0.2 };
const THUMB_CLAW = { x: -2, y: 3, z: -4 };
const THUMB_PALM = { x: 1.5, y: -0.5, z: 0.5 };
const THUMB_PALM2 = { x: 1.5, y: -0.5, z: -0.65 };
const TIL = Math.PI / 4.6; 
const v = (x, y, z) => new THREE.Vector3(x, y, z);

const PATH_ARC_J = [
    v(1, 3, 8),  
    v(0, -2, 8), 
    v(-2, -1, 8) 
];

const PATH_STRAIGHT_H = [
    v(-3, 0, 8), 
    v(3, 0, 8)   
];

const PATH_Z = [
    v(-2, 2, 8), 
    v(2, 2, 8),  
    v(-2, -2, 8),
    v(2, -2, 8)  
];

const PATH_HOOK = [
    v(0, -1.5, 8),
    v(0, 1, 8),
    v(1.5, 2, 8),
    v(2, 1.5, 8)
];

const PATH_UNION = [
    v(-2.5, 1.5, 8),   
    v(-2, -1, 8),      
    v(0, -2.5, 8),     
    v(2, -1, 8),      
    v(2.5, 1.5, 8)     
];

const PATH_INTERSECTION = [
    v(-2.5, -1.5, 8), 
    v(-2, 1, 8),      
    v(0, 2.5, 8),     
    v(2, 1, 8),      
    v(2.5, -1.5, 8)    
];

const SIGNS = {
  A: {
    fingers: {
      thumb: THUMB_TUCKED,
      index: CURLED,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_FRONT,
  },
  S: {
    fingers: {
      thumb: THUMB_OUT,
      index: CURLED,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    }, 
    rotation: VIEW_FRONT,
  },
  M: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: STRETCHED,
      pinky: CURLED,
    }, 
    rotation: VIEW_QUARTER,
  },
  N: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_QUARTER,
  },

  Ñ: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_QUARTER,
    path: PATH_UNION,
  },

  T: {
    fingers: {
      thumb: THUMB_PALM2,
      index: QUARTER,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_FRONT,
  },

  L: {
    fingers: {
      thumb: THUMB_TUCKED,
      index: STRETCHED,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_FRONT,
  },
  G: {
    fingers: {
      thumb: THUMB_DEFAULT,
      index: STRETCHED,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_MIDDLE,
  },

  B: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: STRETCHED,
      pinky: STRETCHED,
    },
    rotation: VIEW_FRONT,
  },
  E: {
    fingers: {
      thumb: THUMB_PALM,
      index: QUARTER,
      middle: QUARTER,
      ring: QUARTER,
      pinky: QUARTER,
    },
    rotation: VIEW_FRONT,
  },
  W: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: STRETCHED,
      pinky: CURLED,
    },
    rotation: VIEW_FRONT,
  },

  C: {
    fingers: {
      thumb: THUMB_CLAW,
      index: QUARTER,
      middle: QUARTER,
      ring: QUARTER,
      pinky: QUARTER,
    },
    rotation: VIEW_SIDE,
  },
  D: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_FRONT,
  },
  F: {
    fingers: {
      thumb: THUMB_PALM,
      index: QUARTER,
      middle: STRETCHED,
      ring: STRETCHED,
      pinky: STRETCHED,
    },
  },
  H: {
    fingers: {
      thumb: THUMB_DEFAULT,
      index: STRETCHED,
      middle: STRETCHED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_MIDDLE,
  },
  I: {
    fingers: {
      thumb: THUMB_PALM,
      index: CURLED,
      middle: CURLED,
      ring: CURLED,
      pinky: STRETCHED,
    },
    rotation: VIEW_SIDE,
  },
  J: {
    fingers: {
      thumb: THUMB_PALM,
      index: CURLED,
      middle: CURLED,
      ring: CURLED,
      pinky: STRETCHED,
    },
    rotation: VIEW_SIDE,
    path: PATH_ARC_J
  },
  K: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: QUARTER2,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_SIDE,
    path: PATH_INTERSECTION
  }, 
  O: {
    fingers: {
      thumb: THUMB_CLAW,
      index: HALF,
      middle: HALF,
      ring: HALF,
      pinky: HALF,
    },
    rotation: VIEW_SIDE,
  },
  P: {
    fingers: {
      thumb: THUMB_OUT,
      index: STRETCHED,
      middle: QUARTER2,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_SIDE,
  },
  Q: {
    fingers: {
      thumb: THUMB_CLAW,
      index: QUARTER,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_QUARTER2,
    path: PATH_UNION
  }, 
  R: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: { bend: TIL, side: -5 },
      ring: CURLED,
      pinky: CURLED,
    },
  },
  U: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: CURLED,
      pinky: CURLED,
    },
  },
  V: {
    fingers: {
      thumb: THUMB_PALM,
      index: STRETCHED,
      middle: STRETCHED,
      ring: CURLED,
      pinky: CURLED,
    },
  },
  X: {
    fingers: {
      thumb: THUMB_CLAW,
      index: QUARTER,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    rotation: VIEW_QUARTER3,
    path:PATH_STRAIGHT_H
  },
  Y: {
    fingers: {
      thumb: THUMB_DEFAULT,
      index: CURLED,
      middle: CURLED,
      ring: CURLED,
      pinky: STRETCHED,
    },
  },
  Z: {
    fingers: {
      thumb: THUMB_PALM2,
      index: STRETCHED,
      middle: CURLED,
      ring: CURLED,
      pinky: CURLED,
    },
    path: PATH_Z,
  },
};

const HandModel = memo(({ signToShow }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const palmRef = useRef(null);
  const articulationsRef = useRef({
    thumb: [],
    index: [],
    middle: [],
    ring: [],
    pinky: [],
  });

  const pathMeshRef = useRef(null);
  const arrowStartRef = useRef(null);
  const arrowEndRef = useRef(null);

  const targetRef = useRef({
    fingers: {
      thumb: THUMB_DEFAULT, 
      index: 0,
      middle: 0,
      ring: 0,
      pinky: 0,
    },
    handRotation: VIEW_FRONT,
    pathPoints:null,
  });

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    scene.background = new THREE.Color(0xf0f2f5);
    scene.fog = new THREE.Fog(0xf0f2f5, 10, 60);
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 4, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(5, 10, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);
    const backLight = new THREE.DirectionalLight(0xcfd8dc, 0.5);
    backLight.position.set(-5, 5, -10);
    scene.add(backLight);

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8c199,
      metalness: 0.1,
      roughness: 0.5,
    });

    const pathMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xff0000,
        emissive: 0x550000, 
        side: THREE.DoubleSide
    });

    const createSegment = (length, radius = 0.5) => {
      const geo = new THREE.CylinderGeometry(radius, radius, length, 16);
      const mesh = new THREE.Mesh(geo, skinMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      geo.rotateX(Math.PI / 2);
      geo.translate(0, 0, length / 2);
      return mesh;
    };

    const createFinger = (name, pos, lengths) => {
      const root = new THREE.Object3D();
      root.position.copy(pos);
      let parent = root;
      let currentZ = 0;
      lengths.forEach((l) => {
        const seg = createSegment(l, 0.48);
        seg.position.set(0, 0, currentZ);
        parent.add(seg);
        articulationsRef.current[name].push(seg);
        currentZ = l;
        parent = seg;
      });
      return root;
    };

    const palmGeometry = new THREE.BoxGeometry(6.5, 1, 5.5);
    palmGeometry.translate(0, 0, 1.5);
    const palm = new THREE.Mesh(palmGeometry, skinMaterial);
    palm.castShadow = true;
    palm.receiveShadow = true;
    scene.add(palm);
    palmRef.current = palm;
    palm.rotation.set(VIEW_FRONT.x, VIEW_FRONT.y, VIEW_FRONT.z);

    const armLength = 10;
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.5, armLength, 32),
      skinMaterial,
    );
    arm.rotation.x = Math.PI / 2;
    arm.position.set(0, 0, -armLength / 2 - 1);
    palm.add(arm);

    const thumb = createFinger(
      "thumb",
      new THREE.Vector3(3.4, -0.5, 1.5),
      [1.6, 2.2],
    );
    thumb.rotation.set(0, Math.PI / 2, Math.PI / 6);
    palm.add(thumb);

    palm.add(
      createFinger("index", new THREE.Vector3(2.3, 0, 4.2), [3.2, 2.8, 2.2]),
    );
    palm.add(
      createFinger("middle", new THREE.Vector3(0.5, 0, 4.5), [3.5, 3.0, 2.4]),
    );
    palm.add(
      createFinger("ring", new THREE.Vector3(-1.5, 0, 4.2), [3.1, 2.7, 2.2]),
    );
    palm.add(
      createFinger(
        "pinky",
        new THREE.Vector3(-3.0, -0.2, 3.5),
        [2.5, 2.0, 1.8],
      ),
    );

    let frameId;
    const lerpFactor = 0.1;

    const animate = (time) => {
      frameId = requestAnimationFrame(animate);
      const t = time * 0.001;
      if (palmRef.current) {
        const targetRot = targetRef.current.handRotation;
        const idleRotZ = Math.sin(t * 1.2) * 0.02;
        const idlePosY = Math.sin(t * 1.5) * 0.2;

        palmRef.current.rotation.x +=
          (targetRot.x - palmRef.current.rotation.x) * lerpFactor;
        palmRef.current.rotation.y +=
          (targetRot.y - palmRef.current.rotation.y) * lerpFactor;
        palmRef.current.rotation.z +=
          (targetRot.z + idleRotZ - palmRef.current.rotation.z) * lerpFactor;

        palmRef.current.position.y = idlePosY;
      }

      Object.keys(articulationsRef.current).forEach((fingerName) => {
        const segments = articulationsRef.current[fingerName];
        const targetFingers = targetRef.current.fingers;

        segments.forEach((seg, index) => {
          const idleFinger = Math.sin(t * 2 + index) * 0.005;

          if (fingerName === "thumb") {
            const targetThumb = targetFingers.thumb;
            seg.rotation.x += (targetThumb.x - seg.rotation.x) * lerpFactor;
            seg.rotation.y += (targetThumb.y - seg.rotation.y) * lerpFactor;
            seg.rotation.z += (targetThumb.z - seg.rotation.z) * lerpFactor;
          } else {
            const rawValue = targetFingers[fingerName];
            let targetBend = 0; 
            let targetSide = 0;

            if (typeof rawValue === "object" && rawValue !== null) {
              targetBend = rawValue.bend;
              targetSide = rawValue.side || 0;
            } else {
              targetBend = rawValue;
              targetSide = 0;
            }

            let actualTargetX = targetBend;
            if (targetBend < 0) {
              if (index === 0) {
                actualTargetX = targetBend;
              } else {
                actualTargetX = STRETCHED; 
              }
            }

            const finalTargetX = actualTargetX + idleFinger;
            seg.rotation.x += (finalTargetX - seg.rotation.x) * lerpFactor;
            if (index === 0) {
              seg.rotation.y += (targetSide - seg.rotation.y) * lerpFactor;
            } else {
              seg.rotation.y += (0 - seg.rotation.y) * lerpFactor;
            }
          }
        });
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (currentMount && renderer.domElement)
        currentMount.removeChild(renderer.domElement);
    };
  }, []);

  const updatePathVisualization = (points) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (pathMeshRef.current) {
        scene.remove(pathMeshRef.current);
        pathMeshRef.current.geometry.dispose();
    }
    if (arrowStartRef.current) {
        scene.remove(arrowStartRef.current);
        arrowStartRef.current.geometry.dispose();
    }
    if (arrowEndRef.current) {
        scene.remove(arrowEndRef.current);
        arrowEndRef.current.geometry.dispose();
    }

    if (!points || points.length < 2) return;

    const pathMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0x330000 });
    const arrowGeometry = new THREE.ConeGeometry(0.4, 1, 12); 
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
    const pathMesh = new THREE.Mesh(tubeGeometry, pathMaterial);
    scene.add(pathMesh);
    pathMeshRef.current = pathMesh;

    const startPoint = curve.getPointAt(0);
    const startTangent = curve.getTangentAt(0); 
    const arrowStart = new THREE.Mesh(arrowGeometry, pathMaterial);
    arrowStart.position.copy(startPoint);
    arrowStart.lookAt(startPoint.clone().add(startTangent));
    arrowStart.rotateX(Math.PI / 2);
    scene.add(arrowStart);
    arrowStartRef.current = arrowStart;
    const endPoint = curve.getPointAt(1);
    const endTangent = curve.getTangentAt(1); 
    const arrowEnd = new THREE.Mesh(arrowGeometry, pathMaterial);
    arrowEnd.position.copy(endPoint);
    arrowEnd.lookAt(endPoint.clone().add(endTangent));
    arrowEnd.rotateX(Math.PI / 2);
    scene.add(arrowEnd);
    arrowEndRef.current = arrowEnd;
  };

  useEffect(() => {
    const signData = SIGNS[signToShow] || SIGNS["A"];
    targetRef.current = {
      fingers: signData.fingers, 
      handRotation: signData.rotation || VIEW_FRONT,
    };
    updatePathVisualization(signData.path || null);
  }, [signToShow]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        background: "linear-gradient(160deg, #e0eafc 0%, #cfdef3 100%)",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
      }}
    />
  );
});

export default HandModel;
