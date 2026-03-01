import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const { user } = useAuth();

  async function handleSignOut() {
    await signOut(auth);
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email ?? user?.displayName ?? 'User'}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  email: { color: Colors.text, fontSize: FontSize.md, marginBottom: Spacing.xl },
  button: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  buttonText: { color: Colors.primary, fontWeight: 'bold' },
});
