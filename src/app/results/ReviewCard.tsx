"use client";

import type { Question } from '@/lib/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReviewCardProps = {
  question: Question;
  userAnswer: number | null;
};

export function ReviewCard({ question, userAnswer }: ReviewCardProps) {
  const isCorrect = userAnswer === question.correctAnswerIndex;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-start gap-4 font-headline text-xl">
          <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full mt-1">
            <question.icon className="w-6 h-6 text-primary" />
          </div>
          <span>{question.question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isUserAnswer = userAnswer === index;
            const isCorrectAnswer = question.correctAnswerIndex === index;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors",
                  isCorrectAnswer && "bg-green-100 dark:bg-green-900/30 border-green-400",
                  isUserAnswer && !isCorrectAnswer && "bg-red-100 dark:bg-red-900/30 border-red-400",
                  !isCorrectAnswer && !isUserAnswer && "border-border"
                )}
              >
                <span className="flex-grow">{option}</span>
                {isCorrectAnswer && <Check className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />}
                {isUserAnswer && !isCorrectAnswer && <X className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />}
              </div>
            );
          })}
        </div>
        {userAnswer === null && (
            <p className="mt-4 text-sm text-center text-muted-foreground font-semibold">No respondiste esta pregunta.</p>
        )}
      </CardContent>
    </Card>
  );
}
