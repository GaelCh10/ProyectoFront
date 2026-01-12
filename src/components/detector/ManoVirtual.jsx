    /* eslint-disable react/prop-types */
    /* eslint-disable react/display-name */
import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- 1. DEFINICIÓN DE POSICIONES CLAVE ---

// Ángulos de dedos comunes
const STRETCHED = 0; 
const CURLED = Math.PI / 1.7;
const HALF = Math.PI / 2;
const QUARTER = Math.PI / 3;

// Rotaciones de la Mano (Palma)
const VIEW_FRONT = { x: -Math.PI / 2, y: 0, z: 0 };
const VIEW_SIDE = { x: -Math.PI / 2, y: 0, z: -Math.PI / 3 }; 
const VIEW_QUARTER = { x: Math.PI / 2, y: 0, z: -Math.PI / 6 };

// --- NUEVO: Rotaciones del Pulgar (Extraídas de tu lógica anterior) ---

// Base / Natural
const THUMB_DEFAULT = { x: 0, y: -Math.PI/6, z: Math.PI/6 }; 

// Grupo 1: Pegado/Cruzado (A, S, M, N, T)
const THUMB_TUCKED = { x: 0.5, y: -0.5, z: 0.8 }; 

// Grupo 2: Estirado hacia afuera (L, G)
const THUMB_OUT = { x: 0, y: -1.0, z: 0.2 }; 

const THUMB_CLAW = { x: -2, y: 3, z: -4};

// Grupo 3: Doblado sobre la palma (B, E, W)
const THUMB_PALM = { x: 1.5, y: -0.5, z: 0.5 };


// --- 2. DICCIONARIO DE SEÑAS COMPLETO ---
// Ahora 'thumb' contiene la rotación XYZ directa.

const SIGNS = {
  // --- GRUPO 1: Pulgar Cruzado (TUCKED) ---
  'A': { 
      fingers: { thumb: THUMB_TUCKED, index: CURLED, middle: CURLED, ring: CURLED, pinky: CURLED },
      rotation: VIEW_FRONT 
  },
  'S': { 
      fingers: { thumb: THUMB_TUCKED, index: CURLED, middle: CURLED, ring: CURLED, pinky: CURLED }, // Nota: S suele poner el pulgar sobre los dedos, aquí usamos Tucked
      rotation: VIEW_FRONT 
  },
  'M': { 
      fingers: { thumb: THUMB_TUCKED, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: CURLED }, // Ajustado para M
      rotation: VIEW_FRONT 
  },
  'N': { 
      fingers: { thumb: THUMB_TUCKED, index: STRETCHED, middle: STRETCHED, ring: CURLED, pinky: CURLED },
      rotation: VIEW_FRONT 
  },
  'T': { 
      fingers: { thumb: THUMB_TUCKED, index: CURLED, middle: CURLED, ring: CURLED, pinky: CURLED }, 
      rotation: VIEW_FRONT 
  },

  // --- GRUPO 2: Pulgar Afuera (OUT) ---
  'L': { 
      fingers: { thumb: THUMB_OUT, index: STRETCHED, middle: CURLED, ring: CURLED, pinky: CURLED },
      rotation: VIEW_FRONT
  },
  'G': { 
      fingers: { thumb: THUMB_OUT, index: STRETCHED, middle: CURLED, ring: CURLED, pinky: CURLED }, 
      rotation: VIEW_QUARTER 
  },

  // --- GRUPO 3: Pulgar en Palma (PALM) ---
  'B': { 
      fingers: { thumb: THUMB_PALM, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: STRETCHED },
      rotation: VIEW_FRONT
  },
  'E': { 
      fingers: { thumb: THUMB_PALM, index: QUARTER, middle: QUARTER, ring: QUARTER, pinky: QUARTER },
      rotation: VIEW_FRONT
  },
  'W': { 
      fingers: { thumb: THUMB_PALM, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: CURLED },
      rotation: VIEW_FRONT 
  },

  // --- RESTO (Usan THUMB_DEFAULT o variaciones menores) ---
  'C': { 
      fingers: { thumb: THUMB_CLAW, index: QUARTER, middle: QUARTER, ring: QUARTER, pinky: QUARTER },
      rotation: VIEW_SIDE 
  },
  'D': { 
      fingers: { thumb: THUMB_PALM, index: STRETCHED, middle: CURLED, ring: CURLED, pinky: CURLED }, // D a veces usa Palm
      rotation: VIEW_SIDE 
  },
  'F': { fingers: { thumb: THUMB_DEFAULT, index: QUARTER, middle: STRETCHED, ring: CURLED, pinky: CURLED } },
  'H': { fingers: { thumb: THUMB_DEFAULT, index: STRETCHED, middle: STRETCHED, ring: CURLED, pinky: CURLED }, rotation: VIEW_QUARTER },
  'I': { fingers: { thumb: THUMB_TUCKED, index: CURLED, middle: CURLED, ring: CURLED, pinky: STRETCHED } },
  'K': { fingers: { thumb: THUMB_DEFAULT, index: STRETCHED, middle: QUARTER, ring: CURLED, pinky: CURLED } }, // K suele llevar pulgar entre medio
  'O': { 
      fingers: { thumb: THUMB_CLAW, index: HALF, middle: HALF, ring: HALF, pinky: HALF },
      rotation: VIEW_SIDE 
  },
  'P': { fingers: { thumb: THUMB_DEFAULT, index: STRETCHED, middle: QUARTER, ring: CURLED, pinky: CURLED }, rotation: VIEW_SIDE },
  'Q': { fingers: { thumb: THUMB_DEFAULT, index: CURLED, middle: CURLED, ring: CURLED, pinky: CURLED }, rotation: VIEW_QUARTER }, // Similar a G pero abajo
  'R': { fingers: { thumb: THUMB_TUCKED, index: STRETCHED, middle: STRETCHED, ring: CURLED, pinky: CURLED } }, // Cruzados
  'U': { fingers: { thumb: THUMB_TUCKED, index: STRETCHED, middle: STRETCHED, ring: CURLED, pinky: CURLED } },
  'V': { fingers: { thumb: THUMB_TUCKED, index: STRETCHED, middle: STRETCHED, ring: CURLED, pinky: CURLED } },
  'X': {
      fingers: { thumb: THUMB_TUCKED, index: HALF, middle: CURLED, ring: CURLED, pinky: CURLED },
      rotation: VIEW_QUARTER 
  },
  'Y': { fingers: { thumb: THUMB_OUT, index: CURLED, middle: CURLED, ring: CURLED, pinky: STRETCHED } },
  'Z': { fingers: { thumb: THUMB_TUCKED, index: STRETCHED, middle: CURLED, ring: CURLED, pinky: CURLED } },
};

const HandModel = memo(({ signToShow }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const palmRef = useRef(null); 
    const articulationsRef = useRef({ thumb: [], index: [], middle: [], ring: [], pinky: [] });
    
    // Almacena objetivos: Dedos + Rotación de la Mano entera
    const targetRef = useRef({
        fingers: {
            thumb: THUMB_DEFAULT, // Inicializamos con el default
            index: 0, middle: 0, ring: 0, pinky: 0
        },
        handRotation: VIEW_FRONT 
    });

    useEffect(() => {
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Fondo y Niebla
        scene.background = new THREE.Color(0xf0f2f5); 
        scene.fog = new THREE.Fog(0xf0f2f5, 10, 60);

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
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

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const spotLight = new THREE.SpotLight(0xffffff, 0.8);
        spotLight.position.set(5, 10, 20);
        spotLight.castShadow = true;
        scene.add(spotLight);
        const backLight = new THREE.DirectionalLight(0xcfd8dc, 0.5);
        backLight.position.set(-5, 5, -10);
        scene.add(backLight);

        // Material
        const skinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe8c199, metalness: 0.1, roughness: 0.5,
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

        // --- CONSTRUCCIÓN MANO ---
        const palmGeometry = new THREE.BoxGeometry(6.5, 1, 5.5);
        palmGeometry.translate(0, 0, 1.5); 
        const palm = new THREE.Mesh(palmGeometry, skinMaterial);
        palm.castShadow = true;
        palm.receiveShadow = true;
        scene.add(palm);
        palmRef.current = palm;

        // Orientación Inicial
        palm.rotation.set(VIEW_FRONT.x, VIEW_FRONT.y, VIEW_FRONT.z);

        // Brazo
        const armLength = 10;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.5, armLength, 32), skinMaterial);
        arm.rotation.x = Math.PI / 2; 
        arm.position.set(0, 0, -armLength / 2 - 1); 
        palm.add(arm); 

        // Dedos (Mano Derecha)
        const thumb = createFinger('thumb', new THREE.Vector3(3.4, -0.5, 1.5), [1.6, 2.2]);
        thumb.rotation.set(0, Math.PI / 2, Math.PI / 6); 
        palm.add(thumb);

        palm.add(createFinger('index', new THREE.Vector3(2.3, 0, 4.2), [3.2, 2.8, 2.2]));
        palm.add(createFinger('middle', new THREE.Vector3(0.5, 0, 4.5), [3.5, 3.0, 2.4]));
        palm.add(createFinger('ring', new THREE.Vector3(-1.5, 0, 4.2), [3.1, 2.7, 2.2]));
        palm.add(createFinger('pinky', new THREE.Vector3(-3.0, -0.2, 3.5), [2.5, 2.0, 1.8]));

        // --- BUCLE ANIMACIÓN ---
        let frameId;
        const lerpFactor = 0.1;

        const animate = (time) => {
            frameId = requestAnimationFrame(animate);
            const t = time * 0.001; 

            // 1. ROTACIÓN DE LA MANO COMPLETA
            if (palmRef.current) {
                const targetRot = targetRef.current.handRotation;
                const idleRotZ = Math.sin(t * 1.2) * 0.02; 
                const idlePosY = Math.sin(t * 1.5) * 0.2;

                palmRef.current.rotation.x += (targetRot.x - palmRef.current.rotation.x) * lerpFactor;
                palmRef.current.rotation.y += (targetRot.y - palmRef.current.rotation.y) * lerpFactor;
                palmRef.current.rotation.z += ((targetRot.z + idleRotZ) - palmRef.current.rotation.z) * lerpFactor;
                
                palmRef.current.position.y = idlePosY;
            }

            // 2. MOVIMIENTO DE DEDOS
            Object.keys(articulationsRef.current).forEach(fingerName => {
                const segments = articulationsRef.current[fingerName];
                const targetFingers = targetRef.current.fingers;

                segments.forEach((seg, index) => {
                    const idleFinger = Math.sin(t * 2 + index) * 0.005;

                    if (fingerName === 'thumb') {
                        // AQUÍ ESTÁ LA MAGIA: Leemos directamente el objeto {x,y,z} del diccionario
                        // Ya no hay condicionales, solo interpolación hacia el objetivo
                        const targetThumb = targetFingers.thumb; 
                        seg.rotation.x += (targetThumb.x - seg.rotation.x) * lerpFactor;
                        seg.rotation.y += (targetThumb.y - seg.rotation.y) * lerpFactor;
                        seg.rotation.z += (targetThumb.z - seg.rotation.z) * lerpFactor;
                    } else {
                        const targetX = targetFingers[fingerName] + idleFinger;
                        seg.rotation.x += (targetX - seg.rotation.x) * lerpFactor;
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
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            renderer.dispose();
            if (currentMount && renderer.domElement) currentMount.removeChild(renderer.domElement);
        };
    }, []);

    // --- 3. EFECTO LIMPIO: SIN LÓGICA DE NEGOCIO ---
    useEffect(() => {
        // Solo asignamos los datos directamente del diccionario
        const signData = SIGNS[signToShow] || SIGNS['A'];
        
        targetRef.current = {
            fingers: signData.fingers, // Aquí ya viene el pulgar configurado con X,Y,Z
            handRotation: signData.rotation || VIEW_FRONT
        };
        
    }, [signToShow]);

    return (
        <div 
            ref={mountRef} 
            style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #e0eafc 0%, #cfdef3 100%)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
            }} 
        />
    );
});

export default HandModel;