/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useRef, useEffect, memo } from 'react';
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
    const palmRef = useRef(null); 
    const articulationsRef = useRef({ thumb: [], index: [], middle: [], ring: [], pinky: [] });
    // angulos finales para lograr interpolacion
    const targetAnglesRef = useRef({thumb:{x:0,y:0,z:0},index:0,middle:0,ring:0,pinky:0});
    
    // EFECTO 1: Inicialización unica
    useEffect(() => {
        const currentMount = mountRef.current;
        // Escena y Cámara
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        scene.background = new THREE.Color(0xf0f2f5);
        scene.fog = new THREE.Fog(0xf0f2f5, 10,50);

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 15);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Luces
       const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
       scene.add(ambientLight);
       
       const spotLight = new THREE.SpotLight(0xffffff, 1);  
       spotLight.position.set(10, 20, 10);
       scene.add(spotLight); 

        // Material y Construcción de la Mano
        const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xe8c199, metalness: 0.05, roughness: 0.4 });

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
        palmRef.current = palm;
        palm.rotation.set(-Math.PI/2,0, 0);
        
        // Añadir dedos
        palm.add(createFinger('thumb', new THREE.Vector3(-3.5, 0.7, -1), [2.5, 2]));
        // Ajuste inicial pulgar
        const thumbBase = palm.children[0]; 
        thumbBase.rotation.set(Math.PI /2 , -Math.PI / 1.8, -Math.PI / 16);

        palm.add(createFinger('index', new THREE.Vector3(-2.5, 0, 2.7), [3, 2.5, 2]));
        palm.add(createFinger('middle', new THREE.Vector3(-0.7, 0, 3), [3, 2.5, 2]));
        palm.add(createFinger('ring', new THREE.Vector3(1.2, 0, 2.65), [3, 2.5, 2]));
        palm.add(createFinger('pinky', new THREE.Vector3(3, 0, 2), [3, 2.5, 2]));

        // Loop de animación
        let frameId;
        const lerpFactor = 0.12; // Factor de interpolación
        
        const animate = (time) => {
            frameId = requestAnimationFrame(animate);
            const t = time * 0.001;
            // Animación suave de la palma  
            if(palmRef.current){
                palmRef.current.rotation.y = Math.sin(t * 1.5) * 0.15; 
                palmRef.current.rotation.z = Math.sin(t * 1.2) * 0.02;
            }   
            
            // Actualizar rotación de cada dedo con suavizado
            Object.keys(articulationsRef.current).forEach(fingerName => {
                const segments = articulationsRef.current[fingerName];
                const target = targetAnglesRef.current;

                segments.forEach((seg,index) => {

                    const idleOffset = Math.sin(t * 2 + index) * 0.02;

                    if (fingerName === 'thumb') {
                        // Interpolación para X, Y, Z del pulgar
                        seg.rotation.x += (target.thumb.x - seg.rotation.x) * lerpFactor;
                        seg.rotation.y += (target.thumb.y - seg.rotation.y) * lerpFactor;
                        seg.rotation.z += (target.thumb.z - seg.rotation.z) * lerpFactor;
                    } else {
                        // Interpolación solo para X en los demás dedos
                        const targetX = target[fingerName] + idleOffset;
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

    // EFECTO 2: Solo actualiza los ángulos OBJETIVO (no aplica el cambio directo)
    useEffect(() => {
        const angles = SIGNS[signToShow] ||SIGNS['A'];
        let thumbRotation = { x: Math.PI / 4, y: Math.PI / 2, z: Math.PI / 45 };
        // if (!angles) return;
        // // Calculamos los objetivos según tu lógica original
        // const newTargets = { ...angles };
        // let thumbRotation = { x: 0, y: 0, z: 0 };

        if (['A', 'Y', 'G', 'H', 'L'].includes(signToShow)) {
            thumbRotation = { x: STRETCHED, y: STRETCHED, z: -THUMB_A_SIDE };
        } else if (signToShow === 'C') {
            thumbRotation = { x: -Math.PI / 0.5, y: -Math.PI / 2.5, z: -Math.PI / 3 };
        } else if (signToShow === 'B') {
            thumbRotation = { x: -Math.PI / 56, y: Math.PI / 2, z: Math.PI / 24 };
        } else {
            thumbRotation = { x: Math.PI / 4, y: Math.PI / 2, z: Math.PI / 45 };
        }

        targetAnglesRef.current = {
            ...angles,
            thumb: thumbRotation
        };
    }, [signToShow]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%',borderRadius:'12px', overflow:'hidden',
        background:'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'
     }} />;
});

export default HandModel;