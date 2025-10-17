// AbecedarioInteractivo.jsx

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './mano.css'; // Importamos los estilos

// --- CONSTANTES (Las movemos fuera del componente para que no se redeclaren) ---
const STRETCHED = 0; 
const BENT = Math.PI / 1.7;
const HALF_BENT = Math.PI / 2;
const MEDIUM_BENT = Math.PI / 3;
const THUMB_A_SIDE = Math.PI / 6;
const THUMB_B_TUCK = Math.PI * 0.9;

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
  'Ñ': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'O': { thumb: BENT, index: HALF_BENT, middle: HALF_BENT, ring: HALF_BENT, pinky: HALF_BENT },
  'P': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
  'Q': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'R': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'S': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'T': { thumb: BENT, index: BENT, middle: BENT, ring: BENT, pinky: BENT },
  'U': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'V': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: BENT, pinky: BENT },
  'W': { thumb: BENT, index: STRETCHED, middle: STRETCHED, ring: STRETCHED, pinky: BENT },
  'X': { thumb: BENT, index: HALF_BENT, middle: BENT, ring: BENT, pinky: BENT },
  'Y': { thumb: STRETCHED, index: BENT, middle: BENT, ring: BENT, pinky: STRETCHED },
  'Z': { thumb: BENT, index: STRETCHED, middle: BENT, ring: BENT, pinky: BENT },
};

const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];

export default function AbecedarioInteractivo() {
    // 1. Usamos useState para manejar la seña actual (reemplaza a la variable global)
    const [currentSign, setCurrentSign] = useState('C');
    
    // 2. Usamos useRef para obtener el 'div' donde irá el canvas de Three.js
    const handViewRef = useRef(null);
    
    // 3. Usamos useRef para guardar objetos de Three.js que persisten entre renders
    const threeJsObjects = useRef({});

    // 4. useEffect para la lógica de Three.js
    useEffect(() => {
        // --- CÓDIGO DE INICIALIZACIÓN (Solo se ejecuta una vez) ---
        const handView = handViewRef.current;
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);
        
        const camera = new THREE.PerspectiveCamera(75, handView.clientWidth / handView.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 15);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(handView.clientWidth, handView.clientHeight);
        handView.appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        
        // Luces y Material
        scene.add(new THREE.AmbientLight(0xfffff0, 0.5));
        const directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
        directionalLight.position.set(-5, 0, 5);
        scene.add(directionalLight);
        
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8c199, 
            metalness: 0.1, 
            roughness: 0.6 
        });

        // Articulaciones (las guardamos en el ref para acceder a ellas después)
        const fingerArticulations = { thumb: [], index: [], middle: [], ring: [], pinky: [] };
        threeJsObjects.current.fingerArticulations = fingerArticulations; // Guardamos la referencia
        
        const standardLengths = [3, 2.5, 2];
        const thumbLengths = [2.5, 2];

        // Funciones para crear la mano (igual que en tu script)
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

        // Crear Palma y Dedos
        const palmGeometry = new THREE.BoxGeometry(7, 1, 5);
        palmGeometry.translate(0, 0, 0.5);
        const palm = new THREE.Mesh(palmGeometry, skinMaterial);
        scene.add(palm);
        
        palm.rotation.y = Math.PI; // Rotación para que mire al frente
        palm.rotation.x = -Math.PI / 2; 
        
        const thumb = createFinger('thumb', new THREE.Vector3(-3.5, 0.7, -1), thumbLengths);
        thumb.rotation.y = -Math.PI /1.8; 
        thumb.rotation.z = -Math.PI / 16; 
        thumb.rotation.x = Math.PI *4;
        palm.add(thumb);
        
        palm.add(createFinger('index', new THREE.Vector3(-2.5, 0, 2.7), standardLengths));
        palm.add(createFinger('middle', new THREE.Vector3(-0.7, 0, 3), standardLengths));
        palm.add(createFinger('ring', new THREE.Vector3(1.2, 0, 2.65), standardLengths));
        palm.add(createFinger('pinky', new THREE.Vector3(3, 0, 2), standardLengths));

        // Ciclo de Renderizado
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); 
            renderer.render(scene, camera);
        }
        animate();

        // Manejo de Redimensionamiento
        const handleResize = () => {
            const WIDTH = handView.clientWidth;
            const HEIGHT = handView.clientHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', handleResize);

        // Función de Limpieza (se ejecuta cuando el componente se desmonta)
        return () => {
            window.removeEventListener('resize', handleResize);
            handView.removeChild(renderer.domElement);
        }

    }, []); // El array vacío `[]` asegura que este useEffect se ejecute SOLO UNA VEZ.

    
    // 5. useEffect para ACTUALIZAR la mano (se ejecuta CADA VEZ que 'currentSign' cambia)
    useEffect(() => {
        // Obtenemos las articulaciones que guardamos en el ref
        const articulations = threeJsObjects.current.fingerArticulations;
        if (!articulations) return; // Si aún no se ha inicializado, salimos

        const angles = SIGNS[currentSign];
        if (!angles) return; // Si la seña no existe, salimos

        fingerNames.forEach(fingerName => {
            const angle = angles[fingerName];
            articulations[fingerName].forEach(segment => {
                // Aquí va la misma lógica de rotación de tu script original
                if (fingerName === 'thumb') {
                    if (currentSign === 'A') {
                        segment.rotation.z = -THUMB_A_SIDE; 
                        segment.rotation.y = STRETCHED; 
                        segment.rotation.x = STRETCHED; 
                    } else if (currentSign === 'C') {
                        segment.rotation.y = -Math.PI /2.5; 
                        segment.rotation.z = -Math.PI/3; 
                        segment.rotation.x = -Math.PI/0.5; 
                    } else if (currentSign === 'B') { 
                        segment.rotation.z = -THUMB_B_TUCK * 0.9;
                        segment.rotation.y = -angle * 0.5; 
                        segment.rotation.x = angle * 0.1; 
                    } else { 
                        segment.rotation.y = Math.PI / 2; 
                        segment.rotation.z = Math.PI/45; 
                        segment.rotation.x = Math.PI/4;
                    }
                } else {
                    segment.rotation.x = -angle; 
                }
            });
        });

    }, [currentSign]); // Este array hace que el hook se ejecute cada vez que 'currentSign' cambie

    
    // 6. El JSX (El HTML "traducido" a React)
    return (
        // Usamos la clase que definimos en el CSS
        <div className="abecedario-container">
            {/* Usamos el 'ref' para decirle a Three.js dónde renderizar.
              En React, 'class' se escribe 'className'.
            */}
            <div id="hand-view" ref={handViewRef}></div>

            <div id="controls-view">
                <h2>Abecedario LSM (A-Z)</h2>
                <div id="button-controls">
                    {/* Los eventos 'onclick' se escriben 'onClick'.
                      En lugar de llamar a una función global, cambiamos el estado.
                    */}
                    <button className="lsm-button" onClick={() => setCurrentSign('A')}>A <span className="button-desc">Puño cerrado.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('B')}>B <span className="button-desc">Mano abierta, dedos estirados.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('C')}>C <span className="button-desc">Dedos curvos (Forma de C).</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('D')}>D <span className="button-desc">Índice levantado, otros doblados.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('E')}>E <span className="button-desc">Todos curvados hacia la palma.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('F')}>F <span className="button-desc">Pinza con pulgar e índice.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('G')}>G <span className="button-desc">Índice recto, pulgar al lado.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('H')}>H <span className="button-desc">Índice y medio rectos juntos.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('I')}>I <span className="button-desc">Meñique levantado.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('J')}>J <span className="button-desc">Meñique levantado.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('K')}>K <span className="button-desc">Medio separado (tipo paz), pulgar entre.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('L')}>L <span className="button-desc">Pulgar e índice en forma de L.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('M')}>M <span className="button-desc">Pulgar bajo tres dedos.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('N')}>N <span className="button-desc">Pulgar bajo dos dedos.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('Ñ')}>Ñ <span className="button-desc">N + Movimiento</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('O')}>O <span className="button-desc">Punta de los dedos se tocan.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('P')}>P <span className="button-desc">K invertida.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('Q')}>Q <span className="button-desc">Pinza pulgar/índice hacia abajo.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('R')}>R <span className="button-desc">Dedos índice y medio cruzados.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('S')}>S <span className="button-desc">Puño cerrado (como 'A').</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('T')}>T <span className="button-desc">Pulgar entre índice y medio.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('U')}>U <span className="button-desc">Índice y medio rectos juntos.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('V')}>V <span className="button-desc">Índice y medio separados.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('W')}>W <span className="button-desc">Tres dedos rectos.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('X')}>X <span className="button-desc">Índice doblado.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('Y')}>Y <span className="button-desc">Pulgar y meñique levantados.</span></button>
                    <button className="lsm-button" onClick={() => setCurrentSign('Z')}>Z <span className="button-desc">Índice arriba (dibujar Z).</span></button>
                </div>
                
                {/* El contenido de este <p> ahora está controlado por el estado 'currentSign'
                */}
                <p id="current-sign">Seña actual: {currentSign}</p>
            </div>
        </div>
    );
}