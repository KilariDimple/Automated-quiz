// src/pages/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, UserCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [activeRole, setActiveRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "Please ensure both passwords match."
        });
        return;
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, {
        ...formData,
        role: activeRole
      });

      const { token, user } = response.data;
      login({ ...user, token });
      
      toast({
        title: isLogin ? "Login successful" : "Registration successful",
        description: `Welcome ${user.name}!`
      });

      navigate(user.role === 'faculty' ? '/faculty' : '/student');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Something went wrong"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Quiz Kitchen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={isLogin ? "login" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-muted">
              <TabsTrigger 
                value="login" 
                onClick={() => setIsLogin(true)} 
                className="rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                onClick={() => setIsLogin(false)} 
                className="rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted">
              <TabsTrigger 
                value="student" 
                className="rounded-sm text-sm py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Student
              </TabsTrigger>
              <TabsTrigger 
                value="faculty" 
                className="rounded-sm text-sm py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Faculty
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="pl-10 h-12 bg-background"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="pl-10 h-12 bg-background"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="pl-10 h-12 bg-background"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="pl-10 h-12 bg-background"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 mt-6 text-base font-semibold tracking-wide rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {isLogin ? 'Login' : 'Sign Up'} as {activeRole}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
