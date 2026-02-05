import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

// client/src/components/QuizPage.jsx
const QuizAttempt = () => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log('Fetching quiz with ID:', id);
        const response = await api.get(`/quiz/${id}`);
        console.log('Quiz response:', response.data);
        setQuiz(response.data);
      } catch (error) {
        console.error('Full error:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerId) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/results/submit', {
        quizId: quiz._id,
        answers: Object.entries(answers).map(([questionIndex, selectedOption]) => ({
          selectedOption,
          questionIndex: parseInt(questionIndex)
        })),
        timeSpent: 900 - timeLeft
      });

      if (response.data) {
        navigate(`/score/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">Failed to load quiz</p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const question = quiz.questions[currentQuestion];

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              <Clock className="h-5 w-5" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {timeLeft <= 300 && (
            <Alert variant="warning" className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                5 minutes remaining! Please review your answers.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="whitespace-pre-wrap">
              {question.text}
            </div>
            <RadioGroup
              value={answers[currentQuestion]}
              onValueChange={handleAnswerSelect}
              className="space-y-4 mt-4"
            >
              {question.options.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`}
                    className="w-5 h-5"
                  />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="text-base cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizAttempt;
