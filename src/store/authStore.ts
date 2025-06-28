
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';

interface User {
  id: string;
  email: string;
  publicHash: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      biometricEnabled: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
        console.log('User set in store:', user);
      },

      setToken: async (token) => {
        await Preferences.set({ key: 'auth_token', value: token });
        set({ token, isAuthenticated: true });
        console.log('Token saved securely');
      },

      logout: async () => {
        await Preferences.remove({ key: 'auth_token' });
        await Preferences.remove({ key: 'biometric_enabled' });
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          biometricEnabled: false 
        });
        console.log('User logged out');
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setBiometricEnabled: async (enabled) => {
        await Preferences.set({ key: 'biometric_enabled', value: enabled.toString() });
        set({ biometricEnabled: enabled });
        console.log('Biometric setting updated:', enabled);
      },

      initializeAuth: async () => {
        try {
          const { value: token } = await Preferences.get({ key: 'auth_token' });
          const { value: biometricEnabledStr } = await Preferences.get({ key: 'biometric_enabled' });
          
          if (token) {
            set({ 
              token, 
              isAuthenticated: true,
              biometricEnabled: biometricEnabledStr === 'true'
            });
            console.log('Auth initialized from storage');
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        biometricEnabled: state.biometricEnabled 
      }),
    }
  )
);
