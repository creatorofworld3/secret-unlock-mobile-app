
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ZKPAuth } from '@/utils/zkpUtils';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterScreenProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setUser, setToken, setLoading } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      // Generate ZK proof for registration
      const zkProof = await ZKPAuth.generateZKProof(email, password);
      
      // In a real app, you would send the proof to your backend here
      // For demo purposes, we'll simulate a successful registration
      
      console.log('Registration ZK proof generated:', zkProof);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        id: Date.now().toString(),
        email,
        publicHash: zkProof.publicHash
      };
      
      const mockToken = `zkp_token_${Date.now()}`;
      
      setUser(mockUser);
      await setToken(mockToken);
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created with zero-knowledge proof authentication.",
      });
      
      onSuccess();
      
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-zkp-gradient rounded-full flex items-center justify-center"
            >
              <span className="text-2xl text-white">🔐</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-zkp-gradient bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Register with zero-knowledge proof authentication
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-gray-700/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/50 dark:bg-gray-700/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-gray-700/50"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zkp-gradient hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating ZK Proof...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterScreen;
