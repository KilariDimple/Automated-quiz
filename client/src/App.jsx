// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login';
import FacultyDashboard from './pages/facultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import QuizPreview from './pages/quizPreview';
import QuizPage from './pages/quizPage';
import QuizScore from './pages/quizScore';
import Navbar from './components/Navbar';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Faculty Routes */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <Navbar />
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz-preview/:id"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <Navbar />
                  <QuizPreview />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Navbar />
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Navbar />
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/score/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Navbar />
                  <QuizScore />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
