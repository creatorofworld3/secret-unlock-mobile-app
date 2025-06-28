
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.84f024a5af874267b7e7cb56a6db2d68',
  appName: 'ZKP Auth App',
  webDir: 'dist',
  server: {
    url: 'https://84f024a5-af87-4267-b7e7-cb56a6db2d68.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
    },
    BiometricAuth: {
      allowDeviceCredential: true
    }
  }
};

export default config;
