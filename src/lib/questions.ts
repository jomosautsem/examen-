import type { LucideIcon } from 'lucide-react';
import { Layers, Rocket, Package, RefreshCw, Puzzle, Cloud, Smartphone, Signal, Database, ShieldCheck } from 'lucide-react';

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
];
