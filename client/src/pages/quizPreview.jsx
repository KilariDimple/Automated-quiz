import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

// client/src/components/QuizPreview.jsx
const QuizPreview = ({ questions = [], onPublish, onRegenerate }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (questionId, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
      <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quiz Preview</span>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={onRegenerate}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate Questions
              </Button>
              <Button 
                onClick={onPublish}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Publish Quiz
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap">
                      {question.text}
                    </div>
                    <RadioGroup
                      value={selectedAnswers[qIndex]}
                      onValueChange={(value) => handleAnswerSelect(qIndex, value)}
                    >
                      {question.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${qIndex}-${option}`} />
                          <Label htmlFor={`q${qIndex}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                No questions generated yet. Please wait while we process your PDF.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPreview;


