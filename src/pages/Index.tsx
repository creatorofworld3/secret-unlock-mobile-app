
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import SplashScreenComponent from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import RegisterScreen from '@/components/RegisterScreen';
import HomeScreen from '@/components/HomeScreen';

type Screen = 'splash' | 'login' | 'register' | 'home';

const Index: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state on app start
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Navigate to home if already authenticated (after splash)
    if (isAuthenticated && currentScreen !== 'splash') {
      setCurrentScreen('home');
    }
  }, [isAuthenticated, currentScreen]);

  const handleSplashComplete = () => {
    if (isAuthenticated) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSwitchToRegister = () => {
    setCurrentScreen('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentScreen('login');
  };

  // Render current screen
  switch (currentScreen) {
    case 'splash':
      return <SplashScreenComponent onComplete={handleSplashComplete} />;
    
    case 'login':
      return (
        <LoginScreen
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    
    case 'register':
      return (
        <RegisterScreen
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
    
    case 'home':
      return <HomeScreen />;
    
    default:
      return <SplashScreenComponent onComplete={handleSplashComplete} />;
  }
};

export default Index;
