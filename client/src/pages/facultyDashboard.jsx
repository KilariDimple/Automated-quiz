import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const navigate = useNavigate();

  const handleFileChange = (event) => { 
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  const generateQuiz = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('title', selectedFile.name.replace('.pdf', ''));

      const { data: quiz } = await api.post('/quiz/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Success",
        description: "Quiz generated successfully",
      });

      setCreatedQuizzes(prev => [quiz, ...prev]);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Quiz generation error:', error.response?.data || error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to generate quiz",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzesResponse = await api.get('/quiz/faculty');
        setCreatedQuizzes(quizzesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingQuizzes(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    try {
      await api.delete(`/quiz/${quizId}`);
      setCreatedQuizzes(createdQuizzes.filter((quiz) => quiz._id !== quizId));
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Faculty Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Upload className="h-6 w-6" />
              Create New Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-300">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer block">
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-primary/60" />
                    <p className="text-lg text-muted-foreground">
                      Click to upload or drag and drop a PDF file
                    </p>
                  </div>
                </label>
                {selectedFile && (
                  <div className="mt-6 space-y-4">
                    <p className="text-lg text-primary">
                      Selected: {selectedFile.name}
                    </p>
                    <Button 
                      onClick={generateQuiz} 
                      className="w-full py-6 text-lg"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Quiz...
                        </>
                      ) : (
                        'Generate Quiz'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary p-6 rounded-lg text-center">
                <h3 className="text-3xl font-bold text-primary">{createdQuizzes.length}</h3>
                <p className="text-muted-foreground">Total Quizzes</p>
              </div>
              <div className="bg-secondary p-6 rounded-lg text-center">
                <h3 className="text-3xl font-bold text-primary">
                  {createdQuizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)}
                </h3>
                <p className="text-muted-foreground">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6" />
            Created Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingQuizzes ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : createdQuizzes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {createdQuizzes.map((quiz) => (
                <Card key={quiz._id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary">{quiz.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mb-4">
                      <span>{quiz.questions.length} questions</span>
                      <span>•</span>
                      <span>{format(new Date(quiz.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/quiz-preview/${quiz._id}`)}
                        className="flex-1"
                      >
                        View Results
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">No quizzes created yet. Upload a PDF to create your first quiz.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;