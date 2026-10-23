import type { CapturePermission } from '@playlexi/audio-contract';
import type { PermissionResponse } from 'expo-audio';

export function mapExpoPermission(response: PermissionResponse): CapturePermission {
  if (response.granted) return 'granted';
  if (response.status === 'undetermined') return 'undetermined';
  return response.canAskAgain ? 'denied' : 'blocked';
}
