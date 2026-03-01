import { Platform } from 'react-native';

const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
}) ?? '';

export async function initRevenueCat(userId?: string) {
  if (Platform.OS === 'web') return;
  const { default: Purchases, LOG_LEVEL } = await import('react-native-purchases');
  Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({ apiKey: API_KEY, appUserID: userId });
}

export async function hasPremium(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { default: Purchases } = await import('react-native-purchases');
  const info = await Purchases.getCustomerInfo();
  return info.entitlements.active['annyeong_pro'] !== undefined;
}
