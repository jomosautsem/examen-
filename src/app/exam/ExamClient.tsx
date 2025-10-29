"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { questions, Question } from '@/lib/questions';
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

export function ExamClient() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
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
  }, [router, toast]);


  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    setTimeout(() => handleNext(), 300);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!currentUser) {
        toast({ title: 'Error', description: 'Faltan los datos del usuario.', variant: 'destructive' });
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
        answers,
        timestamp: new Date().toISOString(),
    };

    try {
      // 1. Always save to IndexedDB first.
      await addUser(currentUser);
      await addResult(resultData);

      if (isOnline) {
        toast({ title: 'Guardado localmente', description: 'Sincronizando con el servidor...' });
        // 2. Attempt to sync with the server if online.
        const response = await saveUserAndResult({ user: currentUser, result: resultData });
        if (response.success) {
            toast({ title: '¡Sincronización Completa!', description: 'Tus resultados se han guardado en el servidor.' });
        } else {
            // This is not a critical error, data is already saved locally.
            toast({ title: 'Fallo de Sincronización', description: 'No se pudo guardar en el servidor. Tus datos están seguros localmente.'});
        }
      } else {
        // 3. If offline, just notify the user.
        toast({ title: 'Sin Conexión', description: 'Tus resultados se guardaron localmente y se sincronizarán más tarde.'});
      }
    } catch (error) {
        // This catch block now ONLY handles errors from IndexedDB.
        console.error("Failed to save data locally:", error);
        toast({ title: 'Error Crítico de Guardado', description: 'No se pudo guardar el resultado localmente. Por favor, revisa los permisos.', variant: 'destructive' });
        setIsSubmitting(false);
        return; // Stop execution if local save fails
    }
    
    // 4. Clean up and redirect, as long as local save was successful.
    localStorage.removeItem('currentUser');
    router.push(`/results?score=${score}&correct=${correctAnswers}&incorrect=${incorrectAnswers}`);
  };

  const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex]);
  const answeredCount = useMemo(() => answers.filter(a => a !== null).length, [answers]);
  
  if (!currentUser) {
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
                direction={direction}
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
