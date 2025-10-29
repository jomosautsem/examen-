"use client";

import type { Question } from '@/lib/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type QuestionCardProps = {
  question: Question;
  onAnswerSelect: (optionIndex: number) => void;
  selectedAnswer: number | null;
};

export function QuestionCard({ question, onAnswerSelect, selectedAnswer }: QuestionCardProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [question.id]);

  return (
    <Card 
      className={cn(
        "shadow-xl transition-all duration-500 ease-in-out",
        animate ? 'animate-fade-in-slide-up' : 'opacity-100'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-start gap-4 font-headline text-2xl">
          <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full mt-1">
            <question.icon className="w-6 h-6 text-primary" />
          </div>
          <span>{question.question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            return (
              <Label
                key={index}
                htmlFor={`${question.id}-${index}`}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all duration-200",
                  "hover:bg-accent/20",
                   isSelected ? "border-accent ring-2 ring-accent" : "border-border"
                )}
              >
                <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} className="h-5 w-5" />
                <span className="flex-grow">{option}</span>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
