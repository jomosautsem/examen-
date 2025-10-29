"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { questions as allQuestions } from '@/lib/questions';
import { QuestionCard } from './QuestionCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useToast } from '@/hooks/use-toast';
import { saveUserAndResult } from '@/lib/actions';
import { addUser, addResult } from '@/lib/indexedDB';

interface User {
    id: string;
    name: string;
    enrollmentId: string;
}

const EXAM_QUESTION_COUNT = 10;

// Helper to shuffle array and pick N items
const getShuffledQuestions = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, EXAM_QUESTION_COUNT);
};

export function ExamClient() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        } else {
            toast({ title: 'Error', description: 'Usuario no encontrado. Redirigiendo al inicio.', variant: 'destructive' });
            router.replace('/');
        }
    } catch(e) {
        toast({ title: 'Error', description: 'No se pudieron cargar los datos del usuario.', variant: 'destructive' });
        router.replace('/');
    }
    
    const examQuestions = getShuffledQuestions();
    setQuestions(examQuestions);
    setAnswers(Array(examQuestions.length).fill(null));

  }, [router, toast]);


  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    setTimeout(() => handleNext(), 300);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!currentUser || questions.length === 0) {
        toast({ title: 'Error', description: 'Faltan los datos del usuario o las preguntas.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
    }

    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswerIndex).length;
    const incorrectAnswers = questions.length - correctAnswers;
    const score = (correctAnswers / questions.length) * 100;

    const resultData = {
        userId: currentUser.id,
        score,
        correctAnswers,
        incorrectAnswers,
        // Store question IDs and user answers for review
        answeredQuestions: questions.map((q, i) => ({ qId: q.id, answer: answers[i] })),
        timestamp: new Date().toISOString(),
    };

    try {
      await addUser(currentUser);
      await addResult(resultData);

      if (isOnline) {
        toast({ title: 'Guardado localmente', description: 'Sincronizando con el servidor...' });
        const response = await saveUserAndResult({ user: currentUser, result: resultData });
        if (response.success) {
            toast({ title: '¡Sincronización Completa!', description: 'Tus resultados se han guardado en el servidor.' });
        } else {
            toast({ title: 'Fallo de Sincronización', description: 'No se pudo guardar en el servidor. Tus datos están seguros localmente.'});
        }
      } else {
        toast({ title: 'Sin Conexión', description: 'Tus resultados se guardaron localmente y se sincronizarán más tarde.'});
      }
    } catch (error) {
        console.error("Failed to save data locally:", error);
        toast({ title: 'Error Crítico de Guardado', description: 'No se pudo guardar el resultado localmente. Por favor, revisa los permisos.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
    }
    
    localStorage.removeItem('currentUser');
    const answersString = resultData.answeredQuestions.map(aq => `${aq.qId}:${aq.answer ?? 'n'}`).join(',');
    router.push(`/results?score=${score}&correct=${correctAnswers}&incorrect=${incorrectAnswers}&answers=${answersString}`);
  };

  const progress = useMemo(() => (questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0), [currentQuestionIndex, questions.length]);
  const answeredCount = useMemo(() => answers.filter(a => a !== null).length, [answers]);
  
  if (!currentUser || questions.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold font-headline">Examen PWA</h1>
            <p className="text-muted-foreground">¡Bienvenido, {currentUser.name}!</p>
        </div>
        <Progress value={progress} className="mb-8 h-2" />
        
        <div className="relative overflow-hidden">
             <QuestionCard
                key={currentQuestionIndex}
                question={questions[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={answers[currentQuestionIndex]}
              />
        </div>
       
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <p className="text-sm text-muted-foreground">{answeredCount} de {questions.length} respondidas</p>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isSubmitting || answeredCount < questions.length}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Finalizar Examen
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
