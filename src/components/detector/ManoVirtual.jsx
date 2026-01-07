import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const STRETCHED = 0; 
const BENT = Math.PI / 1.7;
const HALF_BENT = Math.PI / 2;
const MEDIUM_BENT = Math.PI / 3;
const THUMB_A_SIDE = Math.PI / 6;

const SIGNS = {
  'A': { thumb: STRETCHED, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'B': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: STRETCHED },
  'C': { thumb: BENT, index: MEDIUM_BENT, middle: MEDIUM_BENT, ring: MEDIUM_BENT, pinky: MEDIUM_BENT },
  'D': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
  'E': { thumb: BENT, index: HALF_BENT, middle: HALF_BENT, ring: HALF_BENT, pinky: HALF_BENT },
  'F': { thumb: BENT, index: MEDIUM_BENT, middle: STRETCHED, ring: BENT, pinky: BENT },
  'G': { thumb: STRETCHED, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
  'H': { thumb: STRETCHED, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'I': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
  'J': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
  'K': { thumb: BENT, index: STRETCHED, middle: MEDIUM_BENT, ring: BENT, pinky: BENT },
  'L': { thumb: STRETCHED, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
  'M': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: BENT },
  'N': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'Ñ': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'O': { thumb: BENT, index: HALF_BENT, middle: HALF_BENT, ring: HALF_BENT, pinky: HALF_BENT },
  'P': { thumb: BENT, index: STRETCHED, middle: MEDIUM_BENT, ring: BENT, pinky: BENT },
  'Q': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'R': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'S': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'T': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'U': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'V': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'W': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: BENT },
  'X': { thumb: BENT, index: HALF_BENT, middle: BENT, ring: BENT, pinky: BENT },
  'Y': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
  'Z': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
};

const HandModel = memo(({ signToShow }) => {
    const mountRef = useRef(null);
    // Usamos refs para persistir los objetos de Three.js entre renders sin recrearlos
    const sceneRef = useRef(null);
    const articulationsRef = useRef({ thumb: [], index: [], middle: [], ring: [], pinky: [] });

    // EFECTO 1: Inicialización (Solo ocurre una vez al montar)
    useEffect(() => {
        const currentMount = mountRef.current;
        
        // Escena y Cámara
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        
        const loader = new THREE.TextureLoader();
        loader.load('./assets/IMG/fondomano.webp', (texture) => {
            scene.background = texture;
        });

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 15);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Luces
        scene.add(new THREE.AmbientLight(0xfffff0, 0.5));
        const directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
        directionalLight.position.set(-5, 0, 5);
        scene.add(directionalLight);

        // Material y Construcción de la Mano
        const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xe8c199, metalness: 0.1, roughness: 0.6 });

        const createSegment = (length) => {
            const geometry = new THREE.CylinderGeometry(0.5, 0.5, length, 10);
            const segment = new THREE.Mesh(geometry, skinMaterial);
            geometry.rotateX(Math.PI / 2);
            geometry.translate(0, 0, length / 2);
            return segment;
        };

        const createFinger = (name, basePosition, segmentLengths) => {
            const fingerRoot = new THREE.Object3D();
            fingerRoot.position.copy(basePosition);
            let currentParent = fingerRoot;
            let currentZ = 0;
            segmentLengths.forEach((length) => {
                const segment = createSegment(length);
                segment.position.set(0, 0, currentZ);
                currentParent.add(segment);
                articulationsRef.current[name].push(segment); // Guardar en la Ref persistente
                currentZ = length;
                currentParent = segment;
            });
            return fingerRoot;
        };

        const palm = new THREE.Mesh(new THREE.BoxGeometry(7, 1, 5), skinMaterial);
        palm.geometry.translate(0, 0, 0.5);
        scene.add(palm);
        palm.rotation.set(Math.PI / 2, -Math.PI, 0);

        // Añadir dedos
        palm.add(createFinger('thumb', new THREE.Vector3(-3.5, 0.7, -1), [2.5, 2]));
        // Ajuste inicial pulgar
        const thumbBase = palm.children[0]; 
        thumbBase.rotation.set(Math.PI * 4, -Math.PI / 1.8, -Math.PI / 16);

        palm.add(createFinger('index', new THREE.Vector3(-2.5, 0, 2.7), [3, 2.5, 2]));
        palm.add(createFinger('middle', new THREE.Vector3(-0.7, 0, 3), [3, 2.5, 2]));
        palm.add(createFinger('ring', new THREE.Vector3(1.2, 0, 2.65), [3, 2.5, 2]));
        palm.add(createFinger('pinky', new THREE.Vector3(3, 0, 2), [3, 2.5, 2]));

        // Loop de animación
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // Limpieza al desmontar el componente (Solo ocurre cuando cierras la app)
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            renderer.dispose();
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []); // Array vacío: Solo se ejecuta una vez

    // EFECTO 2: Actualización de la seña (Solo ocurre cuando signToShow cambia)
    useEffect(() => {
        const fingerArticulations = articulationsRef.current;
        const signData = SIGNS[signToShow];

        if (!signData) return;

        Object.keys(fingerArticulations).forEach(fingerName => {
            const angle = signData[fingerName];
            fingerArticulations[fingerName].forEach(segment => {
                if (fingerName === 'thumb') {
                    // Lógica específica del pulgar
                    if (['A', 'Y', 'G', 'H', 'L'].includes(signToShow)) {
                        segment.rotation.set(STRETCHED, STRETCHED, -THUMB_A_SIDE);
                    } else if (signToShow === 'C') {
                        segment.rotation.set(-Math.PI / 0.5, -Math.PI / 2.5, -Math.PI / 3);
                    } else if (signToShow === 'B') {
                        segment.rotation.set(-Math.PI / 56, Math.PI / 2, Math.PI / 24);
                    } else {
                        segment.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI / 45);
                    }
                } else {
                    // Dedos normales: solo rotación en X
                    segment.rotation.x = -angle;
                }
            });
        });
    }, [signToShow]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
});

export default HandModel;