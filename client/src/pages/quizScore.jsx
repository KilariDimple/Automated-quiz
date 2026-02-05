import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowLeft, Award } from 'lucide-react';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/results/score/${id}`);
        const resultData = {
          quiz: response.data.quiz,
          score: response.data.score,
          timeSpent: response.data.timeSpent,
          questions: response.data.quiz.questions.map((q, index) => ({
            text: q.text,
            userAnswer: response.data.answers[index]?.selectedOption,
            correctAnswer: q.correctOption,
            isCorrect: response.data.answers[index]?.selectedOption === q.correctOption
          }))
        };
        setResult(resultData);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load quiz results</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/student')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{result.quiz?.title || 'Quiz Results'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Award className={`h-12 w-12 mx-auto mb-2 ${getScoreColor(result.score)}`} />
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </div>
                  <p className="text-gray-600">Final Score</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      {result.correctAnswers}/{result.totalQuestions}
                    </div>
                    <p className="text-gray-600">Correct Answers</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{result.timeSpent}</div>
                    <p className="text-gray-600">Time Spent</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Question Review</h3>
            {result.questions.map((question, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {question.isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    )}
                    <div className="space-y-2">
                      <p className="font-medium">Question {index + 1}:</p>
                      <p>{question.text}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Your answer:</p>
                        <p className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {question.userAnswer}
                        </p>
                        {!question.isCorrect && (
                          <>
                            <p className="text-sm text-gray-600 mt-2">Correct answer:</p>
                            <p className="text-green-600">{question.correctAnswer}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;