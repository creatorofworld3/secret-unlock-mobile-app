
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ZKPAuth } from '@/utils/zkpUtils';
import { BiometricUtils } from '@/utils/biometricUtils';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff } from 'lucide-react';
import { BiometryType } from '@capacitor/biometric-auth';

interface LoginScreenProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState<BiometryType[]>([]);
  const { toast } = useToast();
  const { setUser, setToken, setLoading, biometricEnabled, setBiometricEnabled } = useAuthStore();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricUtils.isAvailable();
    const types = await BiometricUtils.getBiometryType();
    setBiometricAvailable(available);
    setBiometricTypes(types);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setLoading(true);

    try {
      // Generate ZK proof for authentication
      const zkProof = await ZKPAuth.generateZKProof(email, password);
      
      // In a real app, you would send the proof to your backend here
      console.log('Login ZK proof generated:', zkProof);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: Date.now().toString(),
        email,
        publicHash: zkProof.publicHash
      };
      
      const mockToken = `zkp_token_${Date.now()}`;
      
      setUser(mockUser);
      await setToken(mockToken);
      
      toast({
        title: "Login Successful!",
        description: "Authenticated with zero-knowledge proof.",
      });
      
      // Ask about biometric authentication if available and not already set
      if (biometricAvailable && !biometricEnabled) {
        setTimeout(() => {
          askForBiometricSetup();
        }, 1000);
      }
      
      onSuccess();
      
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const askForBiometricSetup = async () => {
    const biometricIcon = BiometricUtils.getBiometricIcon(biometricTypes);
    
    toast({
      title: `${biometricIcon} Enable Biometric Login?`,
      description: "Use Face ID/Touch ID for quick and secure access to your account.",
      action: (
        <Button
          onClick={enableBiometricAuth}
          size="sm"
          className="bg-zkp-gradient hover:opacity-90"
        >
          Enable
        </Button>
      ),
    });
  };

  const enableBiometricAuth = async () => {
    const success = await BiometricUtils.authenticate("Enable biometric authentication for this app");
    if (success) {
      await setBiometricEnabled(true);
      toast({
        title: "Biometric Authentication Enabled!",
        description: "You can now login using biometrics.",
      });
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricEnabled) {
      toast({
        title: "Biometric Not Enabled",
        description: "Please enable biometric authentication first.",
        variant: "destructive"
      });
      return;
    }

    const success = await BiometricUtils.authenticate("Login to your ZKP Auth account");
    
    if (success) {
      // In a real app, you would have stored the user's hash and retrieve it here
      const mockUser = {
        id: Date.now().toString(),
        email: "user@example.com", // This would be retrieved from secure storage
        publicHash: "mock_hash"
      };
      
      const mockToken = `zkp_biometric_token_${Date.now()}`;
      
      setUser(mockUser);
      await setToken(mockToken);
      
      toast({
        title: "Biometric Login Successful!",
        description: "Welcome back!",
      });
      
      onSuccess();
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
              className="w-16 h-16 mx-auto mb-4 bg-zkp-gradient rounded-full flex items-center justify-center animate-pulse-zkp"
            >
              <span className="text-2xl text-white">🔐</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-zkp-gradient bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sign in with zero-knowledge authentication
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zkp-gradient hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying ZK Proof...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {biometricAvailable && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or</span>
                </div>
              </div>
            )}

            {biometricAvailable && (
              <Button
                onClick={handleBiometricLogin}
                variant="outline"
                className="w-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
              >
                <span className="mr-2 text-lg">
                  {BiometricUtils.getBiometricIcon(biometricTypes)}
                </span>
                Sign in with Biometrics
              </Button>
            )}

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
