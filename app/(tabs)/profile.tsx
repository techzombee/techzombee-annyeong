import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import PaywallModal from '@/components/PaywallModal';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [paywallOpen, setPaywallOpen] = useState(false);

  async function handleSignOut() {
    await signOut(auth);
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email ?? user?.displayName ?? 'User'}</Text>

      <TouchableOpacity style={styles.upgradeButton} onPress={() => setPaywallOpen(true)}>
        <Text style={styles.upgradeText}>Upgrade to Pro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  email: { color: '#333', fontSize: FontSize.md, marginBottom: Spacing.xl },
  upgradeButton: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: Spacing.md },
  upgradeText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  button: { backgroundColor: '#f5f5f5', padding: Spacing.md, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#666', fontWeight: '600' },
});
