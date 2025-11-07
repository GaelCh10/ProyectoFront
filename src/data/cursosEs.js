// Archivo: src/data/premiumCursosMock.js
export const cursosEspecialesMock = [
  {
    id: 101,
    titulo: "React Avanzado y Hooks",
    descripcion: "Domina la programación funcional y los custom Hooks.",
    temas: [
      { id: 1, titulo: "Introducción a Hooks", contenido: "Contenido del tema 1..." },
      { id: 2, titulo: "Uso de useReducer", contenido: "Contenido del tema 2..." },
      { id: 3, titulo: "Creación de Custom Hooks", contenido: "Contenido del tema 3..." },
    ],
    preguntas: [
      // Simula el formato de tus preguntas para la evaluación
      { id: 1, pregunta: "¿Qué hook reemplaza a componentDidMount y componentWillUnmount?", opciones: [{ id: 1, respuesta: "useEffect", esCorrecto: true }, { id: 2, respuesta: "useState", esCorrecto: false }] },
      { id: 2, pregunta: "La mejor práctica con Hooks:", opciones: [{ id: 3, respuesta: "Llamarlos siempre al inicio", esCorrecto: true }, { id: 4, respuesta: "Llamarlos en un if", esCorrecto: false }] },
    ],
  },
  {
    id: 102,
    titulo: "Despliegue con AWS",
    descripcion: "Aprende a desplegar aplicaciones React en la nube de AWS.",
    temas: [
      { id: 4, titulo: "Configuración de S3", contenido: "Contenido del tema 1..." },
      { id: 5, titulo: "Uso de CloudFront", contenido: "Contenido del tema 2..." },
    ],
    preguntas: [], // Curso sin evaluación
  },
];

// Función utilitaria para simular llamadas a la API
export const obtenerCursoPorId = (id) => cursosEspecialesMock.find(c => c.id === parseInt(id));
export const obtenerTemasPorCursoId = (id) => obtenerCursoPorId(id)?.temas || [];
export const obtenerPreguntasPorCursoId = (id) => obtenerCursoPorId(id)?.preguntas || [];