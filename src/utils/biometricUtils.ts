
import { BiometricAuth, BiometryType } from '@capacitor/biometric-auth';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class BiometricUtils {
  static async isAvailable(): Promise<boolean> {
    try {
      const result = await BiometricAuth.checkBiometry();
      return result.isAvailable;
    } catch (error) {
      console.log('Biometric not available:', error);
      return false;
    }
  }

  static async getBiometryType(): Promise<BiometryType[]> {
    try {
      const result = await BiometricAuth.checkBiometry();
      return result.biometryTypes || [];
    } catch (error) {
      console.log('Could not get biometry types:', error);
      return [];
    }
  }

  static async authenticate(reason: string = 'Authenticate to access your account'): Promise<boolean> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
      
      const result = await BiometricAuth.authenticate({
        reason,
        title: 'Biometric Authentication',
        negativeButtonText: 'Cancel'
      });
      
      if (result.isAuthenticated) {
        await Haptics.impact({ style: ImpactStyle.Medium });
        console.log('Biometric authentication successful');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return false;
    }
  }

  static getBiometricIcon(types: BiometryType[]): string {
    if (types.includes(BiometryType.faceId)) return '👤';
    if (types.includes(BiometryType.touchId)) return '👆';
    if (types.includes(BiometryType.fingerprintAuthentication)) return '👆';
    return '🔐';
  }
}
