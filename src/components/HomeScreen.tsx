
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { BiometricUtils } from '@/utils/biometricUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const HomeScreen: React.FC = () => {
  const { user, logout, biometricEnabled, setBiometricEnabled } = useAuthStore();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
    });
  };

  const toggleBiometric = async () => {
    if (!biometricEnabled) {
      const success = await BiometricUtils.authenticate("Enable biometric authentication");
      if (success) {
        await setBiometricEnabled(true);
        toast({
          title: "Biometric Enabled",
          description: "Biometric authentication has been enabled.",
        });
      }
    } else {
      await setBiometricEnabled(false);
      toast({
        title: "Biometric Disabled",
        description: "Biometric authentication has been disabled.",
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-zkp-gradient rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white">🔐</span>
          </div>
          <h1 className="text-3xl font-bold bg-zkp-gradient bg-clip-text text-transparent mb-2">
            Welcome to ZKP Auth
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            You're securely authenticated with zero-knowledge proofs
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👤</span>
                Account Information
              </CardTitle>
              <CardDescription>
                Your zero-knowledge authenticated profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium">Email:</span>
                <span className="text-gray-600 dark:text-gray-300">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium">User ID:</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {user?.id}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-medium">Public Hash:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {user?.publicHash.substring(0, 12)}...
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔒</span>
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="biometric">Biometric Authentication</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use Face ID or Touch ID for quick access
                  </p>
                </div>
                <Switch
                  id="biometric"
                  checked={biometricEnabled}
                  onCheckedChange={toggleBiometric}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ZKP Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🧮</span>
                Zero-Knowledge Proofs
              </CardTitle>
              <CardDescription>
                How your privacy is protected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    ✅ Password Never Sent
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your password stays on your device and is never transmitted to servers.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    🔐 Cryptographic Proof
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Mathematical proof verifies you know the password without revealing it.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    🛡️ Maximum Privacy
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Even if servers are compromised, your password remains secure.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                    ⚡ Efficient Verification
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    Fast authentication without compromising security or privacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-8"
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="px-8 py-3 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
          >
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeScreen;
