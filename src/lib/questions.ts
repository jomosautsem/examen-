import type { LucideIcon } from 'lucide-react';
import { Layers, Rocket, Package, RefreshCw, Puzzle, Cloud, Smartphone, Signal, Database, ShieldCheck, AppWindow, Bell, Archive, Sparkles, Home, Network, Orbit, FileCode, Apple, Server } from 'lucide-react';

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  icon: LucideIcon;
};

export const questions: Question[] = [
  {
    id: 1,
    question: "¿Qué significa PWA?",
    options: [
      "Progressive Web Application",
      "Partial Web App",
      "Procedural Web App",
    ],
    correctAnswerIndex: 0,
    icon: Rocket,
  },
  {
    id: 2,
    question: "¿Qué archivo es esencial para que una PWA sea instalable?",
    options: ["service-worker.js", "manifest.json", "index.html"],
    correctAnswerIndex: 1,
    icon: Package,
  },
  {
    id: 3,
    question: "¿Cuál es el rol principal de un Service Worker?",
    options: [
      "Dar estilo a la página web",
      "Manejar solicitudes de red y habilitar capacidades sin conexión",
      "Administrar bases de datos",
    ],
    correctAnswerIndex: 1,
    icon: RefreshCw,
  },
  {
    id: 4,
    question: "¿Qué tecnología permite a las PWAs almacenar datos sin conexión?",
    options: ["Web Sockets", "Server-Sent Events", "IndexedDB"],
    correctAnswerIndex: 2,
    icon: Database,
  },
  {
    id: 5,
    question: "Para que una PWA sea instalable, debe ser servida sobre...",
    options: ["HTTP", "HTTPS", "FTP"],
    correctAnswerIndex: 1,
    icon: ShieldCheck,
  },
  {
    id: 6,
    question: "El aviso 'Añadir a la pantalla de inicio' es una característica de qué aspecto de una PWA?",
    options: ["Instalabilidad", "Responsividad", "Independencia de la conectividad"],
    correctAnswerIndex: 0,
    icon: Smartphone,
  },
  {
    id: 7,
    question: "¿Qué define la propiedad 'background_color' en el archivo de manifiesto?",
    options: [
      "El color de la fuente de la aplicación",
      "El color de la barra de herramientas del navegador",
      "El color de fondo de la pantalla de bienvenida",
    ],
    correctAnswerIndex: 2,
    icon: Layers,
  },
  {
    id: 8,
    question: "¿Qué API se utiliza para enviar notificaciones push en una PWA?",
    options: ["Fetch API", "Push API", "Cache API"],
    correctAnswerIndex: 1,
    icon: Signal,
  },
  {
    id: 9,
    question: "El modelo 'App Shell' en las PWAs mejora principalmente...",
    options: ["La seguridad", "El rendimiento y la experiencia del usuario", "La integración con bases de datos"],
    correctAnswerIndex: 1,
    icon: Puzzle,
  },
  {
    id: 10,
    question: "¿Cuál es el propósito de la propiedad 'scope' en el registro de un Service Worker?",
    options: [
      "Define qué páginas puede controlar el service worker",
      "Limita la cantidad de almacenamiento en caché",
      "Establece el esquema de color de la aplicación",
    ],
    correctAnswerIndex: 0,
    icon: Cloud,
  },
  {
    id: 11,
    question: "¿Qué propiedad del manifiesto define cómo se muestra la PWA?",
    options: ["display", "orientation", "theme_color"],
    correctAnswerIndex: 0,
    icon: AppWindow,
  },
  {
    id: 12,
    question: "¿Qué son las Notificaciones Push?",
    options: [
      "Mensajes que la app envía al servidor",
      "Alertas que aparecen dentro de la app",
      "Mensajes que el servidor puede enviar al usuario, incluso si la app está cerrada",
    ],
    correctAnswerIndex: 2,
    icon: Bell,
  },
  {
    id: 13,
    question: "¿Para qué se utiliza la Cache API?",
    options: [
      "Para almacenar contraseñas de forma segura",
      "Para almacenar respuestas de red (assets, datos de API) y usarlas sin conexión",
      "Para guardar el estado de la sesión del usuario",
    ],
    correctAnswerIndex: 1,
    icon: Archive,
  },
  {
    id: 14,
    question: "¿Qué significa que una PWA es 're-engageable' (re-atractiva)?",
    options: [
      "Que la app puede rediseñarse fácilmente",
      "Que puede atraer de nuevo al usuario con funciones como Notificaciones Push",
      "Que los usuarios pueden calificar la aplicación",
    ],
    correctAnswerIndex: 1,
    icon: Sparkles,
  },
  {
    id: 15,
    question: "¿Qué hace la propiedad 'start_url' en el manifest.json?",
    options: [
      "La URL donde el Service Worker está alojado",
      "La página de inicio de la PWA cuando se abre desde el ícono",
      "La URL para desinstalar la aplicación",
    ],
    correctAnswerIndex: 1,
    icon: Home,
  },
  {
    id: 16,
    question: "¿Qué evento del Service Worker se dispara cuando se intercepta una solicitud de red?",
    options: ["install", "activate", "fetch"],
    correctAnswerIndex: 2,
    icon: Network,
  },
  {
    id: 17,
    question: "¿Cuáles son los eventos principales del ciclo de vida de un Service Worker?",
    options: [
      "load, unload, error",
      "install, activate, fetch",
      "start, stop, pause",
    ],
    correctAnswerIndex: 1,
    icon: Orbit,
  },
  {
    id: 18,
    question: "El archivo 'manifest.json' es un archivo de formato...",
    options: ["XML", "YAML", "JSON"],
    correctAnswerIndex: 2,
    icon: FileCode,
  },
  {
    id: 19,
    question: "¿Cuál es una limitación conocida de las PWAs en iOS comparado con Android?",
    options: [
      "No pueden acceder a la cámara",
      "Las Notificaciones Push no están disponibles en Safari para PWAs",
      "No pueden funcionar sin conexión",
    ],
    correctAnswerIndex: 1,
    icon: Apple,
  },
  {
    id: 20,
    question: "¿Qué estrategia de caché del Service Worker carga primero desde la red y recurre a la caché si falla?",
    options: ["Cache-First", "Network-First", "Stale-While-Revalidate"],
    correctAnswerIndex: 1,
    icon: Server,
  },
];
