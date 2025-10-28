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
    question: "What does PWA stand for?",
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
    question: "Which file is essential for a PWA to be installable?",
    options: ["service-worker.js", "manifest.json", "index.html"],
    correctAnswerIndex: 1,
    icon: Package,
  },
  {
    id: 3,
    question: "What is the primary role of a Service Worker?",
    options: [
      "To style the web page",
      "To handle network requests and enable offline capabilities",
      "To manage databases",
    ],
    correctAnswerIndex: 1,
    icon: RefreshCw,
  },
  {
    id: 4,
    question: "Which technology allows PWAs to store data offline?",
    options: ["Web Sockets", "Server-Sent Events", "IndexedDB"],
    correctAnswerIndex: 2,
    icon: Database,
  },
  {
    id: 5,
    question: "For a PWA to be installable, it must be served over...",
    options: ["HTTP", "HTTPS", "FTP"],
    correctAnswerIndex: 1,
    icon: ShieldCheck,
  },
  {
    id: 6,
    question: "The 'Add to Home Screen' prompt is a feature of which PWA aspect?",
    options: ["Installability", "Responsiveness", "Connectivity-independence"],
    correctAnswerIndex: 0,
    icon: Smartphone,
  },
  {
    id: 7,
    question: "What does the 'background_color' property in the manifest file define?",
    options: [
      "The app's font color",
      "The color of the browser toolbar",
      "The splash screen background color",
    ],
    correctAnswerIndex: 2,
    icon: Layers,
  },
  {
    id: 8,
    question: "Which API is used for sending push notifications in a PWA?",
    options: ["Fetch API", "Push API", "Cache API"],
    correctAnswerIndex: 1,
    icon: Signal,
  },
  {
    id: 9,
    question: "The 'App Shell' model in PWAs primarily improves...",
    options: ["Security", "Performance and user experience", "Database integration"],
    correctAnswerIndex: 1,
    icon: Puzzle,
  },
  {
    id: 10,
    question: "What is the purpose of the 'scope' property in a Service Worker registration?",
    options: [
      "Defines which pages the service worker can control",
      "Limits the amount of cache storage",
      "Sets the color scheme of the app",
    ],
    correctAnswerIndex: 0,
    icon: Cloud,
  },
];
