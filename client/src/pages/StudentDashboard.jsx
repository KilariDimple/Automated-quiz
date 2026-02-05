import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quiz/student');
        setQuizzes(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quizzes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const getQuizStatus = (quiz) => {
    const attempt = quiz.attemptedStudents.find(a => a.student.toString() === userId);
    if (attempt) {
      return {
        status: 'completed',
        score: attempt.score
      };
    }
    return {
      status: 'available'
    };
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewResults = (quizId) => {
    navigate(`/quiz-results/${quizId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-gray-600">Welcome back! Here are your available quizzes.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {quizzes.map((quiz) => {
          const { status, score } = getQuizStatus(quiz);
          return (
            <Card key={quiz._id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {quiz.questions.length} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.timeLimit} minutes
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {status === 'completed' ? (
                    <>
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Score: {score}%
                      </Badge>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleViewResults(quiz._id)}
                      >
                        View Results
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Available
                      </Badge>
                      <Button 
                        className="flex items-center gap-2"
                        onClick={() => handleStartQuiz(quiz._id)}
                      >
                        Start Quiz
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {!isLoading && quizzes.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">No Quizzes Available</h3>
              <p className="text-gray-600">
                There are no quizzes assigned to you at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;