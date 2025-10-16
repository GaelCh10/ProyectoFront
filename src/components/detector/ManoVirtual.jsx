import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- CONSTANTES Y DEFINICIÓN DE SEÑAS ---
// (He completado la lista de señas basándome en tu HTML original para que funcione con todo el abecedario)
const STRETCHED = 0; 
const BENT = Math.PI / 1.7;
const HALF_BENT = Math.PI / 2;
const MEDIUM_BENT = Math.PI / 3;
const THUMB_A_SIDE = Math.PI / 6;
const textureLoader =new THREE.TextureLoader();

const SIGNS = {
    'A': { thumb: STRETCHED, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
    'B': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: STRETCHED },
    'C': { thumb: BENT, index: MEDIUM_BENT, middle: MEDIUM_BENT, ring: MEDIUM_BENT, pinky: MEDIUM_BENT },
    'D': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
    'E': { thumb: BENT, index: HALF_BENT, middle: HALF_BENT, ring: HALF_BENT, pinky: HALF_BENT },
    'F': { thumb: BENT, index: MEDIUM_BENT, middle: STRETCHED, ring: BENT, pinky: BENT },
    'G': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
    'H': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
    'I': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
    'J': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
    'K': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
    'L': { thumb: STRETCHED, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
    'M': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
    'N': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
    'O': { thumb: BENT, index: HALF_BENT, middle: HALF_BENT, ring: HALF_BENT, pinky: HALF_BENT },
    'P': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
    'R': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
    'S': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
    'T': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
    'U': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
    'V': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
    'W': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: BENT },
    'Y': { thumb: STRETCHED, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
};

const HandModel = memo(({ signToShow }) => {
    console.log('Renderizando modelo 3D: ${signToShow}');
    const mountRef = useRef(null);
    
    useEffect(() => {
        const currentMount = mountRef.current;
        let renderer; // Hacemos renderer accesible en el return de limpieza

        // ✅ CORRECCIÓN 1: Declaramos la variable `fingerNames` aquí para que sea visible
        const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];
        
        // --- INICIALIZACIÓN DE LA ESCENA ---
        const scene = new THREE.Scene();

        const backgroundTexture = textureLoader.load('./assets/IMG/fondomano.webp',
            function(texture){
                scene.background= texture;
            },
            undefined, 
            function(err){
                console.log('error al cargar el fondo', err);
            }
        );
        //scene.background = new THREE.Color(0x333333);
        
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 15);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        
        // ... (El resto de tu código de inicialización: luces, material, etc., va aquí)
        const ambientLight = new THREE.AmbientLight(0xfffff0, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
        directionalLight.position.set(-5, 0, 5);
        scene.add(directionalLight);

        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8c199,
            metalness: 0.1,
            roughness: 0.6
        });
        
        const fingerArticulations = { thumb: [], index: [], middle: [], ring: [], pinky: [] };
        const standardLengths = [3, 2.5, 2];
        const thumbLengths = [2.5, 2];

        function createSegment(length) {
            const geometry = new THREE.CylinderGeometry(0.5, 0.5, length, 10);
            const segment = new THREE.Mesh(geometry, skinMaterial);
            geometry.rotateX(Math.PI / 2);
            geometry.translate(0, 0, length / 2);
            return segment;
        }

        function createFinger(name, basePosition, segmentLengths) {
            const fingerRoot = new THREE.Object3D();
            fingerRoot.position.copy(basePosition);
            let currentParent = fingerRoot;
            let currentZ = 0;
            segmentLengths.forEach((length) => {
                const segment = createSegment(length);
                segment.position.set(0, 0, currentZ);
                currentParent.add(segment);
                fingerArticulations[name].push(segment);
                currentZ = length;
                currentParent = segment;
            });
            return fingerRoot;
        }

        const palmGeometry = new THREE.BoxGeometry(7, 1, 5);
        palmGeometry.translate(0, 0, 0.5);
        const palm = new THREE.Mesh(palmGeometry, skinMaterial);
        scene.add(palm);
        palm.rotation.y = -Math.PI;
        palm.rotation.x = Math.PI / 2;

        const thumb = createFinger('thumb', new THREE.Vector3(-3.5, 0.7, -1), thumbLengths);
        thumb.rotation.y = -Math.PI / 1.8;
        thumb.rotation.z = -Math.PI / 16;
        thumb.rotation.x = Math.PI * 4;
        palm.add(thumb);
        
        const index = createFinger('index', new THREE.Vector3(-2.5, 0, 2.7), standardLengths);
        palm.add(index);
        const middle = createFinger('middle', new THREE.Vector3(-0.7, 0, 3), standardLengths);
        palm.add(middle);
        const ring = createFinger('ring', new THREE.Vector3(1.2, 0, 2.65), standardLengths);
        palm.add(ring);
        const pinky = createFinger('pinky', new THREE.Vector3(3, 0, 2), standardLengths);
        palm.add(pinky);

        // --- FUNCIÓN PARA APLICAR LA SEÑA ---
        const setSign = (signName) => {
            if (!SIGNS[signName] || !fingerNames) return;
            const angles = SIGNS[signName];
            
            fingerNames.forEach(fingerName => {
                const angle = angles[fingerName];
                fingerArticulations[fingerName].forEach(segment => {
                    if (fingerName === 'thumb') {
                        // Lógica del pulgar...
                        if (signName === 'A') {
                            segment.rotation.z = -THUMB_A_SIDE;
                            segment.rotation.y = STRETCHED;
                            segment.rotation.x = STRETCHED;
                        } else if (signName === 'C') {
                            segment.rotation.y = -Math.PI / 2.5;
                            segment.rotation.z = -Math.PI / 3;
                            segment.rotation.x = -Math.PI / 0.5;
                        } else if (signName === 'B') {
                            segment.rotation.y = Math.PI / 2;
                            segment.rotation.z = Math.PI / 24;
                            segment.rotation.x = -Math.PI / 56;
                        } else {
                            segment.rotation.y = Math.PI / 2;
                            segment.rotation.z = Math.PI / 45;
                            segment.rotation.x = Math.PI / 4;
                        }
                    } else {
                        segment.rotation.x = -angle;
                    }
                });
            });
             // ✅ CORRECCIÓN 2: Eliminamos la línea `currentSignText.textContent`
        };

        // Actualizamos la mano cada vez que la prop `signToShow` cambie
        setSign(signToShow);

        // --- CICLO DE ANIMACIÓN ---
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // --- MANEJO DE REDIMENSIONAMIENTO ---
        const handleResize = () => {
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // --- FUNCIÓN DE LIMPIEZA ---
        return () => {
            window.removeEventListener('resize', handleResize);
            // Validamos que `currentMount` y `renderer` existan antes de remover
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, [signToShow]); // El efecto se vuelve a ejecutar solo si `signToShow` cambia

    return (
        <div 
            ref={mountRef} 
            style={{ width: '100%', height: '100%' }}
        >
        </div>
    );
});

export default HandModel;